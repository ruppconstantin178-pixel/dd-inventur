// ─────────────────────────────────────────────────────────────────────────────
// d&d Tagesinventur – Google Apps Script Backend
// Diesen Code in https://script.google.com einfügen
// ─────────────────────────────────────────────────────────────────────────────

const SHEET_NAME = "Inventur_Daten";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const body = JSON.parse(e.postData.contents);

    if (body.action === "upsert") {
      upsertRows(body.store, body.kw, body.rows);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  // Health check
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", message: "d&d Inventur API läuft" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function upsertRows(store, kw, rows) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let sheet   = ss.getSheetByName(SHEET_NAME);

  // Create sheet + header if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    const headers = [
      "Timestamp", "Store", "KW", "Tag", "Tag Nr",
      "Kategorie", "Gericht", "kg/Stk",
      "Ausgangsmenge (kg)", "Verkauft (Stk)", "Double Up (Stk)",
      "Verbraucht (kg)", "Zulieferung (kg)", "Soll (kg)", "Ist (kg)"
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length)
      .setBackground("#4F614F")
      .setFontColor("#FFFFFF")
      .setFontWeight("bold");
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(2, 140);
    sheet.setColumnWidth(6, 120);
    sheet.setColumnWidth(7, 200);
  }

  const allData    = sheet.getDataRange().getValues();
  const headerRow  = allData[0];

  // Build a lookup: "store|kw|tagNr|kategorie|gericht" → row index (1-based)
  const lookup = {};
  for (let i = 1; i < allData.length; i++) {
    const r   = allData[i];
    const key = `${r[1]}|${r[2]}|${r[4]}|${r[5]}|${r[6]}`;
    lookup[key] = i + 1; // 1-based sheet row
  }

  // Upsert each row
  rows.forEach(row => {
    const key = `${store}|${kw}|${row.tagNr}|${row.kategorie}|${row.gericht}`;
    const values = [
      row.timestamp,
      store,
      kw,
      row.tag,
      row.tagNr,
      row.kategorie,
      row.gericht,
      row.kg_pro_stk,
      row.ausgangsmenge,
      row.verkauft,
      row.double_up,
      parseFloat(row.verbraucht_kg),
      row.zulieferung_kg,
      parseFloat(row.soll_kg),
      row.ist_kg
    ];

    if (lookup[key]) {
      // Update existing row
      sheet.getRange(lookup[key], 1, 1, values.length).setValues([values]);
    } else {
      // Append new row
      sheet.appendRow(values);
    }
  });

  // Auto-format number columns
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 9, lastRow - 1, 7).setNumberFormat("0.000");
  }
}
