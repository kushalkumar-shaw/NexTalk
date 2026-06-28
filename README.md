# NexTalk

NexTalk is a modern, real-time team communication platform built with the MERN stack (MongoDB, Express, React, Node.js) featuring WebSockets for instant messaging.

## Features
- **Real-Time Messaging**: Built with Socket.io for instantaneous communication.
- **Public & Private Rooms**: Create open channels or invite-only secure spaces.
- **Modern UI/UX**: Features glassmorphism, smooth micro-animations, and a responsive design using Tailwind CSS v4.
- **Light & Dark Mode**: Premium color palettes tailored for day and night viewing.
- **Secure Authentication**: JWT-based session management using HTTP-only cookies.

## Tech Stack
- **Frontend**: Next.js 14+ (App Router), React 18, Tailwind CSS v4, Zustand
- **Backend**: Node.js, Express, Socket.io, Mongoose
- **Database**: MongoDB

## Getting Started

### Prerequisites
- Node.js >= 18.x
- MongoDB (running locally or via MongoDB Atlas)

### Installation

1. Clone the repository and install dependencies for both frontend and backend:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. Configure environment variables.
   - For backend (`backend/.env`):
     ```
     PORT=5000
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     CLIENT_URL=http://localhost:3000
     ```
   - For frontend (`frontend/.env.local`):
     ```
     NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
     NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
     ```

3. Run the development servers:
   - Backend: `cd backend && npm run dev`
   - Frontend: `cd frontend && npm run dev`

4. Open your browser to `http://localhost:3000`.

## License
MIT
