```markdown
# QuickNotes Data Model Specification

## Entities & Columns

### 1. `users`
- `id`: `UUID` (Primary Key)
- `email`: `VARCHAR(255)` (Unique, Not Null)
- `password_hash`: `VARCHAR(255)` (Not Null)
- `created_at`: `TIMESTAMP` (Not Null)

### 2. `notes`
- `id`: `UUID` (Primary Key)
- `user_id`: `UUID` (Foreign Key referencing `users(id)`, Not Null)
- `title`: `VARCHAR(100)` (Not Null)
- `body`: `TEXT` (Nullable)
- `created_at`: `TIMESTAMP` (Not Null)
- `updated_at`: `TIMESTAMP` (Not Null)

### 3. `tags`
- `id`: `UUID` (Primary Key)
- `user_id`: `UUID` (Foreign Key referencing `users(id)`, Not Null)
- `name`: `VARCHAR(50)` (Not Null)

### 4. `note_tags` (Join Table)
- `note_id`: `UUID` (Foreign Key referencing `notes(id)`, Part of Composite PK)
- `tag_id`: `UUID` (Foreign Key referencing `tags(id)`, Part of Composite PK)

---

## Relationship Explanations
- **One-to-Many (`users` to `notes`)**: A single user can create and own multiple notes, but each note belongs to exactly one user.
- **Many-to-Many (`notes` and `tags`)**: A single note can possess multiple tags (e.g., #work, #urgent), and a single tag can be assigned to multiple notes. A join table (`note_tags`) is required in relational databases to break down this many-to-many relationship into two clean one-to-many relationships.

---

## CREATE TABLE Statements

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    title VARCHAR(100) NOT NULL,
    body TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE tags (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    name VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE note_tags (
    note_id UUID,
    tag_id UUID,
    PRIMARY KEY (note_id, tag_id),
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);