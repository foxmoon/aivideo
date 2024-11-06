import { VideoProcessor } from './videoProcessor.js';
import { AIService } from './aiService.js';
import path from 'path';
import fs from 'fs/promises';

async function processVideo(inputVideoPath) {
  try {
    // Verify input video exists
    try {
      await fs.access(inputVideoPath);
    } catch (error) {
      throw new Error(`Input video not found: ${inputVideoPath}`);
    }

    const videoProcessor = new VideoProcessor();
    const aiService = new AIService();

    // Initialize directories
    await videoProcessor.init();

    // Step 1: Extract frames and audio
    console.log('Extracting frames...');
    const framesDir = await videoProcessor.extractFrames(inputVideoPath);
    
    console.log('Extracting audio...');
    const audioPath = await videoProcessor.extractAudio(inputVideoPath);

    // Step 2: Analyze frames with AI
    console.log('Analyzing frames with AI...');
    const frameFiles = await fs.readdir(framesDir);
    const frameAnalyses = await Promise.all(
      frameFiles.map(frame => 
        aiService.analyzeImage(path.join(framesDir, frame))
      )
    );

    // Step 3: Generate video segments
    console.log('Generating video segments...');
    const generatedVideos = await Promise.all(
      frameAnalyses.map(analysis => 
        aiService.generateVideo(analysis)
      )
    );

    // Step 4: Concatenate videos with audio
    console.log('Creating final video...');
    const finalVideo = await videoProcessor.concatenateVideos(
      generatedVideos,
      audioPath
    );

    console.log(`Processing complete! Final video saved to: ${finalVideo}`);
    return finalVideo;
  } catch (error) {
    console.error('Error processing video:', error);
    throw error;
  }
}

if (process.argv.length < 3) {
  console.log('Usage: npm run dev <path-to-video-file>');
  console.log('Example: npm run dev ./input/video.mp4');
  process.exit(1);
}

const videoPath = process.argv[2];
processVideo(videoPath).catch(error => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});