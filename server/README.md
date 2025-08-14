# Server API

Base URL: http://localhost:4000

## Users
- POST /users { username, password }
- POST /auth/login { username, password } -> { token, user }
- GET  /users -> [users]

## Tasks (Authorization: Bearer <token> for write ops)
- POST /tasks { title, description, priority, status, assigneeId, deps }
- GET  /tasks?assigneeId=...&blocked=true|false
- GET  /tasks/:id
- PUT  /tasks/:id
- DELETE /tasks/:id
- POST /tasks/:id/complete
