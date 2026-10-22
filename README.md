# Forum API

REST API форуму на Express + TypeScript + **Prisma ORM 8** (contract-based, PostgreSQL).

Гілка `feat/user-auth` додає користувачів, реєстрацію/вхід з JWT у HttpOnly Cookie та зв'язок `User` ↔ `Post` (1:N).

## Стек

- Node.js, TypeScript, Express 5
- Prisma ORM 8 (`@prisma/orm-postgres`, `contract.prisma`)
- PostgreSQL ≥ 15
- Паролі: Argon2id (`@node-rs/argon2`, з pepper у `PASSWORD_PEPPER`)
- Токени: JWT HS256 (`jsonwebtoken`), 15 хв, у HttpOnly Cookie `accessToken`

## Запуск

```bash
npm install
cp .env.example .env          # DATABASE_URL, JWT_ACCESS_SECRET, PASSWORD_PEPPER
npm run contract:emit         # згенерувати contract.json / contract.d.ts
npm run db:update             # оновити схему БД під контракт
npm run dev                   # сервер на http://localhost:8000
```

Інші команди: `npm run db:schema` (перегляд схеми БД), `npm run db:verify`, `npm run typecheck`.

> У Prisma ORM 8 команду `prisma studio` прибрано з CLI — таблиці зручно переглядати через `npm run db:schema` або Prisma Console.

## Модель даних

```prisma
model User {
  id           Int      @id @default(autoincrement())
  email        String   @unique
  hashPassword String
  posts        Post[]
}

model Category {
  id        Int      @id @default(autoincrement())
  name      String   @unique
  posts     Post[]
  createdAt TimestamptzString @default(now())
  updatedAt temporal.updatedAtString()
}

model Post {
  id         Int      @id @default(autoincrement())
  title      String
  content    String?
  categoryId Int
  authorId   Int
  category   Category @relation(fields: [categoryId], references: [id])
  author     User     @relation(fields: [authorId], references: [id])
  createdAt  TimestamptzString @default(now())
  updatedAt  temporal.updatedAtString()
}
```

`Post` має два зв'язки N:1 — до `Category` і до `User` (автор).

## Ендпоінти

| Метод | Шлях | Опис |
| --- | --- | --- |
| POST | `/auth/register` | Реєстрація `{ "email", "password" }` → 201 `{ id, email }` |
| POST | `/auth/login` | Вхід `{ "email", "password" }` → 200 + Cookie `accessToken` (HttpOnly) |
| GET | `/categories` | Список категорій |
| GET | `/categories/:id` | Категорія за id |
| POST | `/categories` | Створити категорію `{ "name": "Новини" }` |
| GET | `/posts` | Список дописів з вкладеними `category` та `author` |
| GET | `/posts/:id` | Допис за id з вкладеними `category` та `author` |
| POST | `/posts` | Створити допис `{ "title", "content?", "categoryId", "authorId" }` |

Фільтри `GET /posts`:

- `?category=Новини` — за назвою категорії (унікальним `name`);
- `?categoryId=1` — за id категорії.

Створення допису виконує `category.connect({ id })` та `author.connect({ id })`, читання — `include("category").include("author", …)` з проєкцією `author` лише на `{ id, email }` (пароль не витікає).

> Тимчасово `authorId` береться з body запиту `POST /posts`; автор перевіряється сервісом (404 `AUTHOR_NOT_FOUND`).

Приклад відповіді `GET /posts/:id`:

```json
{
  "id": 1,
  "title": "Перший допис",
  "content": "Привіт, форуме!",
  "categoryId": 1,
  "authorId": 1,
  "author": { "id": 1, "email": "alice@example.com" },
  "category": { "id": 1, "name": "Новини", "...": "..." }
}
```

## Коди помилок

| Статус | Випадок |
| --- | --- |
| 400 | Некоректний `id`, `categoryId`, `authorId` або некоректний JSON |
| 401 | Невірний пароль чи невідомий email (`INVALID_CREDENTIALS`) |
| 404 | `Post`, `Category` або автор допису не знайдено |
| 409 | Повторна назва категорії або повторний email при реєстрації |
| 422 | Недопустимі поля у DTO (невідомі поля, порушені правила) |
| 500 | Непередбачена помилка сервера |

Приклад відповідей:

```json
{ "message": "CATEGORY_NOT_FOUND" }
{ "message": "INVALID_CREDENTIALS" }
{ "message": "EMAIL_ALREADY_EXISTS" }
{ "message": "VALIDATION_FAILED", "details": ["AUTHOR_ID_IS_REQUIRED"] }
```

## Архітектура

Ручний DI в `src/app.ts`: `repository → service → handler → router`.

```
src/
  app.ts                 # створення app, DI-збірка, error handler
  server.ts              # запуск
  common/                # ApiError (400/401/404/409/422), error-handler middleware
  dto/                   # DTO + валідація (422)
  domain/                # entity + інтерфейси Repository/Service
  lib/                   # password.ts (Argon2id + pepper), jwt.ts (sign access token)
  repositories/          # доступ до даних (Prisma ORM 8)
  services/              # бізнес-логіка (401/404/409)
  transport/handlers/    # HTTP-обработчики (400/422), встановлення Cookie
  routers/               # маршрути Express
  prisma/                # contract.prisma, db.ts, contract.json/d.ts
```

## Postman

Імпортуйте `docs/forum-api.postman_collection.json` у Postman: папка **Auth** (реєстрація двох користувачів, логін з перевіркою Cookie `accessToken`), дві категорії, три дописи від різних авторів, а також кейси помилок 400/401/404/409/422.

Порядок прогону: Auth → Categories → Posts → Errors (для 409/401 потрібні акаунти з Auth).
