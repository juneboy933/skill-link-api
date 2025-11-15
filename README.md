📘 Skill-Link API

Skill-Link is a mentorship platform API where:

Learners can browse mentors, request mentorship sessions, and leave reviews.

Mentors can create skill listings, accept or reject mentorship requests, and track students.

Admins manage users, moderate reviews, and oversee platform activity.

This API is built using Node.js, Express, MongoDB, and JWT authentication.

🚀 Features
👤 Authentication & User Roles

JWT-based authentication

Role-based access control (learner, mentor, admin)

🎓 Learner Features

Browse skills

Request mentorship

Leave reviews for mentors

🧑‍🏫 Mentor Features

Create/update/delete skill listings

Accept/Reject mentorship requests

Track learners

🛡️ Admin Features

Manage all users

Moderate reviews

Handle mentorship reports

⭐ Reviews

Learners can leave reviews for a mentor’s skill

Supports pagination

📚 Mentorship Management

Request mentorship

Update request status

Delete mentorship requests

🏗️ Tech Stack
Layer	Technology
Backend	Node.js + Express
Database	MongoDB + Mongoose
Auth	JWT
Deployment	(To be added)
📦 Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/juneboy933/skill-link-api.git
cd skill-link-api

2️⃣ Install dependencies
npm install

3️⃣ Create a .env file
PORT=5000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_jwt_secret

4️⃣ Start server
npm start


Server will run on:

http://localhost:5000

🗂️ Folder Structure
/config
  db.js
/controllers
  auth.js
  user.js
  skill.js
  review.js
  mentorship.js
/middleware
  authenticateUser.js
  authorizeRoles.js
/models
  user.js
  skill.js
  review.js
  mentorship.js
/routes
  auth.js
  user.js
  skill.js
  review.js
  mentorship.js
server.js

📡 API Routes Overview
🔐 Auth
POST   /api/auth/register
POST   /api/auth/login

👤 Users
GET    /api/users/          (admin)
GET    /api/users/:id       (user)
DELETE /api/users/:id       (admin)

🎓 Skills (mentor)
GET    /api/skill/
POST   /api/skill/          (mentor)
PATCH  /api/skill/:id       (mentor)
DELETE /api/skill/:id       (mentor/admin)

⭐ Reviews (learner)
GET    /api/review/
POST   /api/review/         (learner)
PATCH  /api/review/:id      (learner/admin)
DELETE /api/review/:id      (admin)

📚 Mentorship
GET    /api/mentorship/
POST   /api/mentorship/     (learner)
PATCH  /api/mentorship/:id  (mentor/admin)
DELETE /api/mentorship/:id  (mentor/admin)

✔️ Status Codes

200 – OK

201 – Created

400 – Bad Request

401 – Unauthorized

403 – Forbidden

404 – Not Found

500 – Internal Server Error

🧪 Future Improvements

Email & SMS alerts

OTP login

Mentor availability scheduling

Admin analytics dashboard

Chat system between learners & mentors

🤝 Contributing

Pull requests are welcome.

💬 Contact

Author: Brian Oduor
GitHub: @juneboy933