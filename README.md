  ---

**Backend:**
- Java 17
- Spring Boot 3.x
- Spring Security (JWT – tokeny Bearer, HS256)
- Spring Data JPA + Hibernate
- MySQL 8
- Maven
- Lombok
- Bean Validation (jakarta.validation)

**Frontend:**
- React 18 + TypeScript
- React Router v6
- Axios (HTTP client z interceptorami)
- React Hook Form + Yup (walidacja formularzy)
- CSS Modules (responsywność, dostępność WCAG AA)

**Infrastruktura:**
- Docker + Docker Compose
- Nginx (serwowanie SPA)

---

## Wymagania wstępne

- [Docker](https://docs.docker.com/get-docker/) (wersja 20+)
- [Docker Compose](https://docs.docker.com/compose/install/) (wersja 2+)

---

## Instrukcja uruchomienia

### 1. Klonowanie repozytorium

```bash
git clone https://github.com/qwnsvunoffocial/user-account-management-2.git
cd user-account-management-2
```

### 2. Uruchomienie aplikacji

```bash
docker-compose up --build
```

Pierwsze uruchomienie pobiera obrazy i buduje kontenery – może potrwać kilka minut.

### 3. Dostęp do aplikacji

| Usługa   | Adres                   |
|----------|-------------------------|
| Frontend | http://localhost:3000   |
| Backend  | http://localhost:8080   |
| MySQL    | localhost:3306          |

### 4. Domyślne konto administratora

| Login   | Hasło       | Rola  |
|---------|-------------|-------|
| `admin` | `Admin1234!` | ADMIN |

---
