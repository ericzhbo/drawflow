const jimengService = require('./jimeng');
const config = require('../config');
const path = require('path');
const fs = require('fs');

class TaskService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  async createGenerateTask(prompt, imageUrls = [], options = {}) {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await this.db.saveGeneration({
      id: taskId,
      task_id: null,
      prompt,
      ratio: options.ratio || '1:1',
      image_count: options.imageCount || 1,
      reference_images: imageUrls,
      generated_images: [],
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    this.submitToJimeng(taskId, prompt, imageUrls, options);

    return { success: true, taskId };
  }

  async submitToJimeng(taskId, prompt, imageUrls, options) {
    try {
      this.db.updateGenerationStatus(taskId, 'processing');

      const result = await jimengService.generateImage(prompt, imageUrls, {
        ratio: options.ratio,
        imageCount: options.imageCount,
        scale: options.scale,
        width: options.width,
        height: options.height
      });

      if (result.code === 10000 && result.data) {
        const volcTaskId = result.data.task_id;
        this.db.updateGenerationStatus(taskId, 'processing', { task_id: volcTaskId });
        this.pollTaskStatus(taskId, volcTaskId);
      } else {
        this.db.updateGenerationStatus(taskId, 'failed', {
          error_message: result.message || '提交任务失败'
        });
      }
    } catch (error) {
      this.db.updateGenerationStatus(taskId, 'failed', {
        error_message: error.message || '未知错误'
      });
    }
  }

  async pollTaskStatus(taskId, volcTaskId, maxRetries = 60, interval = 5000) {
    let retries = 0;

    const poll = async () => {
      try {
        const result = await jimengService.getTaskResult(volcTaskId);

        if (result.code === 10000 && result.data) {
          const status = result.data.status;

          if (status === 'done') {
            const images = await this.downloadImages(result.data, taskId);
            this.db.updateGenerationStatus(taskId, 'completed', {
              generated_images: images
            });
            return;
          } else if (status === 'not_started' || status === 'running') {
            if (retries < maxRetries) {
              retries++;
              setTimeout(poll, interval);
            } else {
              this.db.updateGenerationStatus(taskId, 'failed', {
                error_message: '任务超时'
              });
            }
          } else if (status === 'expired' || status === 'cancelled') {
            this.db.updateGenerationStatus(taskId, 'failed', {
              error_message: `任务已${status === 'expired' ? '过期' : '取消'}`
            });
          } else {
            if (retries < maxRetries) {
              retries++;
              setTimeout(poll, interval);
            } else {
              this.db.updateGenerationStatus(taskId, 'failed', {
                error_message: '任务状态异常'
              });
            }
          }
        } else {
          this.db.updateGenerationStatus(taskId, 'failed', {
            error_message: result.message || '获取任务结果失败'
          });
        }
      } catch (error) {
        if (retries < maxRetries) {
          retries++;
          setTimeout(poll, interval);
        } else {
          this.db.updateGenerationStatus(taskId, 'failed', {
            error_message: error.message || '轮询任务失败'
          });
        }
      }
    };

    poll();
  }

  async downloadImages(taskData, taskId) {
    const images = [];
    const outputDir = path.join(config.OUTPUT_DIR, 'generations');
    fs.mkdirSync(outputDir, { recursive: true });

    if (taskData.binary_data_base64 && taskData.binary_data_base64.length > 0) {
      for (let i = 0; i < taskData.binary_data_base64.length; i++) {
        const base64Data = taskData.binary_data_base64[i];
        const filename = `${taskId}_${i}_${Date.now()}.jpg`;
        const filepath = path.join(outputDir, filename);

        const buffer = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(filepath, buffer);

        images.push(`/output/generations/${filename}`);
      }
    }

    return images;
  }

  getTaskStatus(taskId) {
    const generation = this.db.getGenerationById(taskId);
    if (!generation) {
      return { success: false, error: '任务不存在' };
    }

    return {
      success: true,
      taskId: generation.id,
      status: generation.status,
      generated_images: generation.generated_images,
      error_message: generation.error_message
    };
  }
}

module.exports = TaskService;
