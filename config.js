// ─────────────────────────────────────────────────────────────────────────────
// d&d Tagesinventur – Konfiguration
// ─────────────────────────────────────────────────────────────────────────────
//
// EINMALIGE EINRICHTUNG (5 Minuten):
//
// 1. Öffne: https://sheets.google.com → neue Tabelle erstellen
//    Tabelle benennen: "dd_inventur_[KW]" oder ähnlich
//
// 2. Öffne: https://script.google.com → "Neues Projekt"
//    Füge den Code aus "google_apps_script.js" ein → Speichern (Strg+S)
//
// 3. Klicke auf "Bereitstellen" → "Neue Bereitstellung"
//    → Typ: "Web App"
//    → Ausführen als: "Ich"
//    → Zugriff: "Jeder"
//    → Klicke "Bereitstellen" → URL kopieren
//
// 4. Füge die URL unten ein (zwischen den Anführungszeichen):
//
const SCRIPT_URL = "HIER_DEINE_APPS_SCRIPT_URL_EINFÜGEN";
//
// Das war's. Die App sendet ab sofort automatisch alle Daten an dein Google Sheet.
// ─────────────────────────────────────────────────────────────────────────────
