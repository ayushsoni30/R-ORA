import asyncio
import os
import sys
from datetime import datetime, date, timedelta, timezone

# Guarantee isolated test database
os.environ["MONGODB_DATABASE"] = "roomora_test_audit"
os.environ["MONGODB_URI"] = "mongodb://127.0.0.1:27017"

# Ensure backend root is on sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

import httpx
from httpx import ASGITransport
import jwt
from bson import ObjectId

from app.main import app
from app.core.config import settings
import app.db.mongodb as mongodb


async def run_all_tests():
    print("=" * 70)
    print("RUNNING ROOMORA BACKEND REMEDIATION TEST SUITE")
    print(f"Target DB: {mongodb.database.name} (ISOLATED TEST DATABASE)")
    print("=" * 70)

    client = mongodb.client
    db = mongodb.database

    # Setup isolated test database and initialize indexes
    await client.drop_database("roomora_test_audit")
    await mongodb.init_db_indexes()

    transport = ASGITransport(app=app)
    results = []

    def record(name, passed, detail=""):
        status = "PASSED" if passed else "FAILED"
        results.append({"name": name, "status": status, "detail": detail})
        symbol = "[PASS]" if passed else "[FAIL]"
        print(f"{symbol} {name}: {detail}")

    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as ac:

        # ---------------------------------------------------------
        # 1. System & Health Checks
        # ---------------------------------------------------------
        r = await ac.get("/")
        record("GET / Root endpoint", r.status_code == 200 and r.json().get("message") == "Welcome to Roomora API!", f"Status: {r.status_code}")

        r = await ac.get("/health")
        record("GET /health with DB connectivity", r.status_code == 200 and r.json().get("status") == "healthy" and r.json().get("database") == "connected", f"Status: {r.status_code}, Body: {r.json()}")

        # ---------------------------------------------------------
        # 2. Authentication & Email Normalization
        # ---------------------------------------------------------
        student_reg = {
            "full_name": "Test Student",
            "email": "Student.One@Example.COM",  # Mixed case
            "password": "Password123!",
            "phone": "+919876543210",
            "role": "student",
        }
        r = await ac.post("/api/auth/register", json=student_reg)
        record("Registration with mixed-case email normalizes to lowercase", r.status_code == 201 and r.json()["user"]["email"] == "student.one@example.com", f"Saved as: {r.json().get('user', {}).get('email')}")

        # Duplicate registration with different casing should return 409
        dup_reg = dict(student_reg)
        dup_reg["email"] = "STUDENT.one@example.com"
        r = await ac.post("/api/auth/register", json=dup_reg)
        record("Duplicate registration with different casing rejected (409)", r.status_code == 409, f"Status: {r.status_code}")

        # Login with uppercase email should succeed due to normalization
        login_upper = await ac.post("/api/auth/login", json={"email": "STUDENT.ONE@EXAMPLE.COM", "password": "Password123!"})
        record("Login with uppercase email succeeds via normalization", login_upper.status_code == 200 and "access_token" in login_upper.json(), f"Status: {login_upper.status_code}")
        student_token = login_upper.json()["access_token"]
        student_headers = {"Authorization": f"Bearer {student_token}"}

        # Alphabetic phone number rejected
        bad_phone_user = dict(student_reg)
        bad_phone_user["email"] = "badphone@example.com"
        bad_phone_user["phone"] = "abcdefghij"
        r = await ac.post("/api/auth/register", json=bad_phone_user)
        record("Alphabetic phone number rejected by schema validation (422)", r.status_code == 422, f"Status: {r.status_code}")

        # Owner Registration
        owner_reg = {
            "full_name": "Test Owner",
            "email": "Owner@Example.COM",
            "password": "Password123!",
            "phone": "+919876543211",
            "role": "owner",
        }
        r = await ac.post("/api/auth/register", json=owner_reg)
        record("Owner registration valid", r.status_code == 201, f"Status: {r.status_code}")
        login_o = await ac.post("/api/auth/login", json={"email": "owner@example.com", "password": "Password123!"})
        owner_token = login_o.json()["access_token"]
        owner_headers = {"Authorization": f"Bearer {owner_token}"}

        # ---------------------------------------------------------
        # 3. Security, Token Handling & Password Hash Protection
        # ---------------------------------------------------------
        # Malformed non-hex ObjectId in token sub must return 401 without 500 crash
        bad_sub_tok = jwt.encode(
            {"sub": "invalid-non-hex-id-1234", "exp": datetime.now(timezone.utc) + timedelta(minutes=10)},
            settings.JWT_SECRET_KEY,
            algorithm=settings.JWT_ALGORITHM,
        )
        r = await ac.get("/api/auth/profile", headers={"Authorization": f"Bearer {bad_sub_tok}"})
        record("Token with malformed non-hex ObjectId handled as 401 (no 500 crash)", r.status_code == 401, f"Status: {r.status_code}, Detail: {r.json().get('detail')}")

        # Expired token returns 401
        exp_tok = jwt.encode(
            {"sub": str(ObjectId()), "exp": datetime.now(timezone.utc) - timedelta(minutes=5)},
            settings.JWT_SECRET_KEY,
            algorithm=settings.JWT_ALGORITHM,
        )
        r = await ac.get("/api/auth/profile", headers={"Authorization": f"Bearer {exp_tok}"})
        record("Expired token returns 401", r.status_code == 401, f"Status: {r.status_code}")

        # Missing token returns 401
        r = await ac.get("/api/auth/profile")
        record("Missing token returns 401", r.status_code == 401, f"Status: {r.status_code}")

        # Password hash excluded from user dependency
        r = await ac.get("/api/auth/profile", headers=student_headers)
        record("User profile excludes password hash", r.status_code == 200 and "password" not in r.json(), f"Profile keys: {list(r.json().keys())}")

        # ---------------------------------------------------------
        # 4. Rooms & Safe Regex Search
        # ---------------------------------------------------------
        # Student cannot create room (RBAC)
        room_payload = {
            "title": "Sunny Campus Room",
            "description": "Quiet study environment",
            "location": "Sector 62, Noida",
            "monthly_rent": 6500.0,
            "max_occupants": 1,
            "expected_vacancy_date": (date.today() + timedelta(days=10)).isoformat(),
        }
        r = await ac.post("/api/rooms/", headers=student_headers, json=room_payload)
        record("Student cannot create room (RBAC 403)", r.status_code == 403, f"Status: {r.status_code}")

        # Past vacancy date rejected
        past_room = dict(room_payload)
        past_room["expected_vacancy_date"] = "2020-01-01"
        r = await ac.post("/api/rooms/", headers=owner_headers, json=past_room)
        record("Past vacancy date rejected by validator (422)", r.status_code == 422, f"Status: {r.status_code}")

        # Owner creates room
        r = await ac.post("/api/rooms/", headers=owner_headers, json=room_payload)
        room_id = r.json()["room"]["id"]
        record("Owner creates room with valid future vacancy date", r.status_code == 201, f"Room ID: {room_id}")

        # Regex injection safe search: special characters must not crash
        for evil_query in ["[", "*", ".*", "(", "\\", "?", "+"]:
            r = await ac.get(f"/api/rooms/search?location={evil_query}")
            record(f"Search location with regex character '{evil_query}' does not crash", r.status_code == 200, f"Status: {r.status_code}")

        # Room status update via JSON Body
        r = await ac.patch(f"/api/rooms/{room_id}/status", headers=owner_headers, json={"status": "occupied"})
        record("Room status update accepts JSON request body", r.status_code == 200 and r.json().get("status") == "occupied", f"Status: {r.status_code}")

        # Room status update via Query Param (legacy)
        r = await ac.patch(f"/api/rooms/{room_id}/status?room_status=available", headers=owner_headers)
        record("Room status update accepts legacy query parameter", r.status_code == 200 and r.json().get("status") == "available", f"Status: {r.status_code}")

        # Pagination on rooms list
        r = await ac.get("/api/rooms/?skip=0&limit=5")
        record("Public rooms listing supports skip/limit pagination", r.status_code == 200 and len(r.json()) <= 5, f"Items returned: {len(r.json())}")

        # Owner listings endpoint
        r = await ac.get("/api/rooms/owner", headers=owner_headers)
        record("Owner can fetch own listings via GET /api/rooms/owner", r.status_code == 200 and len(r.json()) >= 1 and r.json()[0]["id"] == room_id, f"Count: {len(r.json())}")

        r = await ac.get("/api/rooms/owner", headers=student_headers)
        record("Student forbidden from GET /api/rooms/owner (403)", r.status_code == 403, f"Status: {r.status_code}")

        # ---------------------------------------------------------
        # 5. Bookings: Bug Fix, Atomicity & Concurrency
        # ---------------------------------------------------------
        # Register Student 2
        s2_reg = {
            "full_name": "Student Two",
            "email": "student.two@example.com",
            "password": "Password123!",
            "phone": "+919876543212",
            "role": "student",
        }
        await ac.post("/api/auth/register", json=s2_reg)
        login_s2 = await ac.post("/api/auth/login", json={"email": "student.two@example.com", "password": "Password123!"})
        s2_headers = {"Authorization": f"Bearer {login_s2.json()['access_token']}"}

        # Student 1 creates booking
        r = await ac.post("/api/bookings/", headers=student_headers, json={"room_id": room_id})
        b1_id = r.json()["booking"]["id"]
        record("Student 1 creates booking request", r.status_code == 201, f"Booking ID: {b1_id}")

        # Student 2 creates booking for same room
        r = await ac.post("/api/bookings/", headers=s2_headers, json={"room_id": room_id})
        b2_id = r.json()["booking"]["id"]
        record("Student 2 creates competing booking request", r.status_code == 201, f"Booking ID: {b2_id}")

        # Student 1 cannot view owner contact BEFORE acceptance
        r = await ac.get(f"/api/bookings/{b1_id}/contact", headers=student_headers)
        record("Owner contact restricted before acceptance (403)", r.status_code == 403, f"Status: {r.status_code}")

        # Owner accepts Student 1 booking via JSON body (Verifies Bug #1 Fix!)
        accept_res = await ac.patch(f"/api/bookings/{b1_id}", headers=owner_headers, json={"status": "accepted"})
        record(
            "Booking acceptance succeeds cleanly without TypeError crash (BUG FIX VERIFIED)",
            accept_res.status_code == 200 and accept_res.json().get("status") == "accepted",
            f"Status: {accept_res.status_code}, Body: {accept_res.text}",
        )

        # Verify Room is now 'occupied'
        room_doc = await db.rooms.find_one({"_id": ObjectId(room_id)})
        record("Room atomically marked 'occupied' upon acceptance", room_doc.get("status") == "occupied", f"Status in DB: {room_doc.get('status')}")

        # Verify Booking 1 is 'accepted'
        b1_doc = await db.bookings.find_one({"_id": ObjectId(b1_id)})
        record("Target booking status updated to 'accepted'", b1_doc.get("status") == "accepted", f"Status in DB: {b1_doc.get('status')}")

        # Verify Competing Booking 2 was auto-rejected
        b2_doc = await db.bookings.find_one({"_id": ObjectId(b2_id)})
        record("Competing pending booking auto-rejected upon acceptance", b2_doc.get("status") == "rejected", f"Status in DB: {b2_doc.get('status')}")

        # Student 1 can now view Owner Contact
        contact_s1 = await ac.get(f"/api/bookings/{b1_id}/contact", headers=student_headers)
        record("Student can view owner contact after acceptance", contact_s1.status_code == 200 and contact_s1.json().get("email") == "owner@example.com", f"Contact: {contact_s1.json()}")

        # Owner can view Student 1 Contact
        student_contact = await ac.get(f"/api/bookings/{b1_id}/student-contact", headers=owner_headers)
        record("Owner can view student contact after acceptance", student_contact.status_code == 200 and student_contact.json().get("student_name") == "Test Student", f"Student: {student_contact.json()}")

        # Student 2 (rejected) cannot view Owner Contact
        contact_s2 = await ac.get(f"/api/bookings/{b2_id}/contact", headers=s2_headers)
        record("Rejected student cannot view owner contact (403)", contact_s2.status_code == 403, f"Status: {contact_s2.status_code}")

        # ---------------------------------------------------------
        # 6. Concurrency & Integrity Checks
        # ---------------------------------------------------------
        # Create fresh room for concurrency test
        r = await ac.post("/api/rooms/", headers=owner_headers, json={
            "title": "Race Test Room", "description": "Testing concurrency", "location": "Noida", "monthly_rent": 5000.0, "max_occupants": 1
        })
        race_room_id = r.json()["room"]["id"]

        # Simultaneous booking creation race condition test
        reqs = [ac.post("/api/bookings/", headers=student_headers, json={"room_id": race_room_id}) for _ in range(2)]
        conc_res = await asyncio.gather(*reqs)
        conc_statuses = [res.status_code for res in conc_res]
        record(
            "Simultaneous booking requests by same student prevented by partial unique index",
            201 in conc_statuses and 409 in conc_statuses,
            f"Statuses: {conc_statuses}",
        )

        # Safe room deletion: blocked if active accepted booking exists
        del_attempt = await ac.delete(f"/api/rooms/{room_id}", headers=owner_headers)
        record(
            "Deleting room with active accepted booking blocked with 400 Bad Request",
            del_attempt.status_code == 400,
            f"Status: {del_attempt.status_code}, Detail: {del_attempt.json().get('detail')}",
        )

        # ---------------------------------------------------------
        # 7. Dashboard & Cancellation
        # ---------------------------------------------------------
        dash = await ac.get("/api/rooms/owner/dashboard", headers=owner_headers)
        record(
            "Owner dashboard returns accurate stats",
            dash.status_code == 200 and dash.json().get("total_rooms") == 2,
            f"Dashboard stats: {dash.json()}",
        )

        # Student cancels pending booking
        # First create a pending booking on race_room_id
        cancel_b_res = await ac.post("/api/bookings/", headers=s2_headers, json={"room_id": race_room_id})
        cancel_b_id = cancel_b_res.json()["booking"]["id"]
        c_res = await ac.patch(f"/api/bookings/{cancel_b_id}/cancel", headers=s2_headers)
        record("Student cancels pending booking", c_res.status_code == 200 and c_res.json().get("status") == "cancelled", f"Status: {c_res.status_code}")

        # Cancelling already cancelled booking returns 400
        c_dup = await ac.patch(f"/api/bookings/{cancel_b_id}/cancel", headers=s2_headers)
        record("Cancelling non-pending booking returns 400", c_dup.status_code == 400, f"Status: {c_dup.status_code}")

        # ---------------------------------------------------------
        # 8. CORS & Rate Limiting Tests
        # ---------------------------------------------------------
        # CORS preflight request
        cors_headers = {
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        }
        cors_res = await ac.options("/api/auth/login", headers=cors_headers)
        record(
            "CORS preflight from localhost:5173 allowed",
            cors_res.status_code == 200 and cors_res.headers.get("access-control-allow-origin") == "http://localhost:5173",
            f"Status: {cors_res.status_code}, Allow-Origin: {cors_res.headers.get('access-control-allow-origin')}",
        )

        # Disallowed origin
        cors_disallowed = {
            "Origin": "http://malicious-site.com",
            "Access-Control-Request-Method": "POST",
        }
        cors_dis_res = await ac.options("/api/auth/login", headers=cors_disallowed)
        record(
            "CORS preflight from unauthorized origin rejected",
            cors_dis_res.headers.get("access-control-allow-origin") is None,
            f"Allow-Origin: {cors_dis_res.headers.get('access-control-allow-origin')}",
        )

        # Rate Limiting on Login (5 per minute)
        rate_limit_exceeded = False
        for _ in range(7):
            rl_res = await ac.post("/api/auth/login", json={"email": "nonexistent@example.com", "password": "WrongPassword1!"})
            if rl_res.status_code == 429:
                rate_limit_exceeded = True
                break

        record(
            "Rate limiting triggers HTTP 429 when threshold exceeded on /login",
            rate_limit_exceeded,
            f"429 Triggered: {rate_limit_exceeded}",
        )

    # Teardown
    await client.drop_database("roomora_test_audit")
    await client.close()

    print("\n" + "=" * 70)
    total = len(results)
    passed = sum(1 for r in results if r["status"] == "PASSED")
    failed = sum(1 for r in results if r["status"] == "FAILED")
    print(f"TEST SUMMARY: Total: {total} | Passed: {passed} | Failed: {failed}")
    print("=" * 70)
    return failed == 0

if __name__ == "__main__":
    success = asyncio.run(run_all_tests())
    sys.exit(0 if success else 1)
