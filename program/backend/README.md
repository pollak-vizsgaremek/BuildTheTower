# BuildTheTower backend

Express 5 + Sequelize 6 + MySQL, JavaScript ESM. Node.js 22+ ajánlott; ellenőrizve Node 24 és MySQL 8.4 alatt.

## Indítás

1. Indítsd el a MySQL-t (például Laragonban).
2. `npm install`
3. Ha még nincs `.env`: `Copy-Item .env.example .env`, majd állítsd be a kapcsolatot és az `ACCESS_TOKEN_SECRET` értékét. Véletlenszerű titok generálása: `node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"`. A fejlesztés során már létrejött egy helyi, Git által ignorált `.env` véletlenszerű titokkal.
4. `npm run db:create` – csak a hiányzó adatbázist hozza létre, nem töröl adatot.
5. `npm run dev` (fejlesztés) vagy `npm start`.

Alapértékek: API `http://localhost:3300`, MySQL `127.0.0.1:3306`, adatbázis `btt`, felhasználó `root`. Az API csak sikeres adatbáziskapcsolat után indul. Az új `users` táblát létrehozza; meglévő táblát nem alakít át automatikusan.

Ha már létezik a korábbi `users` tábla, külön migráció szükséges: a `password` mező legyen nullable, továbbá `googleId` (nullable, egyedi VARCHAR(255)) és `privacyAcceptedAt` (DATE/DATETIME) mezők szükségesek. Meglévő fiókhoz ne találj ki utólagos hozzájárulási időpontot; az áttérés során külön kezeld az elfogadást. A repó üzleti SQL-exportjában még nincs `users` tábla.

## API

Minden végpont prefixe `/api/v1/auth`. A kliens `credentials: include` beállítással használja őket. JSON-hibaformátum: `{ message, fields? }`.

| Metódus | Végpont | Bemenet / eredmény |
| --- | --- | --- |
| POST | `/register` | `username`, `email`, `password`, `passwordConfirmation`, `acceptPrivacy: true`; 201 + publikus user + munkamenetsüti |
| POST | `/login` | `email`, `password`, opcionális `rememberMe`; 200 + user + süti |
| POST | `/google` | Google `credential`, új fióknál `acceptPrivacy: true`, opcionális `rememberMe` |
| GET | `/me` | Aktuális publikus user vagy 401 |
| POST | `/logout` | Süti törlése, 204 |
| GET | `/config` | Publikus `googleClientId`; titkos konfiguráció nélkül |

A jelszó aszinkron bcrypt (12 kör), minimum 8 karakter, maximum 72 UTF-8 bájt. A regisztráció nem fogad el kliensoldali szerepkört. A JWT csak azonosítót tartalmaz, 8 órás élettartammal; „Emlékezzen rám” esetén 7 napos. A normál süti munkamenetsüti (a böngésző munkamenet-visszaállítása megtarthatja), a megjegyzett süti tartós. Kijelentkezés törli a sütit, de az esetleg korábban ellopott JWT-t nem vonja vissza; ehhez később szerveroldali session/revocation tároló szükséges.

## Google-belépés

1. A Google Cloud / Google Auth Platform felületén hozz létre **Web application** típusú OAuth klienst, és állítsd be az alkalmazás megjelenési/hozzájárulási adatait.
2. Authorized JavaScript origins: `http://localhost` és `http://localhost:5173` (élesben a tényleges HTTPS domain is).
3. Az azonosítót írd a backend `.env` fájlba: `GOOGLE_CLIENT_ID=...apps.googleusercontent.com`, majd indítsd újra a backendet.
4. Klienssecret nem szükséges: a Google Identity Services JavaScript callback ID-tokent küld, amit a backend a `google-auth-library` segítségével ellenőriz (aláírás, audience, lejárat, megerősített e-mail).

Új Google-fiók a regisztrációs oldalon, a tájékoztató elfogadása után jön létre. Meglévő Google-fiók a login oldalon is beléphet. Meglévő jelszavas fiókot e-mail-egyezés alapján nem kapcsolunk össze automatikusan Google-fiókkal. A Google-gomb konfiguráció nélkül inaktív, ezt a felület jelzi. Valós Google-fiókos belépés csak a saját OAuth kliens beállítása után ellenőrizhető.

Forrás: [Google Identity Services beállítás](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid).

## Tesztek

- `npm test`: jelszóhashelés, validáció és JWT-élettartam/tamper ellenőrzés, adatbázis nélkül.
- Integrációs teszt: külön, `_test` végű MySQL-adatbázis szükséges. PowerShell példa:

```powershell
$env:DB_NAME='btt_auth_test'
$env:TEST_DB_NAME='btt_auth_test'
npm run db:create
npm run test:integration
```

Az integrációs teszt a saját fiókját eltávolítja. `TEST_DB_NAME` nélkül kimarad. Az első ellenőrzés elkülönített, 3307-es MySQL 8.4 példányon történt a `.tmp` könyvtárban, nem a felhasználó adatbázisán.

Élesben `NODE_ENV=production`, HTTPS, erős egyedi titok és a tényleges `FRONTEND_URL` szükséges. A frontend és az API közös origin alatt, `/api` reverse proxyval használható. A CORS/origin ellenőrzést és a kérésszámkorlátot ne kapcsold ki. Megbízható reverse proxy esetén a `trust proxy` beállítást az adott topológiára kell megadni, hogy a kérésszámkorlát a valódi klienscímet lássa.

Automatikus e-mailes jelszó-visszaállítás nincs beállítva; a felület ezt jelzi. Az adatkezelési oldal fejlesztői tájékoztató, az üzemeltető adataival élesítés előtt kiegészítendő.
