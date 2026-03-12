/**
 * ============================================================
 *  ÔRIYA COD — Google Apps Script
 *  À coller dans script.google.com (nouveau projet)
 * ============================================================
 *
 *  INSTALLATION :
 *  1. Aller sur https://script.google.com → Nouveau projet
 *  2. Coller l'intégralité de ce fichier dans l'éditeur
 *  3. Enregistrer (Ctrl+S) → Nommer le projet "ÔRIYA COD"
 *  4. Déployer → Nouveau déploiement
 *       Type : Application Web
 *       Exécuter en tant que : Moi
 *       Accès : Tout le monde (anonyme)
 *  5. Autoriser les permissions quand demandé
 *  6. Copier l'URL de déploiement → la coller dans checkout-cod.html?admin=1
 *
 *  STRUCTURE DE LA FEUILLE "Commandes" :
 *  N° CMD | Date | Prénom | Nom | Téléphone | Ville | Adresse | Produit | Prix MAD | Note | Statut | Livreur | Payé
 * ============================================================
 */

// ── NOM DE LA FEUILLE (ne pas modifier sauf si vous voulez un autre nom)
var SHEET_NAME = 'Commandes';

// ── COLONNES (ordre et intitulés exacts)
var HEADERS = [
  'N° CMD',
  'Date',
  'Prénom',
  'Nom',
  'Téléphone',
  'Ville',
  'Adresse',
  'Produit',
  'Prix MAD',
  'Note',
  'Statut',
  'Livreur',
  'Payé'
];

// ── PRÉFIXE DES NUMÉROS DE COMMANDE
var ORDER_PREFIX = 'CMD-';

/* ==============================================================
   doPost — Point d'entrée pour les requêtes POST
   Reçoit les données JSON d'une commande et les écrit dans le Sheet
   ============================================================== */
function doPost(e) {
  try {
    // Parser le corps JSON de la requête
    var body = JSON.parse(e.postData.contents);

    // Obtenir ou créer la feuille "Commandes"
    var sheet = getOrCreateSheet();

    // Créer les en-têtes si la feuille est vide
    ensureHeaders(sheet);

    // Générer le numéro de commande auto-incrémenté
    var orderId = generateOrderId(sheet);

    // Construire la ligne à insérer
    var now = new Date();
    var dateStr = Utilities.formatDate(now, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');

    var row = [
      orderId,                              // N° CMD
      dateStr,                              // Date
      body.prenom   || '',                  // Prénom
      body.nom      || '',                  // Nom
      body.telephone || '',                 // Téléphone
      body.ville    || '',                  // Ville
      body.adresse  || '',                  // Adresse
      body.produit  || '',                  // Produit
      body.prix     || '',                  // Prix MAD
      body.note     || '',                  // Note
      'En attente',                         // Statut initial
      '',                                   // Livreur (vide au départ)
      'Non'                                 // Payé (vide au départ)
    ];

    // Ajouter la ligne en bas du tableau
    sheet.appendRow(row);

    // Mise en forme légère sur la nouvelle ligne
    var lastRow = sheet.getLastRow();
    formatNewRow(sheet, lastRow, orderId);

    // Réponse JSON de succès
    return buildResponse({ success: true, orderId: orderId, message: 'Commande enregistrée avec succès' });

  } catch (err) {
    // Réponse JSON d'erreur
    return buildResponse({ success: false, error: err.toString() });
  }
}

/* ==============================================================
   doGet — Point d'entrée pour les requêtes GET
   Supporte ?action=getOrders pour retourner toutes les commandes
   ============================================================== */
function doGet(e) {
  try {
    var action = (e.parameter && e.parameter.action) ? e.parameter.action : '';

    if (action === 'getOrders') {
      // Retourner toutes les commandes au format JSON
      var sheet = getOrCreateSheet();
      ensureHeaders(sheet);

      var data = sheet.getDataRange().getValues();

      if (data.length <= 1) {
        // Seulement les en-têtes ou feuille vide
        return buildResponse({ success: true, orders: [], total: 0 });
      }

      // Première ligne = en-têtes
      var headers = data[0];
      var orders = [];

      for (var i = 1; i < data.length; i++) {
        var rowObj = {};
        for (var j = 0; j < headers.length; j++) {
          // Convertir les dates en chaînes lisibles
          var val = data[i][j];
          if (val instanceof Date) {
            val = Utilities.formatDate(val, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
          }
          rowObj[headers[j]] = val;
        }
        orders.push(rowObj);
      }

      return buildResponse({ success: true, orders: orders, total: orders.length });

    } else {
      // Action inconnue — retourner un ping de santé
      return buildResponse({ success: true, status: 'ÔRIYA COD Apps Script en ligne', version: '1.0' });
    }

  } catch (err) {
    return buildResponse({ success: false, error: err.toString() });
  }
}

/* ==============================================================
   getOrCreateSheet — Obtenir la feuille "Commandes"
   La crée si elle n'existe pas encore
   ============================================================== */
function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    // Créer la feuille si absente
    sheet = ss.insertSheet(SHEET_NAME);
  }

  return sheet;
}

