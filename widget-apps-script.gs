/**
 * EJ9 Dash → Google Sheets → widget de KWGT
 *
 * 1. Crea una hoja de cálculo nueva en Google Sheets (por ejemplo "EJ9 km").
 * 2. Extensiones → Apps Script. Borra lo que haya y pega todo este código. Guarda.
 * 3. Implementar → Nueva implementación → tipo "Aplicación web".
 *    Ejecutar como: Yo. Quién tiene acceso: Cualquier usuario. → Implementar y autoriza.
 * 4. Copia la URL que acaba en /exec y pégala en la app: Ajustes → Enlace del widget.
 * 5. En KWGT, en un texto, pon la fórmula:
 *      $wg("PEGA_AQUÍ_LA_URL/exec", json, .km)$
 */

// La app envía los km aquí (cada 2 km, al desconectar y al pulsar "Enviar km ahora")
function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const hoja = SpreadsheetApp.getActive().getSheets()[0];
  if (hoja.getLastRow() === 0) hoja.appendRow(["Fecha", "Km", "Km del viaje", "Litros del viaje", "Coche"]);
  hoja.appendRow([new Date(), d.km, d.viaje_km, d.viaje_l, d.coche]);
  PropertiesService.getScriptProperties().setProperties({ km: String(d.km), fecha: d.fecha || "" });
  return ContentService.createTextOutput("ok");
}

// El widget lee los km de aquí: {"km":214532,"fecha":"..."}
function doGet() {
  const p = PropertiesService.getScriptProperties().getProperties();
  const salida = { km: Number(p.km || 0), fecha: p.fecha || "" };
  return ContentService.createTextOutput(JSON.stringify(salida)).setMimeType(ContentService.MimeType.JSON);
}
