# Frontend – BuildTheTower

## Felépítés
- React 19, JavaScript JSX, Vite, React Router, Lucide ikonok.
- `src/main.jsx`: útvonalak, lazy oldalak, Suspense, AuthProvider.
- `src/pages/`: Login, Register, Home, Privacy; a további üzleti oldalak még vázak.
- `src/components/`: közös auth-elrendezés, mező, logó és Google-belépés.
- `src/auth/`: munkamenetállapot és védett útvonalak; `src/lib/api.js`: közös fetch-kezelés.
- `src/styles.css`: reszponzív felület. `public/images/`: helyi képek.

## Munkaszabályok
- Magyar felhasználói szöveg, UTF-8; kövesd a referenciák narancs–sötétkék–világos színvilágát.
- Mobilon az űrlap legyen elsődleges, vízszintes görgetés nélkül.
- Közös elemekhez meglévő komponenst használj. Tartsd meg a címkéket, billentyűzetes fókuszt, aria hibajelzéseket és a jelszó láthatóságának kapcsolóját.
- Relatív API-cím: `/api/v1/auth`; fejlesztéskor a Vite továbbítja a backend 3300 portjára.
- Tokent ne tárolj localStorage-ban. A HttpOnly sütit a backend kezeli; minden kérés `credentials: include` beállítású.
- A Google kliensazonosítót a backend `/config` végpontja adja, a hitelesítést a szerver ellenőrzi. Titkos kulcs nem kerülhet a kliensbe.
- Kezeld a betöltést, hálózati hibát, hibás mezőket és többszörös elküldést. Nem konfigurált integrációt ne tüntess fel működőként.
- A frontend útvonalvédelme csak felületi védelem; jövőbeli üzleti API-knál a backend jogosultságvizsgálata is szükséges.

## Parancsok
- `npm install`, `npm run dev`, `npm run build`.
- `npm run test:e2e`: működő backend/MySQL szükséges; a teszt külön fiókokat hoz létre. Tesztadatbázist használj.
- Felületi változást asztali és mobilméretben ellenőrizz; auth-változásnál sikeres/hibás regisztráció, belépés, újratöltés és kijelentkezés szükséges.
