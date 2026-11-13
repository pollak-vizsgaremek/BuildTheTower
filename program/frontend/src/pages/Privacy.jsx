import { Link } from 'react-router';
export default function Privacy() {
  return <main className="privacy-page"><article><h1>Adatkezelési tájékoztató</h1>
    <p className="notice">Fejlesztői változat. Éles használat előtt az üzemeltetőnek ki kell egészítenie a tájékoztatót az adatkezelő elérhetőségével, a megőrzési időkkel és a joggyakorlás módjával.</p>
    <h2>Milyen adatokat tárol a rendszer?</h2><p>A fiókhoz felhasználónevet, e-mail címet, titkosított jelszóhash-t, jogosultságot, valamint a regisztráció és az elfogadás időpontját tároljuk. Google-belépésnél a Google-azonosító és a megjelenített név is bekerül; a Google-jelszót nem kapjuk meg.</p>
    <h2>Mire használjuk az adatokat?</h2><p>A fiók azonosítására és a munkaterülethez való hozzáférés biztosítására. Az adatok a rendszer MySQL-adatbázisában találhatók.</p>
    <h2>Munkamenet</h2><p>A belépést HttpOnly süti biztosítja. Normál belépésnél a token legfeljebb 8 óráig, az „Emlékezzen rám” választásával 7 napig érvényes. Kijelentkezéskor a böngészőből töröljük a munkamenetsütit.</p>
    <h2>Google-belépés</h2><p>A Google-bejelentkezési felületet csak a szolgáltatás beállítása után töltjük be. A Google saját adatkezelési szabályai a Google-fiók használatára külön vonatkoznak.</p>
    <Link className="back-link" to="/register">Vissza a regisztrációhoz</Link></article></main>;
}
