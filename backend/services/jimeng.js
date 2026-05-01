const axios = require('axios');
const crypto = require('crypto');
const config = require('../config');

class JimengService {
  constructor() {
    this.ak = config.VOLC_ACCESS_KEY_ID;
    this.sk = config.VOLC_ACCESS_KEY_SECRET;
    this.host = 'visual.volcengineapi.com';
    this.service = 'cv';
    this.region = 'cn-north-1';
  }

  sign(query, body, method = 'POST') {
    const now = new Date();
    const xDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const shortXDate = xDate.substr(0, 8);

    const sortedQuery = Object.keys(query)
      .sort()
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`)
      .join('&');

    const hashedPayload = crypto.createHash('sha256').update(body).digest('hex');

    const canonicalRequest = [
      method.toUpperCase(),
      '/',
      sortedQuery,
      `host:${this.host}\n`,
      'host',
      hashedPayload
    ].join('\n');

    const hashedCanonicalRequest = crypto.createHash('sha256').update(canonicalRequest).digest('hex');

    const credentialScope = `${shortXDate}/${this.region}/${this.service}/request`;
    const stringToSign = [
      'HMAC-SHA256',
      xDate,
      credentialScope,
      hashedCanonicalRequest
    ].join('\n');

    const kDate = crypto.createHmac('sha256', this.sk).update(shortXDate).digest();
    const kRegion = crypto.createHmac('sha256', kDate).update(this.region).digest();
    const kService = crypto.createHmac('sha256', kRegion).update(this.service).digest();
    const kSigning = crypto.createHmac('sha256', kService).update('request').digest();
    const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');

    const authorization = `HMAC-SHA256 Credential=${this.ak}/${credentialScope}, SignedHeaders=host, Signature=${signature}`;

    return { authorization, xDate };
  }

  async submitTask(params) {
    const body = JSON.stringify(params);
    const query = {
      Action: 'CVSync2AsyncSubmitTask',
      Version: '2022-08-31'
    };

    const { authorization, xDate } = this.sign(query, body);

    const response = await axios.post(
      `https://${this.host}/?${new URLSearchParams(query).toString()}`,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Date': xDate,
          'Authorization': authorization,
          'Host': this.host
        }
      }
    );

    return response.data;
  }

  async getTaskResult(taskId) {
    const query = {
      Action: 'CVSync2AsyncGetResult',
      Version: '2022-08-31'
    };
    const body = JSON.stringify({ task_id: taskId });

    const { authorization, xDate } = this.sign(query, body);

    const response = await axios.post(
      `https://${this.host}/?${new URLSearchParams(query).toString()}`,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Date': xDate,
          'Authorization': authorization,
          'Host': this.host
        }
      }
    );

    return response.data;
  }

  async generateImage(prompt, imageUrls = [], options = {}) {
    const {
      ratio = '1:1',
      imageCount = 1,
      scale = 50,
      width,
      height
    } = options;

    const req = {
      req_key: 'high_aes_general_v20_L',
      prompt,
      scale,
      return_url: true,
      generate_num: imageCount
    };

    if (width && height) {
      req.width = width;
      req.height = height;
    }

    if (imageUrls && imageUrls.length > 0) {
      req.image_urls = imageUrls;
      req.scale = options.scale || 30;
    }

    if (ratio) {
      const [w, h] = ratio.split(':').map(Number);
      req.ratio = `${w}/${h}`;
    }

    return await this.submitTask(req);
  }
}

module.exports = new JimengService();
