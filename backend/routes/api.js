const express = require('express');
const router = express.Router();

let databaseService = null;
let taskService = null;

function initServices(db, task) {
  databaseService = db;
  taskService = task;
}

router.get('/generations', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const generations = databaseService.getGenerations(limit, offset);
    res.json({ success: true, generations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/generate', async (req, res) => {
  try {
    const { prompt, ratio, imageCount, imageUrls, width, height, scale } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, error: '提示词不能为空' });
    }

    const result = await taskService.createGenerateTask(prompt, imageUrls || [], {
      ratio,
      imageCount: imageCount || 1,
      width,
      height,
      scale
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/task/:id/status', (req, res) => {
  try {
    const result = taskService.getTaskStatus(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = { router, initServices };
