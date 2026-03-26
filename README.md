# System zarządzania kontami użytkowników

Pełna aplikacja do zarządzania kontami użytkowników składająca się z back-endu (Java + Spring Boot), front-endu (React) oraz bazy danych MySQL, uruchamialna lokalnie za pomocą Docker Compose.

---

## Użyte technologie

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

## Endpointy API

### Autoryzacja (publiczne)

| Metoda | Endpoint              | Opis                                      |
|--------|-----------------------|-------------------------------------------|
| POST   | `/api/auth/register`  | Rejestracja nowego użytkownika            |
| POST   | `/api/auth/login`     | Logowanie, zwraca JWT token               |

### Użytkownicy (wymagają JWT w nagłówku `Authorization: Bearer <token>`)

| Metoda | Endpoint          | Opis                                                   | Dostęp         |
|--------|-------------------|--------------------------------------------------------|----------------|
| GET    | `/api/users`      | Lista wszystkich użytkowników                          | ADMIN          |
| GET    | `/api/users/{id}` | Pobierz użytkownika po ID                              | ADMIN / własne |
| PUT    | `/api/users/{id}` | Edytuj użytkownika                                     | ADMIN / własne |
| DELETE | `/api/users/{id}` | Usuń użytkownika                                       | ADMIN          |

---

## Struktura projektu

```
user-account-management-2/
├── backend/
│   ├── src/main/java/com/example/usermanagement/
│   │   ├── controller/      # Kontrolery REST
│   │   ├── service/         # Logika biznesowa
│   │   ├── repository/      # Dostęp do bazy danych (JPA)
│   │   ├── model/           # Encja User
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── security/        # JWT, UserDetails, filtr
│   │   ├── exception/       # Obsługa błędów
│   │   └── config/          # Spring Security, inicjalizacja danych
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, PrivateRoute
│   │   ├── pages/           # LoginPage, RegisterPage, UsersPage, EditUserPage, ProfilePage
│   │   ├── hooks/           # useAuth (AuthContext)
│   │   ├── services/        # authService, userService, axios instance
│   │   └── types/           # Definicje TypeScript
│   ├── nginx/
│   │   └── default.conf     # Konfiguracja Nginx dla SPA
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## Bezpieczeństwo

- **Hasła** przechowywane jako hash BCrypt (nigdy plain text)
- **JWT** (HS256, ważność 24h) przekazywany w nagłówku `Authorization: Bearer`
- **CSRF** wyłączony (REST API stateless)
- **CORS** – zezwolono tylko na `http://localhost:3000`
- **Nagłówki bezpieczeństwa**: `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`
- **RBAC** (Role-Based Access Control): ADMIN ma pełny dostęp, USER tylko do własnych danych
- **JWT w localStorage** – dla uproszczenia; w środowisku produkcyjnym zalecane są `httpOnly` cookies
- **React** domyślnie escapeuje wyjście (ochrona przed XSS)

---

## Zatrzymanie aplikacji

```bash
docker-compose down
```

Aby usunąć również dane bazy danych:

```bash
docker-compose down -v
```
