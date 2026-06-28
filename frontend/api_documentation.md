# NexTalk API Documentation

Base URL: `http://localhost:5000/api/v1`

## Standard Responses
**Success Response**
```json
{
  "success": true,
  "message": "Human readable message",
  "data": { }
}
```

**Error Response**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    { "field": "fieldName", "message": "error message" }
  ]
}
```

---

## REST API Endpoints

### 1. Authentication
> All routes prefixed with `/auth`

#### `POST /register`
Creates a new user account.
- **Body:**
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepass123"
  }
  ```
- **Returns (201):** User object and JWT token (also sets `nexttalk_token` httpOnly cookie).

#### `POST /login`
Authenticates an existing user.
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securepass123"
  }
  ```
- **Returns (200):** User object and JWT token.

#### `POST /logout` (Protected)
Logs the user out.
- **Returns (200):** Clears the token cookie and sets user `isOnline` to `false`.

#### `GET /me` (Protected)
Gets the currently authenticated user's profile.
- **Returns (200):** Current user object.

---

### 2. Users
> All routes prefixed with `/users` and require Authentication

#### `GET /`
Retrieves a list of all users, excluding the current user.
- **Query Params:** `?search=john` (Optional search by username or email)
- **Returns (200):** Array of users.

#### `GET /:id`
Retrieves a specific user by ID.
- **Returns (200):** User object.

---

### 3. Rooms
> All routes prefixed with `/rooms` and require Authentication

#### `POST /`
Creates a new room.
- **Body:**
  ```json
  {
    "name": "General Chat",
    "description": "Public channel",
    "type": "public" 
  }
  ```
- **Returns (201):** The created room.

#### `GET /`
Retrieves all public rooms and private rooms where the current user is a member.
- **Returns (200):** Array of rooms.

#### `GET /:id`
Retrieves a specific room by ID.
- **Returns (200):** Room object. (Returns 403 if it's a private room and user is not a member).

#### `POST /:id/join`
Adds current user to the room's members.
- **Returns (200):** Updated room object.

#### `POST /:id/leave`
Removes current user from the room's members.
- **Returns (200):** Success message.

#### `DELETE /:id`
Deletes a room (Only the creator can delete it).
- **Returns (200):** Success message.

---

### 4. Messages
> All routes prefixed with `/messages` and require Authentication

#### `GET /room/:roomId`
Retrieves paginated messages for a given room.
- **Query Params:** `?page=1&limit=50`
- **Returns (200):** 
  ```json
  {
    "success": true,
    "data": {
      "messages": [...],
      "pagination": {
        "currentPage": 1,
        "totalPages": 4,
        "totalMessages": 187,
        "hasMore": true
      }
    }
  }
  ```

---

## Socket.io Real-Time Events

Connections require authentication either via the `nexttalk_token` cookie or passing the token during handshake:
```javascript
const socket = io("http://localhost:5000", {
  auth: { token: "your_jwt_token" }
});
```

### Connection Events
| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `connection` | Server Listens | - | User connects. Server joins them to `user:<id>` and broadcasts `user:online` |
| `disconnect` | Server Listens | - | User disconnects. Server updates last seen and broadcasts `user:offline` |
| `user:online` | Server Emits | `{ userId, username }` | Emitted to all users when someone comes online |
| `user:offline` | Server Emits | `{ userId, lastSeen }` | Emitted to all users when someone goes offline |

### Room Events
| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `room:join` | Server Listens | `{ roomId }` | Request to join a socket room |
| `room:leave` | Server Listens | `{ roomId }` | Request to leave a socket room |
| `room:joined` | Server Emits | `{ roomId, room }` | Sent to requester confirming join |
| `room:left` | Server Emits | `{ roomId }` | Sent to requester confirming leave |
| `room:user_joined`| Server Emits | `{ roomId, user }` | Broadcast to room members when someone joins |
| `room:user_left` | Server Emits | `{ roomId, userId }` | Broadcast to room members when someone leaves |

### Message Events
| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `message:send` | Server Listens | `{ roomId, content }` | Request to send a new message |
| `message:read` | Server Listens | `{ messageId }` | Mark message as read |
| `message:new` | Server Emits | `Message Object` | Broadcast to room members with the new message |
| `message:read_receipt` | Server Emits | `{ messageId, readBy: userId }` | Broadcast to room when message is read |
| `message:error` | Server Emits | `{ message }` | Sent to requester on error |

### Typing Indicator Events
| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `typing:start` | Server Listens | `{ roomId }` | Start typing |
| `typing:stop` | Server Listens | `{ roomId }` | Stop typing |
| `typing:update`| Server Emits | `{ roomId, user, isTyping }` | Broadcast to room members about typing state |

---
