🏠 ROOMORA

Find Your Room, Feel at Home.

ROOMORA is a room rental platform designed to help students, families, and short-stay visitors find suitable rooms easily. It connects room seekers with room owners through a single platform, making room discovery simpler and more convenient.

✨ Features

- 🔐 Authentication: Secure registration and login using JWT and Google OAuth.
- 👥 Role-Based Access: Separate roles for room seekers, room owners, and administrators.
- 🏡 Room Listings: Owners can upload room photos, rent details, facilities, rules, and descriptions.
- 📍 Location-Based Search: Find rooms by city, area, address, or nearby landmarks.
- 🔎 Smart Search: Filter rooms by budget, facilities, and preferred stay duration.
- 📅 Availability Management: Owners can mark rooms as available or occupied.
- 💬 Real-Time Chat: Communication between room seekers and owners using Python Socket.IO.
- 📞 Direct Contact: Contact room owners directly.
- 📝 Booking Requests: Request a room and wait for owner approval.
- ⭐ Reviews and Ratings: Share feedback about room listings and experiences.
- 🛡️ Admin Dashboard: Manage users, verify listings, and handle reports.
- 🔔 Notifications: Updates for booking requests and important activities.
- 💳 Direct Payments: No online payment gateway; payments are arranged directly with the owner.

🛠️ Tech Stack

Frontend

- React.js
- HTML5
- CSS3
- JavaScript

Backend

- Python
- FastAPI
- Uvicorn
- REST APIs

Database

- MongoDB
- PyMongo

Authentication

- JSON Web Tokens (JWT)
- Google OAuth

Real-Time Communication

- Python Socket.IO

Image Storage

- Cloud-based image storage (planned)

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

Your Name

Final-Year Student Project

📄 License

A suitable open-source license can be added when the project is published.

---

Note: Features listed above represent the planned functionality. Mark features as completed only after implementation and testing.