# BuildTheTower frontend

React 19 + Vite + React Router. A login/regisztráció a mellékelt asztali látványtervek színeit, elrendezését, építkezési hátterét és magyar feliratait követi, mobilhoz igazított nézettel. A Windows-belépés helyén Google-belépés található.

## Indítás

```powershell
npm install
npm run dev
```

Nyisd meg: **http://localhost:5173**. A [backend](../backend/README.md) is fusson a 3300-as porton, működő MySQL-lel. A Vite `/api` proxyja összeköti a két projektet; a kliensbe nem kell API-kulcsot tenni.

## Elkészült működés

- `/login` és `/register`, továbbá magyar `/bejelentkezes`, `/regisztracio` átirányítások.
- E-mailes regisztráció, jelszómegerősítés, adatkezelési elfogadás, siker után automatikus belépés.
- Belépés, jelszó láthatóságkapcsoló, „Emlékezzen rám”, magyar mező- és hálózati hibák, küldés alatti állapot.
- HttpOnly sütis munkamenet, újratöltés utáni `/me` ellenőrzés, védett útvonalak és kijelentkezés.
- Google Identity Services bejelentkezés szerveroldali tokenellenőrzéssel. Beállítás: a backend `GOOGLE_CLIENT_ID` változója; kliensazonosító nélkül a gomb jelzi a hiányzó konfigurációt.
- `/adatvedelem`: új lapon megnyitható fejlesztői tájékoztató. Az éles üzemeltető adatai még kitöltendők.
- Jelszó-visszaállítási segítség párbeszédablak; e-mailküldő/jelszóreset szolgáltatás még nincs.
- `/Vezerlopult`: minimális, valódi bejelentkezési állapotot bemutató kezdőlap. A projektek, dokumentumok és munkatársak üzleti moduljai továbbra is fejlesztés alatt állnak.

## Ellenőrzés

```powershell
npm run build
npm run test:e2e
```

A Playwright-tesztek telepített Chrome-ot használnak, asztali (1548×1016) és mobilnézetben. A frontend dev szerverét a teszt automatikusan elindítja; a backend előzetesen fusson **külön tesztadatbázison**. A tesztek egyedi `@example.test` című fiókokat hoznak létre. A képernyőképek és hibás futások trace-ei az ignorált `test-results/` könyvtárba kerülnek. A Google konfiguráció nélküli állapotát ellenőrző teszt üres `GOOGLE_CLIENT_ID` értéket feltételez.

A teljes valódi Google-belépéshez saját Google OAuth kliens és interaktív Google-fiók szükséges; ezt a helyi teszt nem automatizálja. A backend integrációs tesztje külön ellenőrzi a Google-fiók létrehozásának és ütközéskezelésének logikáját helyettesített Google-válasszal.

## Felépítés

`src/pages/` az oldalakat, `src/components/` a megosztott megjelenést, `src/auth/` a munkamenetkezelést, `src/lib/api.js` az API-kéréseket tartalmazza. A projekt további munkaszabályai: [AGENTS.md](AGENTS.md).

A háttér helye és generálási promptja: [ASSETS.md](ASSETS.md). A Google Fonts Inter betűje hálózat nélkül rendszerbetűre vált; a háttérkép helyi fájl.

Éles kiszolgálásnál a `dist/` könyvtárhoz SPA history fallback és `/api` reverse proxy kell. Az `npm run preview` önmagában nem konfigurál éles API-proxyt.
