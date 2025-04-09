/**
 * Direct Transcription Capture
 * Simple solution to send transcribed text directly to the avatar
 */
(function() {
    console.log("📝 Direct Transcript Capture: Loading");
    
    // Run this immediately
    setTimeout(setupDirectTranscriptionCapture, 500);
    
    // Also run after DOM load to ensure elements exist
    document.addEventListener('DOMContentLoaded', setupDirectTranscriptionCapture);
    window.addEventListener('load', setupDirectTranscriptionCapture);
    
    // Track if we're already set up
    let isSetup = false;
    
    // Track last text to avoid duplicates
    let lastText = '';
    
    function setupDirectTranscriptionCapture() {
        if (isSetup) return;
        
        console.log("📝 Direct Transcript Capture: Setting up");
        
        // Find the transcription bar
        const transcriptionBar = document.getElementById('transcription-bar');
        if (!transcriptionBar) {
            console.log("📝 Transcription bar not found, will try again later");
            setTimeout(setupDirectTranscriptionCapture, 1000);
            return;
        }
        
        // Create a MutationObserver to watch for content changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    const text = transcriptionBar.textContent.trim();
                    
                    // Only process if there's text and it's not the initial placeholder
                    if (text && 
                        text !== "انقر على زر الميكروفون لبدء الاستماع" && 
                        text !== lastText) {
                        
                        lastText = text;
                        console.log("📝 New transcription detected:", text);
                        sendToAvatar(text);
                    }
                }
            });
        });
        
        // Start observing
        observer.observe(transcriptionBar, {
            childList: true,
            characterData: true,
            subtree: true
        });
        
        console.log("📝 Direct Transcript Capture: Setup complete");
        isSetup = true;
    }
    
    function sendToAvatar(text) {
        console.log("📝 Sending to avatar:", text);
        
        // Get the avatar iframe
        const frame = document.getElementById('asl-avatar-frame');
        if (!frame) {
            console.log("📝 Avatar frame not found");
            return;
        }
        
        // Method 1: Direct postMessage
        try {
            frame.contentWindow.postMessage({
                action: 'sign',
                text: text
            }, '*');
            console.log("📝 Sent via postMessage");
        } catch (e) {
            console.log("📝 Error sending postMessage:", e);
        }
        
        // Method 2: Try direct iframe access (backup)
        setTimeout(() => {
            try {
                const glossInput = frame.contentWindow.document.getElementById('glossInput');
                if (glossInput) {
                    glossInput.value = text;
                    
                    // Try to trigger the play function
                    if (typeof frame.contentWindow.playGloss === 'function') {
                        frame.contentWindow.playGloss();
                        console.log("📝 Triggered via direct access");
                    } else {
                        // Try to click the button
                        const button = frame.contentWindow.document.querySelector('button[onclick="playGloss()"]');
                        if (button) {
                            button.click();
                            console.log("📝 Clicked button via direct access");
                        }
                    }
                }
            } catch (e) {
                console.log("📝 Error with direct iframe access:", e);
            }
        }, 100);
    }
})();