const path = require('path');
const fs = require('fs');
require('dotenv').config();

const BASE_DIR = path.dirname(__dirname);

const DATABASE_PATH = process.env.DRAWFLOW_DB_PATH || path.join(BASE_DIR, '..', 'database', 'drawflow.db');
const OUTPUT_DIR = process.env.DRAWFLOW_OUTPUT_DIR || path.join(BASE_DIR, '..', 'output');

if (process.env.DRAWFLOW_OUTPUT_DIR) {
  fs.mkdirSync(process.env.DRAWFLOW_OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(path.join(process.env.DRAWFLOW_OUTPUT_DIR, 'generations'), { recursive: true });
  fs.mkdirSync(path.join(process.env.DRAWFLOW_OUTPUT_DIR, 'references'), { recursive: true });
}

if (process.env.DRAWFLOW_DB_PATH) {
  fs.mkdirSync(path.dirname(process.env.DRAWFLOW_DB_PATH), { recursive: true });
}

module.exports = {
  BASE_DIR,
  DATABASE_PATH,
  OUTPUT_DIR,
  PORT: parseInt(process.env.FLASK_PORT || '5001'),
  VOLC_ACCESS_KEY_ID: process.env.VOLC_ACCESS_KEY_ID || '',
  VOLC_ACCESS_KEY_SECRET: process.env.VOLC_ACCESS_KEY_SECRET || '',
  OSS_ACCESS_KEY_ID: process.env.OSS_ACCESS_KEY_ID || '',
  OSS_ACCESS_KEY_SECRET: process.env.OSS_ACCESS_KEY_SECRET || '',
  OSS_BUCKET: process.env.OSS_BUCKET || 'niba-jimeng',
  OSS_REGION: process.env.OSS_REGION || 'oss-cn-hangzhou',
};
