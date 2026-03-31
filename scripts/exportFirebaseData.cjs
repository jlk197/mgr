/*
 * npm run export:firebase
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Parsowanie argumentów wiersza poleceń
const args = process.argv.slice(2);
const options = {
  format: 'both', // json, csv, both
  output: __dirname
};

args.forEach(arg => {
  if (arg.startsWith('--format=')) {
    options.format = arg.split('=')[1];
  }
  if (arg.startsWith('--output=')) {
    options.output = arg.split('=')[1];
  }
});

// Inicjalizacja Firebase Admin SDK
let serviceAccount;
try {
  serviceAccount = require('./serviceAccountKey.json');
} catch (error) {
  console.error('❌ Błąd: Nie znaleziono pliku serviceAccountKey.json');
  console.error('📝 Instrukcje:');
  console.error('   1. Otwórz Firebase Console: https://console.firebase.google.com');
  console.error('   2. Wybierz projekt: web-performance-ux');
  console.error('   3. Przejdź do: Project Settings → Service Accounts');
  console.error('   4. Kliknij: "Generate New Private Key"');
  console.error('   5. Zapisz pobrany plik jako: scripts/serviceAccountKey.json');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function exportData() {
  try {
    console.log('📡 Łączenie z Firebase Firestore...');
    console.log(`📁 Project ID: ${serviceAccount.project_id}`);

    const snapshot = await db.collection('survey_responses').get();

    if (snapshot.empty) {
      console.log('⚠️  Brak danych do eksportu w kolekcji "survey_responses".');
      return;
    }

    const data = [];
    snapshot.forEach(doc => {
      const docData = doc.data();
      data.push({
        id: doc.id,
        ...docData,
        // Konwertuj timestamp do ISO string
        timestamp: docData.timestamp?.toDate().toISOString()
      });
    });

    console.log(`✅ Znaleziono ${data.length} dokumentów`);

    // Wyświetl statystyki
    displayStatistics(data);

    // Upewnij się, że katalog wyjściowy istnieje
    if (!fs.existsSync(options.output)) {
      fs.mkdirSync(options.output, { recursive: true });
    }

    // Eksport do JSON
    if (options.format === 'json' || options.format === 'both') {
      const jsonPath = path.join(options.output, 'survey_data.json');
      fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`✅ Dane wyeksportowane do JSON: ${jsonPath}`);
      console.log(`   📊 Rozmiar: ${(fs.statSync(jsonPath).size / 1024).toFixed(2)} KB`);
    }

    // Eksport do CSV
    if (options.format === 'csv' || options.format === 'both') {
      const csvPath = path.join(options.output, 'survey_data.csv');
      const csv = convertToCSV(data);
      fs.writeFileSync(csvPath, csv, 'utf8');
      console.log(`✅ Dane wyeksportowane do CSV: ${csvPath}`);
      console.log(`   📊 Rozmiar: ${(fs.statSync(csvPath).size / 1024).toFixed(2)} KB`);
    }

    console.log('\n🎉 Eksport zakończony pomyślnie!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Błąd podczas eksportu:', error.message);
    if (error.code) {
      console.error(`   Kod błędu: ${error.code}`);
    }
    process.exit(1);
  }
}

function displayStatistics(data) {
  if (data.length === 0) return;

  console.log('\n📊 Statystyki danych:');

  // Zlicz dane demograficzne
  const demographics = {
    age: {},
    gender: {},
    device: {},
    frequency: {}
  };

  data.forEach(doc => {
    ['age', 'gender', 'device', 'frequency'].forEach(field => {
      const value = doc[field] || 'nie podano';
      demographics[field][value] = (demographics[field][value] || 0) + 1;
    });
  });

  console.log(`   👥 Wiek: ${Object.keys(demographics.age).length} kategorii`);
  console.log(`   ⚧️  Płeć: ${Object.keys(demographics.gender).length} kategorii`);
  console.log(`   📱 Urządzenie: ${Object.keys(demographics.device).length} typów`);
  console.log(`   🔄 Częstotliwość: ${Object.keys(demographics.frequency).length} poziomów`);

  // Sprawdź kompletność danych
  const firstDoc = data[0];
  const metricFields = Object.keys(firstDoc).filter(key =>
    key.includes('_speed') || key.includes('_smoothness') || key.includes('_irritation')
  );
  console.log(`   📈 Pola metryk: ${metricFields.length}`);
}

function convertToCSV(data) {
  if (data.length === 0) return '';

  // Pobierz wszystkie klucze ze wszystkich dokumentów (na wypadek różnic w strukturze)
  const allKeys = new Set();
  data.forEach(row => {
    Object.keys(row).forEach(key => allKeys.add(key));
  });

  // Sortuj nagłówki dla lepszej czytelności
  const headers = Array.from(allKeys).sort((a, b) => {
    // Najpierw podstawowe pola
    const priorityFields = ['id', 'timestamp', 'age', 'gender', 'device', 'frequency'];
    const aIndex = priorityFields.indexOf(a);
    const bIndex = priorityFields.indexOf(b);

    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    return a.localeCompare(b);
  });

  // Utwórz nagłówki CSV
  const csvHeaders = headers.join(',');

  // Utwórz wiersze CSV
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];

      // Obsługa różnych typów wartości
      if (value === null || value === undefined) {
        return '';
      }

      // Konwersja do stringa
      const stringValue = String(value);

      // Escape wartości zawierające przecinki, cudzysłowy lub nowe linie
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }

      return stringValue;
    }).join(',');
  });

  return [csvHeaders, ...csvRows].join('\n');
}

// Wyświetl instrukcje użycia
function displayUsage() {
  console.log('\n📖 Użycie:');
  console.log('   node scripts/exportFirebaseData.cjs [opcje]');
  console.log('\n🔧 Opcje:');
  console.log('   --format=json   - eksport tylko do JSON');
  console.log('   --format=csv    - eksport tylko do CSV');
  console.log('   --format=both   - eksport do obu formatów (domyślnie)');
  console.log('   --output=ścieżka - katalog docelowy (domyślnie: scripts/)');
  console.log('\n📝 Przykłady:');
  console.log('   node scripts/exportFirebaseData.cjs');
  console.log('   node scripts/exportFirebaseData.cjs --format=csv');
  console.log('   node scripts/exportFirebaseData.cjs --format=json --output=./exports');
}

// Sprawdź pomoc
if (args.includes('--help') || args.includes('-h')) {
  displayUsage();
  process.exit(0);
}

// Uruchom eksport
console.log('🚀 Firebase Data Export Tool\n');
exportData();

