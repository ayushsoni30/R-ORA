🏠 ROOMORA

Find Your Room, Feel at Home.

ROOMORA is a room rental platform designed to help students, families, and short-stay visitors find suitable rooms easily. It connects room seekers with room owners through a single platform, making room discovery simpler and more convenient.

✨ Features

### Implemented (Core Backend)
- 🔐 **Authentication & Security**: Secure registration, login, profile view/update with Argon2id password hashing, JWT bearer tokens, and SlowAPI rate limiting.
- 👥 **Role-Based Access Control**: Strict role separation between Room Seekers (`student`) and Room Owners (`owner`).
- 🏡 **Room Management**: Room owners can create, update, delete, and view their listings with title, description, location, monthly rent, max occupants, and vacancy dates.
- 📍 **Safe Location-Based Search**: Sanitize regex search by location with pagination support.
- 📅 **Availability Management**: Owners can toggle rooms between available and occupied via JSON body or query param.
- 📝 **Booking Workflow**:
  - Students submit booking requests for available rooms.
  - Owners accept or reject requests.
  - Accepting a booking atomically marks the room as occupied and auto-rejects competing pending requests.
  - Students can cancel pending booking requests.
- 📞 **Direct Contact Disclosure**: Contact details (full name, email, phone) are disclosed strictly after a booking request is accepted (mutual student-owner access).
- 📊 **Owner Dashboard**: Real-time stats on total rooms, available rooms, occupied rooms, and pending booking requests.
- 🛡️ **Data Integrity & Concurrency**: Atomic room claims, MongoDB partial unique indexes preventing race condition duplicates, and safe room deletion preventing orphaned bookings.
- 🌐 **CORS Support**: Integrated `CORSMiddleware` supporting React + Vite local development and configurable deployed origins.

### Planned / Future Roadmap
- 🔑 **Google OAuth**: Alternative sign-in provider (Planned).
- 💬 **Real-Time Chat**: Live messaging between students and owners via Socket.IO (Planned).
- 🖼️ **Image Storage**: Cloud storage for room photos and document verification (Planned).
- ⭐ **Reviews and Ratings**: Post-stay feedback for room listings (Planned).
- 🛡️ **Admin Role & Moderation**: Dedicated admin dashboard for report handling and listing approvals (Planned).
- 🔔 **In-App Notifications**: Real-time push/email alerts for booking status updates (Planned).

🛠️ Tech Stack

Frontend
- React.js + Vite
- HTML5, CSS3, JavaScript

Backend
- Python 3.14+
- FastAPI (REST APIs)
- Uvicorn (ASGI Server)
- PyMongo (AsyncMongoClient)
- Pydantic v2 & Pydantic-Settings
- PyJWT & Pwdlib (Argon2id)
- SlowAPI (Rate Limiting)

Database
- MongoDB 7.0+ / 8.0+ / Atlas

Image Storage & Real-Time (Planned)
- Cloud-based image storage
- Python Socket.IO

📂 Project Structure

ROOMORA/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── App.jsx
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── routes/
│   │   ├── services/
│   │   └── sockets/
│   ├── requirements.txt
│   └── .env
│
├── .gitignore
└── README.md

This is the planned structure. Files and folders will be added as development progresses.

⚙️ Getting Started

Prerequisites

Install the following tools:

- Python 3.11 or a compatible newer version
- Node.js and npm
- MongoDB or a MongoDB Atlas account
- Git

1. Clone the Repository

git clone <your-repository-url>
cd ROOMORA

2. Set Up the Backend

cd backend
python -m venv .venv

Activate the virtual environment.

Windows:

.venv\Scripts\activate

macOS/Linux:

source .venv/bin/activate

Install the initial backend dependencies:

pip install fastapi "uvicorn[standard]" pymongo python-dotenv "python-socketio"

Save the installed dependencies:

pip freeze > requirements.txt

3. Configure Environment Variables

Create a ".env" file inside the "backend/" directory.

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_secret
GOOGLE_CLIENT_ID=your_google_client_id

Additional environment variables may be added as more features are implemented.

Security: Never upload ".env" files, passwords, or secret keys to GitHub.

4. Run the Backend

After creating "app/main.py", run:

uvicorn app.main:app --reload

The backend will be available at:

- API: http://127.0.0.1:8000
- Interactive API documentation: http://127.0.0.1:8000/docs

5. Run the Frontend

Open another terminal:

cd frontend
npm install
npm run dev

These commands assume the frontend has been initialized and the required scripts are configured.

🔌 API Development

The FastAPI backend will provide endpoints for:

- User registration and login
- Room creation, updating, and deletion
- Searching and filtering room listings
- Managing room availability
- Booking requests and approvals
- Reviews and ratings
- Notifications and user reports

💬 Real-Time Chat

ROOMORA plans to use Python Socket.IO for real-time messaging between room seekers and room owners. MongoDB can store conversation history.

🎯 Project Objective

The objective of ROOMORA is to simplify the room-finding process by connecting students, families, short-stay visitors, and room owners through one convenient platform.

🚀 Future Enhancements

- Smart room recommendations
- Improved listing verification
- Enhanced search and filtering
- Real-time notifications
- Responsive mobile-friendly interface

👨‍💻 Author

Ayush Soni

Final-Year Student Project

📄 License

A suitable open-source license can be added when the project is published.

---

Note: Features listed above represent the planned functionality. Mark features as completed only after implementation and testing.