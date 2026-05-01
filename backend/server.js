const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const config = require('./config');
const DatabaseService = require('./services/database');
const TaskService = require('./services/task');
const { router: apiRouter, initServices: initApiServices } = require('./routes/api');
const uploadRouter = require('./routes/upload');

const app = express();
const PORT = config.PORT;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/output', express.static(config.OUTPUT_DIR));

const srcDir = path.join(config.BASE_DIR, '..', 'src');
if (fs.existsSync(srcDir)) {
  app.use(express.static(srcDir));
}

async function startServer() {
  const databaseService = new DatabaseService(config.DATABASE_PATH);
  await databaseService.initDb();
  
  const taskService = new TaskService(databaseService);
  initApiServices(databaseService, taskService);

  app.use('/api', apiRouter);
  app.use('/api', uploadRouter);

  app.get('/', (req, res) => {
    const indexPath = path.join(srcDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.json({
        name: 'DrawFlow V4',
        version: '4.0.0',
        status: 'running',
        port: PORT
      });
    }
  });

  app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({ success: false, error: '内部服务器错误' });
  });

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('============================================================');
    console.log('🎨 DrawFlow V4 - Node.js Backend');
    console.log('============================================================');
    console.log(`📁 项目目录：${config.BASE_DIR}`);
    console.log(`🌐 访问地址：http://localhost:${PORT}`);
    console.log(`🗄️  数据库：${config.DATABASE_PATH}`);
    console.log(`📂 输出目录：${config.OUTPUT_DIR}`);
    console.log('============================================================');
  });

  return { app, server };
}

module.exports = { startServer };
