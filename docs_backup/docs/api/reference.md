# API Reference

TixGenius provides a RESTful API for managing tickets, users, teams, and other resources. This document details the available endpoints, request/response formats, and authentication requirements.

## Authentication

All API endpoints require authentication using JWT tokens:

```
Authorization: Bearer <token>
```

### Authentication Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER"
  }
}
```

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}

Response:
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER"
}
```

## Users

### Get Current User
```http
GET /api/users/me

Response:
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER",
  "team": {
    "id": "uuid",
    "name": "Support Team"
  }
}
```

### Update User
```http
PATCH /api/users/me
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}

Response:
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

## Teams

### List Teams
```http
GET /api/teams

Response:
{
  "teams": [
    {
      "id": "uuid",
      "name": "Support Team",
      "description": "Customer support team"
    }
  ]
}
```

### Create Team
```http
POST /api/teams
Content-Type: application/json

{
  "name": "Development Team",
  "description": "Software development team"
}

Response:
{
  "id": "uuid",
  "name": "Development Team",
  "description": "Software development team"
}
```

## Tickets

### Create Ticket
```http
POST /api/tickets
Content-Type: application/json

{
  "title": "Cannot login to system",
  "description": "Getting error when trying to login",
  "categoryId": "uuid",
  "priority": "HIGH"
}

Response:
{
  "id": "uuid",
  "title": "Cannot login to system",
  "description": "Getting error when trying to login",
  "status": "OPEN",
  "priority": "HIGH",
  "category": {
    "id": "uuid",
    "name": "Authentication"
  }
}
```

### List Tickets
```http
GET /api/tickets?status=OPEN&priority=HIGH

Response:
{
  "tickets": [
    {
      "id": "uuid",
      "title": "Cannot login to system",
      "status": "OPEN",
      "priority": "HIGH",
      "createdAt": "2023-04-15T12:00:00Z"
    }
  ],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 20
  }
}
```

### Get Ticket
```http
GET /api/tickets/:id

Response:
{
  "id": "uuid",
  "title": "Cannot login to system",
  "description": "Getting error when trying to login",
  "status": "OPEN",
  "priority": "HIGH",
  "category": {
    "id": "uuid",
    "name": "Authentication"
  },
  "assignments": [
    {
      "id": "uuid",
      "assignee": {
        "id": "uuid",
        "firstName": "John",
        "lastName": "Doe"
      },
      "status": "ASSIGNED"
    }
  ]
}
```

### Update Ticket
```http
PATCH /api/tickets/:id
Content-Type: application/json

{
  "status": "IN_PROGRESS",
  "priority": "MEDIUM"
}

Response:
{
  "id": "uuid",
  "title": "Cannot login to system",
  "status": "IN_PROGRESS",
  "priority": "MEDIUM"
}
```

## Assignments

### Assign Ticket
```http
POST /api/tickets/:id/assign
Content-Type: application/json

{
  "assigneeId": "uuid",
  "notes": "Please investigate login issue"
}

Response:
{
  "id": "uuid",
  "ticketId": "uuid",
  "assigneeId": "uuid",
  "status": "ASSIGNED",
  "notes": "Please investigate login issue"
}
```

### Update Assignment
```http
PATCH /api/assignments/:id
Content-Type: application/json

{
  "status": "ACCEPTED",
  "notes": "Working on the issue"
}

Response:
{
  "id": "uuid",
  "status": "ACCEPTED",
  "notes": "Working on the issue"
}
```

## Categories

### List Categories
```http
GET /api/categories

Response:
{
  "categories": [
    {
      "id": "uuid",
      "name": "Authentication",
      "description": "Login and access issues"
    }
  ]
}
```

### Create Category
```http
POST /api/categories
Content-Type: application/json

{
  "name": "Performance",
  "description": "System performance issues",
  "teamId": "uuid"
}

Response:
{
  "id": "uuid",
  "name": "Performance",
  "description": "System performance issues",
  "team": {
    "id": "uuid",
    "name": "Development Team"
  }
}
```

## Complaints

### Create Complaint
```http
POST /api/complaints
Content-Type: application/json

{
  "title": "Slow response time",
  "description": "Ticket has been open for 3 days",
  "ticketId": "uuid"
}

Response:
{
  "id": "uuid",
  "title": "Slow response time",
  "description": "Ticket has been open for 3 days",
  "status": "SUBMITTED",
  "ticket": {
    "id": "uuid",
    "title": "Cannot login to system"
  }
}
```

### List Complaints
```http
GET /api/complaints?status=SUBMITTED

Response:
{
  "complaints": [
    {
      "id": "uuid",
      "title": "Slow response time",
      "status": "SUBMITTED",
      "createdAt": "2023-04-15T12:00:00Z"
    }
  ]
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid input data",
  "details": {
    "field": "error message"
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Rate Limiting

API requests are rate-limited:
- 100 requests per 5 minutes for authenticated users
- 20 requests per 5 minutes for unauthenticated users

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1618483200
```

## Pagination

List endpoints support pagination:
```
GET /api/tickets?page=1&limit=20
```

Response includes pagination metadata:
```json
{
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "pages": 5
  }
}
```

## Filtering

List endpoints support filtering:
```
GET /api/tickets?status=OPEN&priority=HIGH&category=uuid
```

## Sorting

List endpoints support sorting:
```
GET /api/tickets?sort=createdAt:desc
```

## Field Selection

Response fields can be selected:
```
GET /api/tickets?fields=id,title,status,priority
``` 