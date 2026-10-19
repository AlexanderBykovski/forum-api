# Forum API

REST API форуму на Express + TypeScript + **Prisma ORM 8** (contract-based, PostgreSQL).

Гілка `feat/post-categories` додає категорії дописів та зв'язок `Post` ↔ `Category` (1:N).

## Стек

- Node.js, TypeScript, Express 5
- Prisma ORM 8 (`@prisma/orm-postgres`, `contract.prisma`)
- PostgreSQL ≥ 15

## Запуск

```bash
npm install
cp .env.example .env          # вкажіть DATABASE_URL
npm run contract:emit         # згенерувати contract.json / contract.d.ts
npm run db:update             # оновити схему БД під контракт
npm run dev                   # сервер на http://localhost:8000
```

Інші команди: `npm run db:schema` (перегляд схеми БД), `npm run db:verify`, `npm run typecheck`.

> У Prisma ORM 8 команду `prisma studio` прибрано з CLI — таблиці зручно переглядати через `npm run db:schema` або Prisma Console.

## Модель даних

```prisma
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
  category   Category @relation(fields: [categoryId], references: [id])
  createdAt  TimestamptzString @default(now())
  updatedAt  temporal.updatedAtString()
}
```

## Ендпоінти

| Метод | Шлях | Опис |
| --- | --- | --- |
| GET | `/categories` | Список категорій |
| GET | `/categories/:id` | Категорія за id |
| POST | `/categories` | Створити категорію `{ "name": "Новини" }` |
| GET | `/posts` | Список дописів з вкладеною `category` |
| GET | `/posts/:id` | Допис за id з вкладеною `category` |
| POST | `/posts` | Створити допис `{ "title", "content?", "categoryId" }` |

Фільтри `GET /posts`:

- `?category=Новини` — за назвою категорії (унікальним `name`);
- `?categoryId=1` — за id категорії.

Створення допису виконується через `category.connect({ id })`, читання — через `include("category")`.

## Коди помилок

| Статус | Випадок |
| --- | --- |
| 400 | Некоректний `id`, `categoryId` або некоректний JSON |
| 404 | `Post` або `Category` не знайдено |
| 409 | Повторна назва категорії (`Category.name` unique) |
| 422 | Недопустимі поля у DTO (невідомі поля, порушені правила) |
| 500 | Непередбачена помилка сервера |

Приклад відповідей:

```json
{ "message": "CATEGORY_NOT_FOUND" }
{ "message": "VALIDATION_FAILED", "details": ["UNKNOWN_FIELD_foo", "NAME_IS_REQUIRED"] }
```

## Архітектура

Ручний DI в `src/app.ts`: `repository → service → handler → router`.

```
src/
  app.ts                 # створення app, DI-збірка, error handler
  server.ts              # запуск
  common/                # ApiError, error-handler middleware
  dto/                   # DTO + валідація (422)
  domain/                # entity + інтерфейси Repository/Service
  repositories/          # доступ до даних (Prisma ORM 8)
  services/              # бізнес-логіка (404/409)
  transport/handlers/    # HTTP-обработчики (400/422)
  routers/               # маршрути Express
  prisma/                # contract.prisma, db.ts, contract.json/d.ts
```

## Postman

Імпортуйте `docs/forum-api.postman_collection.json` у Postman: у колекції дві категорії та три дописи, а також кейси помилок 400/404/409/422.
