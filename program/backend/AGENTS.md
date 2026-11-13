# Backend – BuildTheTower

## Felépítés
- Node.js ESM JavaScript, Express 5, Sequelize 6 és MySQL. Ne használj TypeScript-importokat a JavaScript-fájlokban.
- `src/index.js`: konfigurációellenőrzés, adatbáziskapcsolat, HTTP-kiszolgáló.
- `src/app.js`: middleware-ek, CORS, útválasztók és központi hibakezelés.
- `src/controller/`: HTTP-kérések, válaszok, sütik, kérésszámkorlát.
- `src/service/`: hitelesítési üzleti logika; `src/model/`: Sequelize-modellek; `src/utils/`: validáció, jelszó és JWT.
- API-prefix: `/api/v1/auth`; a frontend Vite-proxyn keresztül hívja.

## Munkaszabályok
- A publikus hibák és felhasználói szövegek magyar nyelvűek, UTF-8 kódolással.
- Titkok csak környezeti változóban/ignorált `.env` fájlban; példák a `.env.example` fájlba kerüljenek.
- A jelszavakat aszinkron bcrypt hasheli. Soha ne küldj jelszóhash-t, Google-tokent vagy adatbázishibát a kliensnek.
- A munkamenet aláírt JWT HttpOnly sütiben; az engedélyezett origin, a SameSite és az éles Secure beállítás maradjon meg.
- A Google ID-token hitelességét és audience mezőjét a szerveren ellenőrizd. E-mail-egyezés alapján ne kapcsolj össze automatikusan fiókokat.
- A kliens nem adhat meg szerepkört. Új felhasználó `role: 2` jogosultságot kap.
- Indításkor tilos `sync({ alter: true })`, `force`, illetve adatot törlő migráció. Meglévő táblaváltozás külön, felülvizsgálható migráció legyen.
- A repó `adatbazis/btt.sql` fájlja üzleti táblákat tartalmaz; az auth külön `users` táblát használ.

## Parancsok
- `npm install`, `npm run dev`, `npm start`, `npm test`.
- Indítás előtt szükséges a `.env` és a benne megadott létező MySQL-adatbázis.
- A hitelesítési változásokat sikeres és hibás belépéssel, duplikált regisztrációval, `/me` és kijelentkezés ellenőrzésével vizsgáld.
