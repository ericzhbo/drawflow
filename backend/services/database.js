const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

class DatabaseService {
  constructor(dbPath) {
    this.dbPath = dbPath;
    this.db = null;
    this.initDb();
  }

  async initDb() {
    const dbDir = path.dirname(this.dbPath);
    fs.mkdirSync(dbDir, { recursive: true });

    const SQL = await initSqlJs();

    if (fs.existsSync(this.dbPath)) {
      const fileBuffer = fs.readFileSync(this.dbPath);
      this.db = new SQL.Database(fileBuffer);
    } else {
      this.db = new SQL.Database();
    }

    this.db.run(`
      CREATE TABLE IF NOT EXISTS generations (
        id TEXT PRIMARY KEY,
        task_id TEXT,
        prompt TEXT,
        ratio TEXT,
        image_count INTEGER,
        reference_images TEXT,
        generated_images TEXT,
        status TEXT DEFAULT 'pending',
        error_message TEXT,
        created_at TEXT,
        updated_at TEXT
      )
    `);

    this.save();
  }

  save() {
    const data = this.db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(this.dbPath, buffer);
  }

  saveGeneration(data) {
    this.db.run(`
      INSERT INTO generations (id, task_id, prompt, ratio, image_count, reference_images, generated_images, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      data.id,
      data.task_id,
      data.prompt,
      data.ratio,
      data.image_count,
      JSON.stringify(data.reference_images || []),
      JSON.stringify(data.generated_images || []),
      data.status || 'pending',
      data.created_at || new Date().toISOString(),
      data.updated_at || new Date().toISOString()
    ]);
    this.save();
  }

  getGenerations(limit = 20, offset = 0) {
    const stmt = this.db.prepare('SELECT * FROM generations ORDER BY created_at DESC LIMIT ? OFFSET ?');
    stmt.bind([limit, offset]);
    const rows = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      rows.push({
        ...row,
        reference_images: JSON.parse(row.reference_images || '[]'),
        generated_images: JSON.parse(row.generated_images || '[]')
      });
    }
    stmt.free();
    return rows;
  }

  getGenerationById(id) {
    const stmt = this.db.prepare('SELECT * FROM generations WHERE id = ?');
    stmt.bind([id]);
    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return {
        ...row,
        reference_images: JSON.parse(row.reference_images || '[]'),
        generated_images: JSON.parse(row.generated_images || '[]')
      };
    }
    stmt.free();
    return null;
  }

  updateGenerationStatus(id, status, data = {}) {
    const updates = ['status = ?', 'updated_at = ?'];
    const values = [status, new Date().toISOString()];

    if (data.task_id) {
      updates.push('task_id = ?');
      values.push(data.task_id);
    }
    if (data.generated_images) {
      updates.push('generated_images = ?');
      values.push(JSON.stringify(data.generated_images));
    }
    if (data.error_message) {
      updates.push('error_message = ?');
      values.push(data.error_message);
    }

    values.push(id);
    this.db.run(`UPDATE generations SET ${updates.join(', ')} WHERE id = ?`, values);
    this.save();
  }
}

module.exports = DatabaseService;
