const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'seo_state.db');

if (fs.existsSync(DB_PATH)) {
    console.log("seo_state.db already exists. Skipping initialization.");
    process.exit(0);
}

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Could not connect to database', err);
        process.exit(1);
    } else {
        console.log('Connected to new SQLite database.');
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS page_indexing (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT UNIQUE NOT NULL,
            ab_group TEXT,
            last_pushed_at DATETIME,
            status TEXT DEFAULT 'pending',
            error_message TEXT,
            clicks INTEGER DEFAULT 0,
            impressions INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating page_indexing table:', err);
        } else {
            console.log('Successfully created page_indexing table.');
        }
    });
});

db.close((err) => {
    if (err) {
        console.error('Error closing database', err);
    } else {
        console.log('Database initialization complete.');
    }
});
