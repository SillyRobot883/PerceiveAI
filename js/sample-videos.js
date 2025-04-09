/**
 * PerceiveAI Sample Video Handler
 * 
 * This script handles the sample video links functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers for sample videos
    const sampleVideoLinks = document.querySelectorAll('.sample-video');
    const youtubeUrlInput = document.getElementById('youtube-url');
    const loadVideoBtn = document.getElementById('load-video');
    
    console.log("Sample videos script loaded, found", sampleVideoLinks.length, "links");
    
    sampleVideoLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Sample video clicked");
            
            const videoUrl = this.getAttribute('data-video');
            console.log("Video URL:", videoUrl);
            
            if (videoUrl && youtubeUrlInput) {
                youtubeUrlInput.value = videoUrl;
                console.log("Set input value to:", videoUrl);
                
                // Trigger video loading
                if (loadVideoBtn) {
                    console.log("Clicking load button");
                    loadVideoBtn.click();
                } else {
                    console.error("Load video button not found");
                }
            }
        });
    });
});