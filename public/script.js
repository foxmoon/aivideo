document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('uploadForm');
    const fileInput = document.getElementById('videoFile');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const progress = document.getElementById('progress');
    const status = document.getElementById('status');
    const result = document.getElementById('result');
    const outputVideo = document.getElementById('outputVideo');
    const downloadBtn = document.getElementById('downloadBtn');

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            fileName.textContent = file.name;
            fileInfo.classList.remove('hidden');
        } else {
            fileInfo.classList.add('hidden');
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('video', fileInput.files[0]);

        // Show progress
        progress.classList.remove('hidden');
        result.classList.add('hidden');
        
        try {
            const response = await fetch('/process', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Video processing failed');
            }

            const data = await response.json();
            
            // Update video player and download link
            outputVideo.src = data.outputVideo;
            downloadBtn.href = data.outputVideo;
            
            // Show result
            progress.classList.add('hidden');
            result.classList.remove('hidden');
        } catch (error) {
            console.error('Error:', error);
            status.textContent = `Error: ${error.message}`;
        }
    });
});