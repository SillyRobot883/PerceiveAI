/**
 * Enhanced avatar display with real-time translation bar and sign button
 */
(function() {
    console.log("Avatar real-time fix loading...");
    
    // Execute immediately and on DOM/window events to ensure it works
    initializeRealTimeAvatar();
    document.addEventListener('DOMContentLoaded', initializeRealTimeAvatar);
    window.addEventListener('load', initializeRealTimeAvatar);
    
    // Track initialization to prevent duplicates
    let avatarInitialized = false;
    let lastSignedWord = '';
    let signQueue = [];
    let isProcessingQueue = false;
    let signInterval;
    
    function initializeRealTimeAvatar() {
        if (avatarInitialized) return;
        avatarInitialized = true;
        
        console.log("Initializing real-time avatar system...");
        
        // Create all necessary elements
        createTranslationBar();
        createSignButton();
        fixAvatarDisplay();
        
        // Set up event listeners
        setupTranscriptionListener();
        setupSignButtonListener();
        
        // Start periodic signing check
        startSignIntervalCheck();
        
        // Test with welcome message after a short delay
        setTimeout(function() {
            signWord("مرحبا بكم");
            updateTranslationBar("مرحبا بكم", "welcome");
        }, 1500);
        
        console.log("Real-time avatar system initialized");
    }
    
    function createTranslationBar() {
        // Remove any existing translation bar
        const existingBar = document.getElementById('realtime-translation-bar');
        if (existingBar) {
            existingBar.remove();
        }
        
        // Find video container
        const videoContainer = document.getElementById('video-container');
        if (!videoContainer) {
            console.warn("Video container not found. Adding translation bar to body instead.");
            document.body.appendChild(createTranslationBarElement());
            return;
        }
        
        // Add translation bar to video container
        videoContainer.appendChild(createTranslationBarElement());
    }
    
    function createTranslationBarElement() {
        const translationBar = document.createElement('div');
        translationBar.id = 'realtime-translation-bar';
        translationBar.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            max-width: 800px;
            z-index: 950;
            background: rgba(0, 0, 0, 0.75);
            color: white;
            padding: 12px 16px;
            border-radius: 10px;
            text-align: center;
            direction: rtl;
            font-size: 16px;
            backdrop-filter: blur(5px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(140, 82, 255, 0.4);
            transition: all 0.3s ease;
            opacity: 0;
        `;
        
        // Add content
        const textSpan = document.createElement('span');
        textSpan.id = 'realtime-translation-text';
        textSpan.textContent = 'في انتظار النص...';
        
        translationBar.appendChild(textSpan);
        return translationBar;
    }
    
    function createSignButton() {
        // Remove any existing sign button
        const existingButton = document.getElementById('manual-sign-button');
        if (existingButton) {
            existingButton.remove();
        }
        
        // Find video container
        const videoContainer = document.getElementById('video-container');
        if (!videoContainer) {
            console.warn("Video container not found. Adding sign button to body instead.");
            document.body.appendChild(createSignButtonElement());
            return;
        }
        
        // Add sign button to video container
        videoContainer.appendChild(createSignButtonElement());
    }
    
    function createSignButtonElement() {
        const signButton = document.createElement('button');
        signButton.id = 'manual-sign-button';
        signButton.style.cssText = `
            position: absolute;
            bottom: 80px;
            right: 20px;
            background: rgba(140, 82, 255, 0.8);
            color: white;
            border: none;
            border-radius: 50px;
            padding: 10px 20px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            z-index: 960;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        
        // Add icon and text
        signButton.innerHTML = `
            <i class="fas fa-sign-language"></i>
            <span>إشارة</span>
        `;
        
        return signButton;
    }
    
    function fixAvatarDisplay() {
        // Get avatar container
        const avatarContainer = document.getElementById('asl-avatar-container');
        
        if (!avatarContainer) {
            console.warn("Avatar container not found. Creating new one.");
            createAvatarContainer();
            return;
        }
        
        // Make sure avatar is properly styled
        avatarContainer.style.cssText = `
            position: absolute;
            bottom: 20px;
            right: 20px;
            width: 30%;
            height: 40%;
            max-width: 320px;
            min-width: 200px;
            box-shadow: 0 0 30px rgba(140, 82, 255, 0.5);
            border: 2px solid rgba(140, 82, 255, 0.8);
            background: rgba(15, 17, 33, 0.75);
            backdrop-filter: blur(8px);
            border-radius: 12px;
            overflow: hidden;
            z-index: 1000;
            display: block;
        `;
        
        // Check for iframe
        let avatarFrame = document.getElementById('asl-avatar-frame');
        if (!avatarFrame) {
            console.log("Creating new avatar frame");
            avatarFrame = document.createElement('iframe');
            avatarFrame.id = 'asl-avatar-frame';
            avatarFrame.style.cssText = `
                width: 100%;
                height: 100%;
                border: none;
                background: transparent;
                display: block;
            `;
            
            // Add cache-busting parameter to iframe URL
            const timestamp = new Date().getTime();
            avatarFrame.src = `ASL/algerianSignLanguage-avatar/web-simulator/index.html?t=${timestamp}`;
            
            avatarContainer.appendChild(avatarFrame);
        }
        
        // Ensure translation box exists
        let translationBox = document.getElementById('avatar-translation-box');
        if (!translationBox) {
            translationBox = document.createElement('div');
            translationBox.id = 'avatar-translation-box';
            translationBox.style.cssText = `
                position: absolute;
                bottom: 10px;
                left: 10px;
                right: 10px;
                padding: 8px 12px;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                border-radius: 8px;
                font-size: 14px;
                text-align: center;
                direction: rtl;
                opacity: 0;
                transition: opacity 0.3s;
                z-index: 10;
            `;
            
            avatarContainer.appendChild(translationBox);
        }
        
        // Add status indicator
        let statusIndicator = document.getElementById('avatar-status');
        if (!statusIndicator) {
            statusIndicator = document.createElement('div');
            statusIndicator.id = 'avatar-status';
            statusIndicator.style.cssText = `
                position: absolute;
                top: 8px;
                right: 8px;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: rgba(255, 165, 0, 0.8);
                box-shadow: 0 0 5px rgba(255, 165, 0, 0.5);
                z-index: 11;
            `;
            
            avatarContainer.appendChild(statusIndicator);
        }
        
        // Make sure toggle button has proper event
        const toggleButton = document.getElementById('toggle-sign-language');
        if (toggleButton) {
            toggleButton.removeEventListener('click', toggleAvatarVisibility);
            toggleButton.addEventListener('click', toggleAvatarVisibility);
        }
        
        console.log("Avatar display fixed");
    }
    
    function createAvatarContainer() {
        // Find video container
        const videoContainer = document.getElementById('video-container') || document.body;
        
        // Create avatar container
        const avatarContainer = document.createElement('div');
        avatarContainer.id = 'asl-avatar-container';
        avatarContainer.style.cssText = `
            position: absolute;
            bottom: 20px;
            right: 20px;
            width: 30%;
            height: 40%;
            max-width: 320px;
            min-width: 200px;
            box-shadow: 0 0 30px rgba(140, 82, 255, 0.5);
            border: 2px solid rgba(140, 82, 255, 0.8);
            background: rgba(15, 17, 33, 0.75);
            backdrop-filter: blur(8px);
            border-radius: 12px;
            overflow: hidden;
            z-index: 1000;
            display: block;
        `;
        
        // Create iframe
        const avatarFrame = document.createElement('iframe');
        avatarFrame.id = 'asl-avatar-frame';
        avatarFrame.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
            background: transparent;
            display: block;
        `;
        
        // Add cache-busting parameter to iframe URL
        const timestamp = new Date().getTime();
        avatarFrame.src = `ASL/algerianSignLanguage-avatar/web-simulator/index.html?t=${timestamp}`;
        
        // Create translation box
        const translationBox = document.createElement('div');
        translationBox.id = 'avatar-translation-box';
        translationBox.style.cssText = `
            position: absolute;
            bottom: 10px;
            left: 10px;
            right: 10px;
            padding: 8px 12px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border-radius: 8px;
            font-size: 14px;
            text-align: center;
            direction: rtl;
            opacity: 0;
            transition: opacity 0.3s;
            z-index: 10;
        `;
        
        // Status indicator
        const statusIndicator = document.createElement('div');
        statusIndicator.id = 'avatar-status';
        statusIndicator.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: rgba(255, 165, 0, 0.8);
            box-shadow: 0 0 5px rgba(255, 165, 0, 0.5);
            z-index: 11;
        `;
        
        // Assemble container
        avatarContainer.appendChild(avatarFrame);
        avatarContainer.appendChild(translationBox);
        avatarContainer.appendChild(statusIndicator);
        
        // Add to video container
        videoContainer.appendChild(avatarContainer);
        
        console.log("Avatar container created");
    }
    
    function setupTranscriptionListener() {
        // Listen for transcription changes from multiple sources
        window.addEventListener('message', function(event) {
            if (!event.data) return;
            
            // Handle message from transcription system
            if (event.data.action === 'transcription' && event.data.text) {
                processTranscription(event.data.text);
            }
            
            // Handle message from avatar iframe
            if (event.data.action === 'wordSigned') {
                handleWordSigned(event.data);
            }
        });
        
        // Hook into existing transcription function if available
        if (window.updateTranscriptionDisplay) {
            const originalUpdateTranscription = window.updateTranscriptionDisplay;
            window.updateTranscriptionDisplay = function(text, isAppend) {
                // Call original function first
                originalUpdateTranscription(text, isAppend);
                
                // Process our real-time handling
                if (text) {
                    processTranscription(text);
                }
            };
        }
    }
    
    function processTranscription(text) {
        if (!text) return;
        
        // Extract last few words for signing
        const words = text.split(/\s+/);
        if (words.length === 0) return;
        
        // Take the last word for signing
        const lastWord = words[words.length - 1];
        
        // Only process if it's a new word
        if (lastWord !== lastSignedWord) {
            // Update translation bar
            updateTranslationBar(text, 'transcription');
            
            // Add to sign queue
            addToSignQueue(lastWord);
        }
    }
    
    function handleWordSigned(data) {
        if (!data.word) return;
        
        // Update last signed word
        lastSignedWord = data.word;
        
        // Update avatar translation box
        updateAvatarTranslationBox(data.word, data.isSimilar);
        
        // Process next word in queue after a short delay
        setTimeout(processSignQueue, 800);
    }
    
    function updateTranslationBar(text, source) {
        const translationBar = document.getElementById('realtime-translation-bar');
        const textSpan = document.getElementById('realtime-translation-text');
        
        if (!translationBar || !textSpan) return;
        
        // Update text
        textSpan.textContent = text;
        
        // Make bar visible
        translationBar.style.opacity = '1';
        
        // Highlight based on source
        if (source === 'manual') {
            translationBar.style.borderColor = 'rgba(82, 140, 255, 0.8)';
            translationBar.style.boxShadow = '0 0 15px rgba(82, 140, 255, 0.3)';
        } else if (source === 'welcome') {
            translationBar.style.borderColor = 'rgba(255, 165, 0, 0.8)';
            translationBar.style.boxShadow = '0 0 15px rgba(255, 165, 0, 0.3)';
        } else {
            translationBar.style.borderColor = 'rgba(140, 82, 255, 0.4)';
            translationBar.style.boxShadow = '0 0 15px rgba(140, 82, 255, 0.3)';
        }
        
        // Auto-hide after several seconds
        clearTimeout(window.translationBarTimeout);
        window.translationBarTimeout = setTimeout(() => {
            if (translationBar) translationBar.style.opacity = '0.3';
        }, 5000);
    }
    
    function updateAvatarTranslationBox(word, isSimilar) {
        const translationBox = document.getElementById('avatar-translation-box');
        if (!translationBox) return;
        
        if (isSimilar) {
            translationBox.innerHTML = `${word} <small style="opacity: 0.7">(تقريباً)</small>`;
        } else {
            translationBox.textContent = word;
        }
        
        translationBox.style.opacity = '1';
        
        // Auto-hide after a few seconds
        clearTimeout(window.avatarTranslationTimeout);
        window.avatarTranslationTimeout = setTimeout(() => {
            if (translationBox) translationBox.style.opacity = '0';
        }, 3000);
    }
    
    function setupSignButtonListener() {
        const signButton = document.getElementById('manual-sign-button');
        if (!signButton) return;
        
        signButton.addEventListener('click', function() {
            // Get current text from transcription
            const transcriptionBar = document.getElementById('main-transcription-display');
            let textToSign = '';
            
            if (transcriptionBar && transcriptionBar.textContent) {
                textToSign = transcriptionBar.textContent;
            } else {
                const fallbackWords = ["مرحبا", "أهلا", "شكراً", "رياضة", "كرة", "هدف"];
                textToSign = fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
            }
            
            // Update translation bar with manual trigger
            updateTranslationBar(textToSign, 'manual');
            
            // Sign immediately
            signWord(textToSign);
            
            // Visual feedback
            signButton.style.transform = 'scale(1.1)';
            signButton.style.backgroundColor = 'rgba(82, 140, 255, 0.8)';
            
            setTimeout(() => {
                signButton.style.transform = '';
                signButton.style.backgroundColor = 'rgba(140, 82, 255, 0.8)';
            }, 300);
        });
    }
    
    function toggleAvatarVisibility() {
        const avatarContainer = document.getElementById('asl-avatar-container');
        if (!avatarContainer) return;
        
        const isVisible = avatarContainer.style.display !== 'none';
        avatarContainer.style.display = isVisible ? 'none' : 'block';
        
        // Update toggle button text
        const toggleButton = document.getElementById('toggle-sign-language');
        if (toggleButton) {
            toggleButton.textContent = isVisible ? 'إظهار لغة الإشارة' : 'إخفاء لغة الإشارة';
        }
    }
    
    function addToSignQueue(word) {
        if (!word || word.length < 1) return;
        
        // Don't add duplicate words in a row
        if (signQueue.length > 0 && signQueue[signQueue.length - 1] === word) {
            return;
        }
        
        signQueue.push(word);
        console.log("Added to sign queue:", word);
        
        // Start processing if not already
        if (!isProcessingQueue) {
            processSignQueue();
        }
    }
    
    function processSignQueue() {
        if (signQueue.length === 0) {
            isProcessingQueue = false;
            return;
        }
        
        isProcessingQueue = true;
        const wordToSign = signQueue.shift();
        
        signWord(wordToSign);
    }
    
    function signWord(word) {
        if (!word) return;
        
        console.log("Signing word:", word);
        lastSignedWord = word;
        
        const frame = document.getElementById('asl-avatar-frame');
        if (frame && frame.contentWindow) {
            frame.contentWindow.postMessage({
                action: 'sign',
                text: word
            }, '*');
        } else {
            console.error("Cannot sign word - avatar frame not found");
            // Try again after avatar is created
            setTimeout(() => {
                const newFrame = document.getElementById('asl-avatar-frame');
                if (newFrame && newFrame.contentWindow) {
                    newFrame.contentWindow.postMessage({
                        action: 'sign',
                        text: word
                    }, '*');
                }
            }, 1000);
        }
    }
    
    function startSignIntervalCheck() {
        // Clear existing interval
        if (signInterval) {
            clearInterval(signInterval);
        }
        
        // Start new interval
        signInterval = setInterval(function() {
            // If no signing has occurred in the last 3 seconds
            const now = Date.now();
            const lastSignTime = localStorage.getItem('lastSignTime') || 0;
            
            if (now - lastSignTime > 3000) {
                // Sign a random word
                signRandomWord();
            }
        }, 3100);
    }
    
    function signRandomWord() {
        // Random Arabic words related to sports
        const randomWords = [
            "مرحبا", "كرة", "هدف", "فريق", "لاعب", "مباراة", 
            "فوز", "تعادل", "خسارة", "ملعب", "جمهور", "حماس"
        ];
        
        const randomWord = randomWords[Math.floor(Math.random() * randomWords.length)];
        
        // Sign the word
        signWord(randomWord);
        
        // Update translation bar with the random word
        updateTranslationBar(randomWord, "system");
        
        // Record last sign time
        localStorage.setItem('lastSignTime', Date.now().toString());
    }
    
    // Monitor messages from the avatar frame
    window.addEventListener('message', function(event) {
        if (!event.data || !event.data.action) return;
        
        console.log("Received message:", event.data);
        
        switch (event.data.action) {
            case "avatarReady":
            case "avatarFixesApplied":
                // Update status indicator to green
                const statusIndicator = document.getElementById('avatar-status');
                if (statusIndicator) {
                    statusIndicator.style.background = 'rgba(0, 255, 0, 0.8)';
                    statusIndicator.style.boxShadow = '0 0 5px rgba(0, 255, 0, 0.5)';
                }
                
                // Test with a welcome message
                setTimeout(() => {
                    signWord("مرحبا");
                }, 500);
                break;
                
            case "wordSigned":
                // Update last sign time
                localStorage.setItem('lastSignTime', Date.now().toString());
                
                // Update status
                handleWordSigned(event.data);
                break;
        }
    });
})();