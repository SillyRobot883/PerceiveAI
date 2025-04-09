/**
 * ASL Avatar Initializer
 * Ensures proper initialization and integration with the system
 */
(function() {
    console.log("ASL Avatar Initializer - Loading");
    
    // Initialize on page load events
    document.addEventListener('DOMContentLoaded', initSystem);
    window.addEventListener('load', initSystem);
    
    // Also try immediately
    setTimeout(initSystem, 100);
    
    // Tracking variables
    let initialized = false;
    let checkAttempts = 0;
    
    function initSystem() {
        if (initialized) return;
        
        // Check if core display function exists
        if (typeof initializeAvatarDisplay !== 'function') {
            // Retry with exponential backoff up to 5 attempts
            checkAttempts++;
            if (checkAttempts <= 5) {
                console.log(`Avatar display function not found, retrying in ${checkAttempts * 500}ms...`);
                setTimeout(initSystem, checkAttempts * 500);
            } else {
                console.error("Could not find avatar display function after multiple attempts");
            }
            return;
        }
        
        // Found the function, initialize
        initialized = true;
        
        console.log("Initializing ASL Avatar System");
        
        // Initialize display
        initializeAvatarDisplay();
        
        // Connect to video player if available
        connectToVideoPlayer();
        
        // Connect to speech recognition
        connectToSpeechRecognition();
        
        // Create custom events for external integration
        createCustomEvents();
    }
    
    function connectToVideoPlayer() {
        // Find video elements
        const videoElements = document.querySelectorAll('video');
        if (videoElements.length === 0) return;
        
        console.log(`Found ${videoElements.length} video elements`);
        
        // For each video element
        videoElements.forEach((video, index) => {
            // Only if not already connected
            if (video.dataset.aslConnected === 'true') return;
            
            console.log(`Connecting to video element ${index}`);
            
            // Create caption display if it doesn't exist
            let captionDisplay = document.querySelector(`#caption-display-${index}`);
            if (!captionDisplay) {
                captionDisplay = document.createElement('div');
                captionDisplay.id = `caption-display-${index}`;
                captionDisplay.style.cssText = `
                    position: absolute;
                    bottom: 10px;
                    left: 0;
                    right: 0;
                    text-align: center;
                    color: white;
                    text-shadow: 1px 1px 2px black;
                    padding: 5px;
                    font-size: 16px;
                    z-index: 5;
                    pointer-events: none;
                `;
                
                // Insert after video
                video.parentNode.insertBefore(captionDisplay, video.nextSibling);
            }
            
            // Connect to track change events
            video.addEventListener('loadedmetadata', function() {
                if (video.textTracks) {
                    for (let i = 0; i < video.textTracks.length; i++) {
                        const track = video.textTracks[i];
                        track.mode = 'showing';
                        
                        track.addEventListener('cuechange', function() {
                            const cues = this.activeCues;
                            if (cues.length > 0) {
                                const cueText = cues[0].text;
                                captionDisplay.textContent = cueText;
                                
                                // Process for signing
                                if (typeof processTextForSigning === 'function') {
                                    processTextForSigning(cueText);
                                }
                            }
                        });
                    }
                }
            });
            
            // Mark as connected
            video.dataset.aslConnected = 'true';
        });
    }
    
    function connectToSpeechRecognition() {
        // Check for existing speech recognition
        if (window.speechRecognition || window.webkitSpeechRecognition) {
            console.log("Connecting to speech recognition");
            
            // Hook into result handler if it exists
            if (window.onSpeechResult) {
                const originalHandler = window.onSpeechResult;
                window.onSpeechResult = function(text) {
                    // Call original handler
                    originalHandler(text);
                    
                    // Also process for signing
                    if (typeof processTextForSigning === 'function') {
                        processTextForSigning(text);
                    }
                };
            }
            
            // Listen for speech results
            document.addEventListener('speech-result', function(e) {
                if (e.detail && e.detail.text) {
                    if (typeof processTextForSigning === 'function') {
                        processTextForSigning(e.detail.text);
                    }
                }
            });
        }
    }
    
    function createCustomEvents() {
        // Create custom event for direct sign requests
        window.requestSign = function(word) {
            if (window.avatarAPI && window.avatarAPI.signWord) {
                window.avatarAPI.signWord(word);
            } else if (typeof signWord === 'function') {
                signWord(word);
            }
        };
        
        // Create custom event for processing text
        window.processForSigning = function(text) {
            if (window.avatarAPI && window.avatarAPI.processText) {
                window.avatarAPI.processText(text);
            } else if (typeof processTextForSigning === 'function') {
                processTextForSigning(text);
            }
        };
    }
})();

