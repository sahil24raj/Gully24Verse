# Attack Classes Evaluated

| Attack Class | Evaluation Scope | Confirmed Findings |
|---|---|:---:|
| **Access Control (Broken Object-Level Auth)** | User profile modification, room manipulation | 2 (GV-001, GV-002) |
| **Cryptographic Failures** | Hardcoded secrets, token comparison timing | 2 (GV-003, GV-004) |
| **Missing Security Headers** | Clickjacking, MIME sniffing, HSTS | 1 (GV-005) |
| **Input Validation & Integrity** | Unauthenticated score submissions | 1 (GV-006) |
| **Resource Exhaustion & Availability** | In-memory rate limiting map memory leaks | 1 (GV-007) |
| **SQL / NoSQL Injection** | Parameterized Firestore queries | 0 (Rejected - Safe SDK) |
| **Cross-Site Scripting (XSS)** | React JSX auto-escaping & sanitize calls | 0 (Rejected - Safe) |
| **Cross-Site Request Forgery (CSRF)** | Next.js POST handlers & JSON content types | 0 (Rejected - Safe) |
