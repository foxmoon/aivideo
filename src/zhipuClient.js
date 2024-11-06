import fetch from 'node-fetch';

export class ZhipuAI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://open.bigmodel.cn/api/paas/v4';
    this.chat = {
      completions: {
        create: this.createChatCompletion.bind(this)
      }
    };
  }

  async createChatCompletion(params) {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }
}