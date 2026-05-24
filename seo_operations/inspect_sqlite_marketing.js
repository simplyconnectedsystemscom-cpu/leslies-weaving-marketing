const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'seo_state.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.all("PRAGMA table_info(page_indexing);", [], (err, columns) => {
    if (err) console.error(err);
    else {
      console.log("Columns of local sqlite page_indexing:");
      columns.forEach(c => console.log(c));
    }
  });

  db.all("SELECT * FROM page_indexing WHERE url NOT LIKE '%/locations/%' AND url NOT LIKE '%/fabric/%';", [], (err, rows) => {
    if (err) console.error(err);
    else {
      console.log("\nStatic/Other URLs in local sqlite page_indexing:");
      rows.forEach(r => console.log(r));
    }
  });


  db.all("SELECT DISTINCT status, COUNT(*) as count FROM page_indexing GROUP BY status;", [], (err, counts) => {
    if (err) console.error(err);
    else {
      console.log("\nCounts by status:");
      counts.forEach(c => console.log(c));
    }
  });

  db.all("SELECT DISTINCT substr(url, 1, instr(substr(url, 9), '/') + 8) as host, COUNT(*) as count FROM page_indexing GROUP BY host;", [], (err, hosts) => {
    if (err) console.error(err);
    else {
      console.log("\nHosts/prefixes:");
      hosts.forEach(h => console.log(h));
    }
  });
});

setTimeout(() => db.close(), 1000);
