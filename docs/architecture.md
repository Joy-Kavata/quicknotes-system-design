### 6. `docs/architecture.md`
```markdown
# QuickNotes Architecture & Scaling Document

## 1. Requirements

### Functional Requirements
- Users can securely register, log in, and manage auth sessions.
- Users can create, read, update, and delete text notes.
- Users can organize notes with custom tags.

### Non-Functional Requirements
- **Availability:** 99.99% uptime.
- **Latency:** API response times under 100ms for read operations.
- **Security:** Encrypted data in transit (TLS) and at rest.

---

## 2. Load Estimates (1 Million Users)
- **Daily Active Users (DAU):** Assume 10% activity rate = 100,000 DAU.
- **Reads per Second (RPS):** Each active user reads notes 20 times/day.
  - $100,000 \times 20 = 2,000,000$ reads/day $\div 86,400\text{ seconds} \approx \mathbf{23.1\text{ reads/sec}}$ (Peak at $5\times = \mathbf{115.5\text{ RPS}}$).
- **Writes per Second (WPS):** Each active user creates/updates 5 notes/day.
  - $100,000 \times 5 = 500,000$ writes/day $\div 86,400\text{ seconds} \approx \mathbf{5.78\text{ writes/sec}}$ (Peak at $5\times = \mathbf{28.9\text{ WPS}}$).
- **Storage per Year:** Average note size = 2 KB.
  - $500,000\text{ writes/day} \times 365 = 182,500,000\text{ notes/year} \times 2\text{ KB} = 365,000,000\text{ KB} \approx \mathbf{365\text{ GB/year}}$.

---

## 3. Architecture Diagram

```text
       [ Clients / Web / Mobile ]
                   │
                   ▼
               [ DNS ]
                   │
                   ▼
         [ CDN (Cloudflare) ]
                   │
                   ▼
         [ Load Balancer (LB) ]
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
   [ App Server 1 ]    [ App Server 2 ]
         │                   │
         ├──► [ Cache (Redis) ] (User sessions & recent notes)
         │
         ├──► [ Primary Database ] (Writes: PostgreSQL)
         │         │
         │         └──► [ Read Replica ] (Reads: queries & feeds)
         │
         └──► [ Message Queue (RabbitMQ) ] ──► [ Async Worker ] (Background tasks / Ana