function initializeAvatarDisplay() {
    console.log("Initializing avatar system...");
    
    // Force CSS to be applied right away
    injectEmergencyStyles();
    
    // Force video transcription bar to be visible
    createVideoTranscriptionBar();
    
    // Force avatar container to be visible
    createAvatarContainer();
    
    // Make sure toggle button exists
    ensureToggleButtonExists();
    
    console.log("Avatar initialization complete");
    
    // Sign a test word after a delay
    setTimeout(function() {
        signTestWord();
    }, 2000);
}

function injectEmergencyStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Force critical elements to be visible */
        #asl-avatar-container {
            display: block !important;
            visibility: visible !important;
            z-index: 10000 !important;
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            width: 250px !important;
            height: 280px !important;
            background: rgba(15, 17, 33, 0.8) !important;
            border: 2px solid rgba(140, 82, 255, 0.8) !important;
            border-radius: 12px !important;
            overflow: hidden !important;
        }
        
        #asl-avatar-frame {
            width: 100% !important;
            height: 100% !important;
            border: none !important;
            background: transparent !important;
        }
        
        #avatar-translation-box {
            position: absolute !important;
            bottom: 10px !important;
            left: 10px !important;
            right: 10px !important;
            padding: 8px 12px !important;
            background: rgba(0, 0, 0, 0.7) !important;
            color: white !important;
            border-radius: 8px !important;
            text-align: center !important;
            z-index: 100 !important;
        }
        
        #toggle-sign-language {
            display: block !important;
            position: fixed !important;
            bottom: 310px !important;
            right: 20px !important;
            z-index: 10001 !important;
            padding: 10px 20px !important;
            background: linear-gradient(45deg, #8c52ff, #5282ff) !important;
            color: white !important;
            border-radius: 30px !important;
            font-weight: bold !important;
            box-shadow: 0 4px 15px rgba(140, 82, 255, 0.4) !important;
        }
    `;
    document.head.appendChild(style);
}

function createVideoTranscriptionBar() {
    // Check if bar already exists
    if (document.getElementById('video-transcription-bar-container')) {
        return;
    }
    
    const videoContainer = document.getElementById('video-container');
    if (!videoContainer) {
        console.warn("Video container not found");
        return;
    }
    
    const barContainer = document.createElement('div');
    barContainer.id = 'video-transcription-bar-container';
    barContainer.style.cssText = `
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 70%;
        z-index: 900;
    `;
    
    const bar = document.createElement('div');
    bar.id = 'main-transcription-display';
    bar.style.cssText = `
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 12px 16px;
        border-radius: 10px;
        text-align: center;
        direction: rtl;
        font-size: 16px;
    `;
    
    bar.textContent = 'انقر على زر التحميل لبدء استخراج النص';
    
    barContainer.appendChild(bar);
    videoContainer.appendChild(barContainer);
}

function createAvatarContainer() {
    // Check if container already exists
    if (document.getElementById('asl-avatar-container')) {
        const container = document.getElementById('asl-avatar-container');
        container.style.display = 'block';
        return;
    }
    
    const videoContainer = document.getElementById('video-container') || document.body;
    
    const container = document.createElement('div');
    container.id = 'asl-avatar-container';
    
    container.innerHTML = `
        <iframe id="asl-avatar-frame" src="ASL/algerianSignLanguage-avatar/web-simulator/index.html?t=${Date.now()}" frameborder="0"></iframe>
        <div id="avatar-translation-box" style="opacity: 0;">مرحبا</div>
        <div id="avatar-status" style="position: absolute; top: 8px; right: 8px; width: 12px; height: 12px; border-radius: 50%; background: orange;"></div>
    `;
    
    videoContainer.appendChild(container);
}

function ensureToggleButtonExists() {
    // Check if button already exists
    let toggleButton = document.getElementById('toggle-sign-language');
    
    if (!toggleButton) {
        // Create new button
        toggleButton = document.createElement('button');
        toggleButton.id = 'toggle-sign-language';
        toggleButton.textContent = 'إخفاء لغة الإشارة';
        
        document.body.appendChild(toggleButton);
        
        // Add click handler
        toggleButton.addEventListener('click', function() {
            const container = document.getElementById('asl-avatar-container');
            if (!container) return;
            
            if (container.style.display === 'none') {
                container.style.display = 'block';
                toggleButton.textContent = 'إخفاء لغة الإشارة';
            } else {
                container.style.display = 'none';
                toggleButton.textContent = 'إظهار لغة الإشارة';
            }
        });
    }
}

function signTestWord() {
    // Message the iframe to sign a test word
    const frame = document.getElementById('asl-avatar-frame');
    if (frame && frame.contentWindow) {
        frame.contentWindow.postMessage({
            action: 'sign',
            text: 'مرحبا'
        }, '*');
        
        // Also update the translation box
        const box = document.getElementById('avatar-translation-box');
        if (box) {
            box.textContent = 'مرحبا';
            box.style.opacity = '1';
            
            setTimeout(() => {
                box.style.opacity = '0';
            }, 3000);
        }
    }
}