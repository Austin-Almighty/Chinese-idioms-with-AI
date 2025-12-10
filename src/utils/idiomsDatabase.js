// Utility to parse and search idioms from CSV
import idiomsCSV from '../data/idioms_filtered.csv?raw';

let idiomsData = null;

/**
 * Robust CSV parser that handles quoted fields with newlines and commas
 * @param {string} csvText - Raw CSV text
 * @returns {Array<Array<string>>} Parsed rows
 */
function parseCSV(csvText) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let insideQuotes = false;
  
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];
    
    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Escaped quote ("")
        currentField += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // Field separator
      currentRow.push(currentField.trim());
      currentField = '';
    } else if (char === '\n' && !insideQuotes) {
      // Row separator
      if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        if (currentRow.some(field => field.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      }
    } else if (char === '\r') {
      // Skip carriage returns
      continue;
    } else {
      currentField += char;
    }
  }
  
  // Push last field and row
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(field => field.length > 0)) {
      rows.push(currentRow);
    }
  }
  
  return rows;
}

/**
 * Parse the idioms CSV file
 * @returns {Map<string, object>} Map of idiom name to idiom data
 */
export function getIdiomsDatabase() {
  if (idiomsData) return idiomsData;

  console.log('[IdiomsDB] Parsing CSV...');
  
  const rows = parseCSV(idiomsCSV);
  console.log(`[IdiomsDB] Total rows parsed: ${rows.length}`);
  
  idiomsData = new Map();
  
  // Skip header row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    
    if (row.length >= 5) {
      const idiom = row[1].trim();
      
      if (idiom) {
        idiomsData.set(idiom, {
          id: row[0],
          idiom: idiom,
          definition: row[2], // 釋義
          usage: row[3], // 用法說明-語義說明
          simple: row[4] // 三歲版解釋
        });
      }
    }
  }
  
  console.log(`[IdiomsDB] Parsed ${idiomsData.size} idioms`);
  console.log('[IdiomsDB] First 5 idioms:', Array.from(idiomsData.keys()).slice(0, 5));
  
  return idiomsData;
}

/**
 * Get idiom data by name
 * @param {string} idiomName - Name of the idiom
 * @returns {object|null} Idiom data or null if not found
 */
export function getIdiomData(idiomName) {
  const db = getIdiomsDatabase();
  const result = db.get(idiomName);
  console.log(`[IdiomsDB] Lookup "${idiomName}":`, result ? 'Found' : 'Not found');
  if (!result) {
    console.log('[IdiomsDB] Available idioms sample:', Array.from(db.keys()).slice(0, 10));
  }
  return result || null;
}
