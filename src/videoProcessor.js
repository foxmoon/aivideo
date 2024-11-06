import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs/promises';
import path from 'path';
import { CONFIG } from './config.js';

export class VideoProcessor {
  constructor() {
    this.outputDir = CONFIG.OUTPUT_DIR;
    this.tempDir = CONFIG.TEMP_DIR;
  }

  async init() {
    await fs.mkdir(this.outputDir, { recursive: true });
    await fs.mkdir(this.tempDir, { recursive: true });
  }

  async extractFrames(videoPath, interval = CONFIG.FRAME_INTERVAL) {
    const framesDir = path.join(this.tempDir, 'frames');
    await fs.mkdir(framesDir, { recursive: true });

    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .screenshots({
          count: 6,
          filename: 'frame-%i.jpg',
          folder: framesDir,
          size: '1280x720'
        })
        .on('end', () => resolve(framesDir))
        .on('error', reject);
    });
  }

  async extractAudio(videoPath) {
    const audioPath = path.join(this.tempDir, 'background.mp3');
    
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .toFormat('mp3')
        .save(audioPath)
        .on('end', () => resolve(audioPath))
        .on('error', reject);
    });
  }

  async concatenateVideos(videoPaths, audioPath) {
    const outputPath = path.join(this.outputDir, 'final_video.mp4');
    
    return new Promise((resolve, reject) => {
      const command = ffmpeg();
      
      // Add each video clip
      videoPaths.forEach(videoPath => {
        command.input(videoPath);
      });

      // Add background audio
      command.input(audioPath);

      command
        .complexFilter([
          {
            filter: 'concat',
            options: { n: videoPaths.length, v: 1, a: 0 },
            outputs: 'v'
          },
          {
            filter: 'amix',
            options: { inputs: 1 },
            outputs: 'a'
          }
        ])
        .map('[v][a]')
        .save(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', reject);
    });
  }
}