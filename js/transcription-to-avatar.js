/**
 * Transcription to Avatar Integration
 * Connects the transcription system to the avatar query input
 */
(function() {
    console.log("Transcription to Avatar - Loading");
    
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', initTranscriptionToAvatar);
    window.addEventListener('load', initTranscriptionToAvatar);
    
    // Track initialization
    let initialized = false;
    
    // Current sentence buffer
    let currentSentence = '';
    let sentenceTimer = null;
    let processingTranscription = false;
    
    function initTranscriptionToAvatar() {
        if (initialized) return;
        
        console.log("Initializing Transcription to Avatar Integration");
        
        // Connect to transcription system
        connectToTranscription();
        
        // Add necessary event listeners
        setupEventListeners();
        
        initialized = true;
    }
    
    function connectToTranscription() {
        // Connect to main transcription bar
        const transcriptionBar = document.getElementById('transcription-bar');
        const mainTranscriptionDisplay = document.getElementById('main-transcription-display');
        
        if (transcriptionBar) {
            console.log("Connecting to transcription bar");
            observeElement(transcriptionBar);
        } else {
            console.log("Transcription bar not found, will try again");
            setTimeout(connectToTranscription, 1000);
        }
        
        // Also connect to main transcription display if available
        if (mainTranscriptionDisplay) {
            console.log("Connecting to main transcription display");
            observeElement(mainTranscriptionDisplay);
        }
    }
    
    function observeElement(element) {
        // Create observer to watch for text changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    const text = element.textContent.trim();
                    if (text && text !== "انقر على زر الميكروفون لبدء الاستماع") {
                        processTranscriptionText(text);
                    }
                }
            });
        });
        
        // Start observing
        observer.observe(element, {
            childList: true,
            characterData: true,
            subtree: true
        });
        
        console.log("Observer attached to", element.id);
    }
    
    function processTranscriptionText(text) {
        if (!text || processingTranscription) return;
        
        processingTranscription = true;
        
        console.log("Processing transcription:", text);
        
        // Get the last sentence or phrase (for Arabic, we'll use periods, question marks and exclamation marks)
        const sentences = text.split(/[.!?،؟!]/);
        let lastSentence = sentences[sentences.length - 1].trim();
        
        // If empty, try the previous one
        if (lastSentence === '' && sentences.length > 1) {
            lastSentence = sentences[sentences.length - 2].trim();
        }
        
        // If we have a sentence and it's different from the current one
        if (lastSentence && lastSentence !== currentSentence) {
            currentSentence = lastSentence;
            
            // Clear any pending sentence timer
            if (sentenceTimer) {
                clearTimeout(sentenceTimer);
            }
            
            // Set a timer to allow the sentence to complete before sending to avatar
            // This prevents sending incomplete sentences too quickly
            sentenceTimer = setTimeout(() => {
                sendToAvatar(currentSentence);
            }, 1500); // Wait 1.5s to ensure sentence is complete
        }
        
        processingTranscription = false;
    }
    
    function sendToAvatar(text) {
        console.log("Sending to avatar:", text);
        
        // Method 1: Update iframe glossInput field directly
        updateAvatarInput(text);
        
        // Method 2: Use global API if available
        if (window.avatarAPI && typeof window.avatarAPI.playText === 'function') {
            window.avatarAPI.playText(text);
        }
        
        // Method 3: Trigger global event for other systems
        const event = new CustomEvent('transcription-for-signing', { 
            detail: { text: text } 
        });
        window.dispatchEvent(event);
    }
    
    function updateAvatarInput(text) {
        // Get the iframe
        const frame = document.getElementById('asl-avatar-frame');
        if (!frame) return;
        
        try {
            // Try to access the glossInput element inside the iframe
            const glossInput = frame.contentWindow.document.getElementById('glossInput');
            if (glossInput) {
                // Update input value
                glossInput.value = text;
                
                // Trigger play if possible
                const playFunction = frame.contentWindow.playGloss;
                if (typeof playFunction === 'function') {
                    playFunction();
                }
            } else {
                console.log("Gloss input not found in iframe");
            }
        } catch (e) {
            console.warn("Cannot access iframe content:", e);
            
            // Alternative: Send message to iframe
            frame.contentWindow.postMessage({
                action: 'playGloss',
                text: text
            }, '*');
        }
    }
    
    function setupEventListeners() {
        // Listen for messages from iframe
        window.addEventListener('message', function(event) {
            if (event.data && event.data.action === 'glossComplete') {
                console.log("Avatar completed signing:", event.data.text);
            }
        });
        
        // Also add listener in the iframe
        const frame = document.getElementById('asl-avatar-frame');
        if (frame) {
            try {
                frame.contentWindow.addEventListener('DOMContentLoaded', function() {
                    // Setup message receiver in iframe
                    frame.contentWindow.addEventListener('message', function(event) {
                        if (event.data && event.data.action === 'playGloss' && event.data.text) {
                            const glossInput = frame.contentWindow.document.getElementById('glossInput');
                            if (glossInput) {
                                glossInput.value = event.data.text;
                                if (typeof frame.contentWindow.playGloss === 'function') {
                                    frame.contentWindow.playGloss();
                                }
                            }
                        }
                    });
                });
            } catch (e) {
                console.warn("Could not add listener to iframe:", e);
            }
        }
    }
    
    // Expose API
    window.transcriptionToAvatarAPI = {
        sendTextToAvatar: sendToAvatar,
        processToDSign: processTranscriptionText
    };
})();