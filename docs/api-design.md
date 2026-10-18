# QuickNotes API Design Specification

This document outlines the RESTful API endpoints, request/response payload examples, and error handling specifications for the production QuickNotes service.

## REST Endpoints Overview

| Method | Path | Description | Success Status Code |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/v1/notes` | Retrieve a paginated list of notes for the authenticated user | `200 OK` |
| **POST** | `/api/v1/notes` | Create a new note record | `201 Created` |
| **GET** | `/api/v1/notes/{id}` | Retrieve a single note by its unique identifier | `200 OK` |
| **PUT** | `/api/v1/notes/{id}` | Update/replace an existing note completely | `200 OK` |
| **DELETE** | `/api/v1/notes/{id}` | Delete a specific note by ID | `204 No Content` |
| **GET** | `/api/v1/tags` | Retrieve all tags created by the user | `200 OK` |

---

## JSON Payloads

### 1. Creating a Note (`POST /api/v1/notes`)
**Request Body:**
```json
{
  "title": "Weekly Grocery List",
  "body": "Milk, eggs, bread, coffee beans, and fresh spinach.",
  "tag_ids": [2, 5]
}

{
  "id": "note_9f83a7c1-4b2e",
  "user_id": "usr_12345abcde",
  "title": "Weekly Grocery List",
  "body": "Milk, eggs, bread, coffee beans, and fresh spinach.",
  "created_at": "2026-03-07T14:30:00Z",
  "updated_at": "2026-03-07T14:30:00Z"
}

{
  "data": [
    {
      "id": "note_9f83a7c1-4b2e",
      "title": "Weekly Grocery List",
      "body": "Milk, eggs, bread...",
      "created_at": "2026-03-07T14:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total_count": 42
  }
}

{
  "error": {
    "status": 400,
    "code": "VALIDATION_ERROR",
    "message": "The 'title' field is required and cannot exceed 100 characters."
  }
}

