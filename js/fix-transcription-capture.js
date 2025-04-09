/**
 * Fix: Direct Transcription Capture
 * Directly captures transcription text and puts it in the avatar query
 */
(function() {
    console.log("🎯 Direct Transcription Capture Fix Loading");
    
    // Run immediately and periodically
    captureTranscription();
    setInterval(captureTranscription, 1000);
    
    // Last captured text to avoid duplicates
    let lastText = "";
    
    function captureTranscription() {
        // Try multiple transcription elements in order of priority
        const elements = [
            document.getElementById('transcription-bar'),
            document.getElementById('main-transcription-display'),
            document.getElementById('transcription-content'),
            document.querySelector('.transcription-text'),
            document.querySelector('[data-transcription]')
        ];
        
        // Find first element with text content
        let transcriptionElement = null;
        let text = "";
        
        for (let element of elements) {
            if (element && element.textContent.trim() && 
                element.textContent.trim() !== "انقر على زر الميكروفون لبدء الاستماع") {
                transcriptionElement = element;
                text = element.textContent.trim();
                break;
            }
        }
        
        // If we found text and it's different from last time
        if (text && text !== lastText) {
            console.log("🎯 New transcription found:", text);
            lastText = text;
            
            // Try to directly set the avatar input
            const frame = document.getElementById('asl-avatar-frame');
            if (frame) {
                try {
                    // Try direct access first
                    const glossInput = frame.contentWindow.document.getElementById('glossInput');
                    if (glossInput) {
                        glossInput.value = text;
                        console.log("🎯 Set glossInput directly");
                        
                        // Try to click the sign button
                        const button = frame.contentWindow.document.querySelector('button[onclick="playGloss()"]');
                        if (button) {
                            button.click();
                            console.log("🎯 Clicked sign button");
                        } else if (typeof frame.contentWindow.playGloss === 'function') {
                            frame.contentWindow.playGloss();
                            console.log("🎯 Called playGloss function");
                        }
                    }
                } catch(e) {
                    console.log("🎯 Direct access failed, trying postMessage");
                    
                    // Fall back to postMessage
                    frame.contentWindow.postMessage({
                        action: 'sign',
                        text: text
                    }, '*');
                }
            } else {
                console.log("🎯 Avatar frame not found");
            }
        }
    }
})();