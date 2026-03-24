/**
 * Skrypt do eksportu danych z Firebase Firestore do pliku JSON/CSV
 * 
 * Wymagania:
 * 1. Zainstaluj Firebase Admin SDK: npm install firebase-admin
 * 2. Pobierz klucz serwisowy z Firebase Console:
 *    - Project Settings → Service Accounts → Generate New Private Key
 * 3. Zapisz klucz jako serviceAccountKey.json w katalogu scripts/
 * 4. Uruchom: node scripts/exportFirebaseData.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Inicjalizacja Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function exportData() {
  try {
    console.log('Pobieranie danych z Firestore...');
    
    const snapshot = await db.collection('survey_responses').get();
    
    if (snapshot.empty) {
      console.log('Brak danych do eksportu.');
      return;
    }
    
    const data = [];
    snapshot.forEach(doc => {
      data.push({
        id: doc.id,
        ...doc.data(),
        // Konwertuj timestamp do ISO string
        timestamp: doc.data().timestamp?.toDate().toISOString()
      });
    });
    
    console.log(`Znaleziono ${data.length} dokumentów.`);
    
    // Eksport do JSON
    const jsonPath = path.join(__dirname, 'survey_data.json');
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
    console.log(`✓ Dane wyeksportowane do: ${jsonPath}`);
    
    // Eksport do CSV
    const csvPath = path.join(__dirname, 'survey_data.csv');
    const csv = convertToCSV(data);
    fs.writeFileSync(csvPath, csv);
    console.log(`✓ Dane wyeksportowane do: ${csvPath}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Błąd podczas eksportu:', error);
    process.exit(1);
  }
}

function convertToCSV(data) {
  if (data.length === 0) return '';
  
  // Pobierz wszystkie klucze z pierwszego obiektu
  const headers = Object.keys(data[0]);
  
  // Utwórz nagłówki CSV
  const csvHeaders = headers.join(',');
  
  // Utwórz wiersze CSV
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      // Escape wartości zawierające przecinki lub cudzysłowy
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value ?? '';
    }).join(',');
  });
  
  return [csvHeaders, ...csvRows].join('\n');
}

// Uruchom eksport
exportData();

