const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'drivers-app.db');
const db = new Database(dbPath);

console.log('Initializing database at:', dbPath);

const schema = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('driver', 'admin')) NOT NULL,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS inspections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    tires_ok BOOLEAN,
    lights_ok BOOLEAN,
    brakes_ok BOOLEAN,
    fluids_ok BOOLEAN,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS fuel_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    liters REAL NOT NULL,
    cost REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS mileage_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    start_km INTEGER NOT NULL,
    end_km INTEGER NOT NULL,
    total_km INTEGER GENERATED ALWAYS AS (end_km - start_km) VIRTUAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`;

db.exec(schema);

// Seed basic users if not exist
const adminExists = db.prepare("SELECT * FROM users WHERE role = 'admin'").get();

if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.prepare("INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)").run('admin', hashedPassword, 'admin', 'System Admin');
    console.log('Created default admin user (admin/admin123)');
}

const driverExists = db.prepare("SELECT * FROM users WHERE role = 'driver'").get();
if (!driverExists) {
    const hashedPassword = bcrypt.hashSync('driver123', 10);
    db.prepare("INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)").run('driver', hashedPassword, 'driver', 'John Doe');
    console.log('Created default driver user (driver/driver123)');
}

console.log('Database initialized successfully!');