/* ==============================================================
   ensureHeaders — Créer les en-têtes si la feuille est vide
   ============================================================== */
function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    // Feuille complètement vide → écrire les en-têtes
    sheet.appendRow(HEADERS);

    // Mise en forme des en-têtes
    var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#1a1a00');
    headerRange.setFontColor('#D4AF37');
    headerRange.setFontSize(10);
    headerRange.setBorder(true, true, true, true, true, true);

    // Figer la première ligne
    sheet.setFrozenRows(1);

    // Largeurs de colonnes automatiques
    sheet.autoResizeColumns(1, HEADERS.length);

    // Largeurs spécifiques pour les colonnes de texte long
    sheet.setColumnWidth(7, 220); // Adresse
    sheet.setColumnWidth(8, 180); // Produit
    sheet.setColumnWidth(10, 180); // Note
  }
}

/* ==============================================================
   generateOrderId — Générer un numéro CMD-XXX auto-incrémenté
   ============================================================== */
function generateOrderId(sheet) {
  var lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    // Pas encore de commandes (seulement les en-têtes ou vide)
    return ORDER_PREFIX + '001';
  }

  // Chercher le dernier numéro CMD dans la colonne 1
  var colA = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  var maxNum = 0;

  for (var i = 0; i < colA.length; i++) {
    var cellVal = String(colA[i][0]);
    if (cellVal.startsWith(ORDER_PREFIX)) {
      var num = parseInt(cellVal.replace(ORDER_PREFIX, ''), 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  }

  // Incrémenter et formater avec zéros de tête (minimum 3 chiffres)
  var nextNum = maxNum + 1;
  var padded = String(nextNum).padStart(3, '0');
  return ORDER_PREFIX + padded;
}

/* ==============================================================
   formatNewRow — Mise en forme visuelle de la nouvelle ligne
   ============================================================== */
function formatNewRow(sheet, rowIndex, orderId) {
  try {
    var range = sheet.getRange(rowIndex, 1, 1, HEADERS.length);

    // Alternance de couleur de fond
    if (rowIndex % 2 === 0) {
      range.setBackground('#f9f9f0');
    } else {
      range.setBackground('#ffffff');
    }

    // Colonne N° CMD en gras et couleur dorée
    var cmdCell = sheet.getRange(rowIndex, 1);
    cmdCell.setFontWeight('bold');
    cmdCell.setFontColor('#8B6914');

    // Colonne Statut — couleur orange pour "En attente"
    var statusCell = sheet.getRange(rowIndex, 11);
    statusCell.setFontColor('#E67E22');
    statusCell.setFontWeight('bold');

    // Bordures légères
    range.setBorder(false, false, true, false, false, false, '#EEEEEE', SpreadsheetApp.BorderStyle.SOLID);

  } catch (err) {
    // Ignorer les erreurs de mise en forme — non bloquant
    Logger.log('Mise en forme ignorée : ' + err);
  }
}

/* ==============================================================
   buildResponse — Construire une réponse JSON avec headers CORS
   ============================================================== */
function buildResponse(data) {
  var jsonString = JSON.stringify(data);

  return ContentService
    .createTextOutput(jsonString)
    .setMimeType(ContentService.MimeType.JSON);
  // Note : Google Apps Script gère automatiquement les headers CORS
  // pour les Web Apps déployées en accès "Tout le monde".
  // Si des erreurs CORS surviennent depuis Hugging Face, vérifier
  // que le déploiement est bien en accès "Tout le monde (anonyme)".
}

/* ==============================================================
   testScript — Fonction de test locale (exécutable dans l'éditeur)
   Pour tester : Exécution → Exécuter la fonction → testScript
   ============================================================== */
function testScript() {
  var sheet = getOrCreateSheet();
  ensureHeaders(sheet);

  var testOrderId = generateOrderId(sheet);
  var now = new Date();
  var dateStr = Utilities.formatDate(now, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');

  var testRow = [
    testOrderId,
    dateStr,
    'Fatima',
    'Benchrif',
    '0612345678',
    'Marrakech',
    '15 Rue de la Médina, Guéliz',
    'Pack Découverte',
    '229',
    'Test automatique',
    'En attente',
    '',
    'Non'
  ];

  sheet.appendRow(testRow);
  formatNewRow(sheet, sheet.getLastRow(), testOrderId);

  Logger.log('Commande test créée : ' + testOrderId);
  Logger.log('Feuille : ' + sheet.getName());
  Logger.log('Lignes totales : ' + sheet.getLastRow());
}
