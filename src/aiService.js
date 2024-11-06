import { ZhipuAI } from './zhipuClient.js';
import { CONFIG } from './config.js';

export class AIService {
  constructor() {
    this.zhipuClient = new ZhipuAI(CONFIG.ZHIPU_API_KEY);
  }

  async analyzeImage(imagePath) {
    try {
      const response = await this.zhipuClient.chat.completions.create({
        model: "glm-4v-plus",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: imagePath
                }
              },
              {
                type: "text",
                text: "Describe this image in detail and provide keywords that capture its essence"
              }
            ]
          }
        ]
      });

      return response.choices[0].message;
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw error;
    }
  }

  async generateVideo(prompt) {
    // Implementation for video generation based on prompt
    // This would connect to your preferred video generation API
    throw new Error('Video generation not implemented');
  }
}