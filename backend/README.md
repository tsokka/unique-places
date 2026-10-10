# unique.places Backend

Один учебный Backend для всех пяти этапов Angular-проекта **unique.places**. В ДЗ №4 и №9 Backend фактически не нужен: данные можно временно держать во frontend/localStorage. Начиная с ДЗ №15 тот же проект Backend используется без замены и затем расширяет возможности frontend в ДЗ №19 и №22.

## Что поддерживает

- MongoDB + `migrate-mongo`.
- Login + простой endpoint регистрации для Postman (во frontend регистрация не требуется).
- JWT Access Token + Refresh Token без ротации: refresh возвращает только новый Access Token.
- Logout и `/auth/me`.
- Каталог мест и server-side фильтрация по категории.
- Подробности места.
- Избранное, привязанное к пользователю.
- Координаты `latitude/longitude` для Leaflet + OpenStreetMap.
- Поиск по названию, городу, стране, тегам и описаниям.
- Рекомендации по 3 места с возможностью исключить уже показанные id.
- Нормальные empty states: API возвращает `items: []` и `total: 0`.
- Единый формат ошибок `{ status, message, code }`.
- Учебная имитация loading/error для GET-запросов через `?delay=1500` и `?simulateError=true`.
- Полная спецификация OpenAPI 3.0.0: `openapi.yaml`.

## Быстрый старт

Требуется Node.js 20+ и MongoDB.

```bash
cp .env.example .env
npm install
npm run migrate
npm run dev
```

API будет доступен по адресу `http://localhost:3000/api`.

Проверка:

```bash
curl http://localhost:3000/api/health
```

## Тестовый пользователь из миграции

- Email: `student@unique.places`
- Password: `student123`

Это учебные данные. Для production такой пароль/секреты использовать нельзя.

## Данные мест

Начальная миграция содержит 8 демонстрационных записей, чтобы проект сразу запускался. Их можно полностью заменить своими данными. Поля места:

- `name`
- `category` — одно из технических значений: `hotel`, `restaurant`, `entertainment`, `nature`, `culture`, `architecture`, `spa`. Значение «Все» — это состояние frontend и передаётся как `all` либо параметр `category` не передаётся.
- `city`
- `country`
- `rating` — `0..5` или `null`
- `priceLevel` — `1..4` или `null`; frontend сам отображает €, €€, €€€...
- `tags` — массив строк
- `shortDescription` — текст карточки
- `description` — полный текст для модального окна
- `imageUrl`
- `badge` — строка или `null`
- `latitude`, `longitude` — координаты карты или `null`
- `isPublished`

`imageUrl` указывает на `/images/places/...`. Сами файлы положите в `public/images/places/`: Backend раздаёт эту папку статически. Например, `/images/places/mist-springs.jpg` будет доступен по `http://localhost:3000/images/places/mist-springs.jpg`.

## API по этапам домашних работ

### ДЗ №4

Backend не требуется. Структуру объектов из миграции можно использовать как ориентир для локального массива мест.

### ДЗ №9

Backend по-прежнему не требуется. Избранное хранится в `localStorage`. Поля `badge`, `rating`, `priceLevel`, `category`, `tags`, `description` уже предусмотрены моделью и затем без изменения переезжают на Backend.

### ДЗ №15

Основные endpoint'ы:

- `POST /api/auth/register` — дополнительный endpoint для создания пользователя через Postman
- `POST /api/auth/login`
- `POST /api/auth/refresh` — возвращает только новый Access Token, Refresh Token не ротируется
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/places?category=hotel`
- `GET /api/places/:id`
- `GET /api/favorites`
- `POST /api/favorites`
- `DELETE /api/favorites/:placeId`

Все places/favorites endpoint'ы защищены Access Token.

### ДЗ №19

`GET /api/places` возвращает `latitude` и `longitude`. Для фильтра карты используется тот же `?category=...`, что и для каталога. Отдельный endpoint карты специально не нужен.

### ДЗ №22

- `GET /api/places/search?q=Отель`
- `GET /api/places/recommendations?limit=3`
- `GET /api/places/recommendations?limit=3&exclude=id1,id2,id3`

Для кнопки «Обновить» frontend передаёт id текущей тройки через `exclude`, поэтому Backend может гарантированно не вернуть эти же записи в следующей подборке, если в базе достаточно других мест.

## Проверка Loading / Error / Empty

### Loading

При `ALLOW_SIMULATED_ERRORS=true`:

```text
GET /api/places?delay=2000
GET /api/favorites?delay=2000
GET /api/places/search?q=hotel&delay=2000
```

### Error

```text
GET /api/places?simulateError=true
GET /api/favorites?simulateError=true
GET /api/places/search?q=hotel&simulateError=true
```

API вернёт `500` в едином формате. Этот механизм нужен только для обучения и легко отключается через `.env`.

### Empty

- каталог: запросить категорию, для которой в БД нет записей;
- избранное: удалить все избранные места;
- поиск: использовать строку, которой нет ни в одном месте;
- рекомендации: при слишком маленьком наборе данных результат может содержать меньше трёх записей.

## Простая схема Refresh Token

Для урока удобно временно поставить в `.env`:

```env
ACCESS_TOKEN_TTL=10s
```

Тогда можно быстро дождаться `401 ACCESS_TOKEN_INVALID`, выполнить `/auth/refresh` и повторить исходный запрос через Angular Interceptor. Refresh Token при этом остаётся тем же самым до истечения срока действия или logout — сохранять новую пару токенов после refresh не нужно.

## Категории

Backend использует следующие значения:

| Интерфейс | API |
|---|---|
| Все | `all` или параметр отсутствует |
| Отели | `hotel` |
| Рестораны | `restaurant` |
| Развлечения | `entertainment` |
| Природа | `nature` |
| Культура | `culture` |
| Архитектура | `architecture` |
| СПА и релакс | `spa` |

## Создание пользователя через Postman

Frontend этого проекта не обязан иметь регистрацию, но Backend поддерживает простой учебный endpoint:

```text
POST /api/auth/register
```

```json
{
  "name": "Roman",
  "email": "roman@example.com",
  "password": "secret12"
}
```

После регистрации пользователь может войти через обычный `/api/auth/login`.

## OpenAPI

Основной файл: `openapi.yaml`. Копия также находится в `docs/openapi.yaml`.

Спецификация описывает тела запросов/ответов, Bearer Auth, ошибки, query parameters, модели Place/User/Favorite и development-параметры для проверки UI-состояний.

## Важное про рекомендации

Endpoint рекомендаций не является ML-рекомендательной системой. Он случайно выбирает опубликованные места и исключает избранное пользователя и id, переданные через `exclude`. Это специально соответствует учебной задаче и не усложняет Backend.
