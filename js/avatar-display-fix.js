/**
 * Enhanced ASL Avatar Display Fix
 * Ensures proper integration and visibility of the avatar
 */
(function() {
    console.log("Enhanced Avatar Display Fix - Loading");
    
    // Run immediately
    setTimeout(initializeAvatarDisplay, 0);
    
    // Also run on DOM ready and load
    document.addEventListener('DOMContentLoaded', initializeAvatarDisplay);
    window.addEventListener('load', initializeAvatarDisplay);
    
    // State tracking
    let initialized = false;
    let avatarVisible = false;
    let randomWordInterval = null;
    let lastTranscriptionTime = Date.now();
    let wordDatabase = [];
    
    // Define available characters
    const avatarCharacters = [
        {
            id: 'anna',
            name: 'آنا',
            path: 'anna',
            description: 'الشخصية الافتراضية'
        },
        {
            id: 'marcus',
            name: 'ماركوس',
            path: 'marcus',
            description: 'شخصية ذكورية'
        },
        {
            id: 'luna',
            name: 'لونا',
            path: 'luna',
            description: 'شخصية بأسلوب عصري'
        },
        {
            id: 'ahmed',
            name: 'أحمد',
            path: 'ahmed',
            description: 'شخصية عربية'
        }
    ];
    
    // Default character
    let currentCharacter = avatarCharacters[0];
    
    // Initialize avatar display
    function initializeAvatarDisplay() {
        if (initialized) return;
        initialized = true;
        
        console.log("Initializing Enhanced ASL Avatar Display");
        
        // Add required styles
        addRequiredStyles();
        
        // Create avatar container
        createAvatarContainer();
        
        // Add translation subtitle
        createTranslationSubtitle();
        
        // Set up message listener for iframe
        setupMessageListener();
        
        // Hook into transcription system
        hookIntoTranscriptionSystem();
        
        // Create toggle button if needed
        ensureToggleButtonExists();
        
        // Load word database
        loadWordDatabase();
        
        // Add character selector styles and create character selector
        addCharacterSelectorStyles();
        createCharacterSelector();
        
        console.log("Enhanced ASL Avatar Display Initialized");
    }
    
    function addRequiredStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #asl-avatar-container {
                position: fixed !important;
                bottom: 20px !important;
                right: 20px !important;
                width: 650px !important;
                height: 700px !important;
                background-color: rgba(15, 17, 33, 0.85) !important;
                border-radius: 12px !important;
                border: 2px solid rgba(140, 82, 255, 0.8) !important;
                box-shadow: 0 0 20px rgba(140, 82, 255, 0.4) !important;
                overflow: hidden !important;
                z-index: 9999 !important;
                display: none;
            }
            
            /* Add resize handles for better visibility */
            #asl-avatar-container::after {
                content: '';
                position: absolute;
                bottom: 0;
                right: 0;
                width: 20px;
                height: 20px;
                background: rgba(140, 82, 255, 0.6);
                clip-path: polygon(100% 0, 100% 100%, 0 100%);
                cursor: nwse-resize;
                z-index: 10001;
            }
            
            /* Rest of your styles... */
            #asl-avatar-frame {
                width: 100% !important;
                height: 100% !important;
                border: none !important;
                visibility: visible !important;
                opacity: 1 !important;
            }
            
            /* Add resize indicators to corners */
            .resize-handle {
                position: absolute;
                width: 20px;
                height: 20px;
                background-color: rgba(140, 82, 255, 0.2);
                z-index: 10002;
                transition: background-color 0.2s;
            }
            
            .resize-handle:hover {
                background-color: rgba(140, 82, 255, 0.6);
            }
            
            .resize-handle.top-left {
                top: 0;
                left: 0;
                cursor: nwse-resize;
                border-top-left-radius: 10px;
            }
            
            .resize-handle.top-right {
                top: 0;
                right: 0;
                cursor: nesw-resize;
                border-top-right-radius: 10px;
            }
            
            .resize-handle.bottom-left {
                bottom: 0;
                left: 0;
                cursor: nesw-resize;
                border-bottom-left-radius: 10px;
            }
            
            .resize-handle.bottom-right {
                bottom: 0;
                right: 0;
                cursor: nwse-resize;
                border-bottom-right-radius: 10px;
            }
            
            /* Size indicator tooltip */
            #size-indicator {
                position: absolute;
                bottom: 25px;
                right: 25px;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                opacity: 0;
                transition: opacity 0.3s;
                pointer-events: none;
                z-index: 10002;
            }
            
            /* Show size indicator when resizing */
            #asl-avatar-container.resizing #size-indicator {
                opacity: 1;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    function createAvatarContainer() {
        // Remove any existing container
        const existingContainer = document.getElementById('asl-avatar-container');
        if (existingContainer) existingContainer.remove();
        
        // Create container
        const container = document.createElement('div');
        container.id = 'asl-avatar-container';
        
        // Create iframe
        const frame = document.createElement('iframe');
        frame.id = 'asl-avatar-frame';
        frame.allowTransparency = true;
        frame.allow = 'autoplay';
        
        // Add timestamp to avoid caching issues
        const timestamp = Date.now();
        frame.src = `ASL/algerianSignLanguage-avatar/web-simulator/index.html?t=${timestamp}`;
        
        // Create controls
        const controls = document.createElement('div');
        controls.id = 'asl-controls';
        
        // Add size buttons
        const increaseBtn = document.createElement('button');
        increaseBtn.className = 'asl-control-btn';
        increaseBtn.innerHTML = '+';
        increaseBtn.title = 'تكبير';
        increaseBtn.onclick = () => resizeAvatar(1.1);
        
        const decreaseBtn = document.createElement('button');
        decreaseBtn.className = 'asl-control-btn';
        decreaseBtn.innerHTML = '-';
        decreaseBtn.title = 'تصغير';
        decreaseBtn.onclick = () => resizeAvatar(0.9);
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'asl-control-btn';
        closeBtn.innerHTML = '×';
        closeBtn.title = 'إغلاق';
        closeBtn.onclick = toggleAvatarDisplay;
        
        // Add buttons to controls
        controls.appendChild(increaseBtn);
        controls.appendChild(decreaseBtn);
        controls.appendChild(closeBtn);
        
        // Add elements to container
        container.appendChild(frame);
        container.appendChild(controls);
        
        // Add to document
        document.body.appendChild(container);
        
        // Create word notification element
        const wordNotification = document.createElement('div');
        wordNotification.id = 'word-notification';
        wordNotification.className = 'word-notification';
        document.body.appendChild(wordNotification);
        
        // Add resize handles
        addResizeHandles(container);
    }
    
    function addResizeHandles(container) {
        // Create size indicator
        const sizeIndicator = document.createElement('div');
        sizeIndicator.id = 'size-indicator';
        sizeIndicator.textContent = `${container.offsetWidth}×${container.offsetHeight}`;
        container.appendChild(sizeIndicator);
        
        // Create resize handles for the four corners
        const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
        
        positions.forEach(position => {
            const handle = document.createElement('div');
            handle.className = `resize-handle ${position}`;
            container.appendChild(handle);
            
            handle.addEventListener('mousedown', startResize);
        });
        
        // Make the entire container draggable
        const header = document.createElement('div');
        header.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 30px;
            cursor: move;
            z-index: 10000;
        `;
        container.appendChild(header);
        header.addEventListener('mousedown', startDrag);
        
        // Function to start resize
        function startResize(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const handle = e.target;
            const isLeft = handle.className.includes('left');
            const isTop = handle.className.includes('top');
            
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = container.offsetWidth;
            const startHeight = container.offsetHeight;
            const startLeft = container.offsetLeft;
            const startTop = container.offsetTop;
            
            container.classList.add('resizing');
            updateSizeIndicator();
            
            // Function to handle resize
            function doResize(e) {
                let newWidth, newHeight, newLeft, newTop;
                
                // Calculate new dimensions based on which handle was dragged
                if (isLeft) {
                    newWidth = Math.max(300, startWidth - (e.clientX - startX));
                    newLeft = startLeft + startWidth - newWidth;
                } else {
                    newWidth = Math.max(300, startWidth + (e.clientX - startX));
                    newLeft = startLeft;
                }
                
                if (isTop) {
                    newHeight = Math.max(350, startHeight - (e.clientY - startY));
                    newTop = startTop + startHeight - newHeight;
                } else {
                    newHeight = Math.max(350, startHeight + (e.clientY - startY));
                    newTop = startTop;
                }
                
                // Apply new dimensions
                container.style.width = `${newWidth}px`;
                container.style.height = `${newHeight}px`;
                container.style.left = `${newLeft}px`;
                container.style.top = `${newTop}px`;
                
                // Update size indicator
                updateSizeIndicator();
            }
            
            // Function to stop resize
            function stopResize() {
                window.removeEventListener('mousemove', doResize);
                window.removeEventListener('mouseup', stopResize);
                container.classList.remove('resizing');
                
                // Hide size indicator after a short delay
                setTimeout(() => {
                    sizeIndicator.style.opacity = '0';
                }, 1500);
            }
            
            // Add event listeners for resize
            window.addEventListener('mousemove', doResize);
            window.addEventListener('mouseup', stopResize);
        }
        
        // Function to start drag
        function startDrag(e) {
            if (e.target !== header) return; // Only drag from the header
            
            e.preventDefault();
            
            const startX = e.clientX;
            const startY = e.clientY;
            const startLeft = container.offsetLeft;
            const startTop = container.offsetTop;
            
            // Function to handle drag
            function doDrag(e) {
                const newLeft = startLeft + (e.clientX - startX);
                const newTop = startTop + (e.clientY - startY);
                
                // Keep within viewport bounds
                const maxLeft = window.innerWidth - container.offsetWidth;
                const maxTop = window.innerHeight - container.offsetHeight;
                
                container.style.left = `${Math.min(maxLeft, Math.max(0, newLeft))}px`;
                container.style.top = `${Math.min(maxTop, Math.max(0, newTop))}px`;
            }
            
            // Function to stop drag
            function stopDrag() {
                window.removeEventListener('mousemove', doDrag);
                window.removeEventListener('mouseup', stopDrag);
            }
            
            // Add event listeners for drag
            window.addEventListener('mousemove', doDrag);
            window.addEventListener('mouseup', stopDrag);
        }
        
        // Update the size indicator
        function updateSizeIndicator() {
            sizeIndicator.textContent = `${container.offsetWidth}×${container.offsetHeight}`;
            sizeIndicator.style.opacity = '1';
        }
        
        // Initialize container position if not already set
        if (!container.style.left || !container.style.top) {
            container.style.left = 'auto';
            container.style.top = 'auto';
        }
    }
    
    function resizeAvatar(factor) {
        // Use the enhanced resizer API if available
        if (window.avatarEnhancedResizerAPI && typeof avatarEnhancedResizerAPI.resizeTo === 'function') {
            const container = document.getElementById('asl-avatar-container');
            if (!container) return;
            
            const currentWidth = container.offsetWidth;
            const currentHeight = container.offsetHeight;
            const newWidth = currentWidth * factor;
            const newHeight = currentHeight * factor;
            
            avatarEnhancedResizerAPI.resizeTo(newWidth, newHeight);
        }
    }
    
    function createTranslationSubtitle() {
        // Remove any existing subtitle
        const existingSubtitle = document.getElementById('translation-subtitle');
        if (existingSubtitle) existingSubtitle.remove();
        
        // Create subtitle element
        const subtitle = document.createElement('div');
        subtitle.id = 'translation-subtitle';
        subtitle.textContent = 'في انتظار النص...';
        
        // Add to document
        document.body.appendChild(subtitle);
    }
    
    function setupMessageListener() {
        // Set up message listener for iframe
        window.addEventListener('message', function(event) {
            if (!event.data || !event.data.action) return;
            
            console.log("Received message from avatar:", event.data.action);
            
            switch (event.data.action) {
                case 'avatarReady':
                    console.log("Avatar is ready");
                    
                    if (avatarVisible) {
                        startRandomWordInterval();
                    }
                    break;
                    
                case 'wordSigned':
                    if (event.data.word) {
                        updateTranslationDisplay(event.data.word, event.data.isSimilar);
                        showWordNotification(event.data.word);
                    }
                    break;
                    
                case 'notification':
                    if (event.data.message) {
                        showWordNotification(event.data.message);
                    }
                    break;
            }
        });
    }
    
    function hookIntoTranscriptionSystem() {
        // Hook into existing transcription function if available
        if (window.updateTranscriptionDisplay) {
            const originalFn = window.updateTranscriptionDisplay;
            window.updateTranscriptionDisplay = function(text, isAppend) {
                // Call original function
                originalFn(text, isAppend);
                
                // Process text for signing
                processTranscriptionText(text);
            };
        }
        
        // Look for other known transcription functions
        const possibleFunctions = ['handleTranscription', 'processTranscription', 'displayTranscription'];
        
        possibleFunctions.forEach(funcName => {
            if (window[funcName] && typeof window[funcName] === 'function') {
                const originalFunc = window[funcName];
                window[funcName] = function(text) {
                    // Call original function
                    originalFunc(text);
                    
                    // Process text for signing
                    processTranscriptionText(text);
                };
            }
        });
        
        // Listen for transcription events
        document.addEventListener('perceiveAI:transcription', function(e) {
            if (e.detail && e.detail.text) {
                processTranscriptionText(e.detail.text);
            }
        });
        
        // Watch for changes in transcription elements
        observeTranscriptionElements();
        
        // Expose global function
        window.processTextForSigning = processTranscriptionText;
    }
    
    function observeTranscriptionElements() {
        // Find possible transcription elements
        const transcriptionElements = [
            document.getElementById('transcription-bar'),
            document.getElementById('transcription'),
            document.getElementById('transcription-display'),
            document.getElementById('transcription-text'),
            document.getElementById('transcription-result'),
            document.getElementById('transcription-output'),
            document.querySelector('[data-transcription]'),
            document.querySelector('.transcription')
        ].filter(Boolean); // Remove null values
        
        if (transcriptionElements.length === 0) return;
        
        // Create observer
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    const target = mutation.target;
                    if (target && target.textContent) {
                        processTranscriptionText(target.textContent);
                    }
                }
            });
        });
        
        // Observe each element
        transcriptionElements.forEach(function(element) {
            observer.observe(element, {
                childList: true,
                characterData: true,
                subtree: true
            });
        });
    }
    
    function processTranscriptionText(text) {
        if (!text) return;
        
        // Update last transcription time
        lastTranscriptionTime = Date.now();
        
        // Extract words
        const words = text.split(/\s+/);
        if (words.length === 0) return;
        
        // Get last word
        const lastWord = words[words.length - 1];
        
        // Sign the word
        signWord(lastWord);
    }
    
    function signWord(word) {
        if (!word || !avatarVisible) return;
        
        console.log("Signing word:", word);
        
        // Send to avatar iframe
        const frame = document.getElementById('asl-avatar-frame');
        if (frame && frame.contentWindow) {
            frame.contentWindow.postMessage({
                action: 'sign',
                text: word
            }, '*');
        }
    }
    
    function updateTranslationDisplay(word, isSimilar) {
        const subtitle = document.getElementById('translation-subtitle');
        if (!subtitle) return;
        
        // Set content
        if (isSimilar) {
            subtitle.innerHTML = `${word} <small style="opacity:0.7">(تقريبًا)</small>`;
        } else {
            subtitle.textContent = word;
        }
        
        // Show subtitle
        subtitle.style.opacity = '1';
        
        // Hide after delay
        clearTimeout(window.subtitleTimeout);
        window.subtitleTimeout = setTimeout(function() {
            subtitle.style.opacity = '0';
        }, 3000);
    }
    
    function showWordNotification(word) {
        const notificationElement = document.getElementById('word-notification');
        if (!notificationElement) return;
        
        // Set text
        notificationElement.textContent = word;
        
        // Show notification
        notificationElement.classList.add('show');
        
        // Hide after delay
        clearTimeout(window.notificationTimeout);
        window.notificationTimeout = setTimeout(function() {
            notificationElement.classList.remove('show');
        }, 2000);
    }
    
    function ensureToggleButtonExists() {
        // Check if button exists
        let toggleBtn = document.getElementById('toggle-sign-language');
        
        if (!toggleBtn) {
            console.log("Creating sign language toggle button");
            
            // Create button
            toggleBtn = document.createElement('button');
            toggleBtn.id = 'toggle-sign-language';
            toggleBtn.className = 'px-4 py-2 bg-primary text-white rounded-md';
            toggleBtn.textContent = 'إظهار لغة الإشارة';
            
            // Find a good place to add it
            const controls = document.querySelector('#controls') || 
                            document.querySelector('.controls') ||
                            document.querySelector('.btn-container');
            
            if (controls) {
                controls.appendChild(toggleBtn);
            } else {
                // Add as floating button
                toggleBtn.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    padding: 10px 20px;
                    background: #8c52ff;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    font-size: 16px;
                    cursor: pointer;
                    z-index: 9990;
                `;
                document.body.appendChild(toggleBtn);
            }
        }
        
        // Set up click handler
        toggleBtn.removeEventListener('click', toggleAvatarDisplay);
        toggleBtn.addEventListener('click', toggleAvatarDisplay);
    }
    
    function toggleAvatarDisplay() {
        avatarVisible = !avatarVisible;
        
        // Update container visibility
        const container = document.getElementById('asl-avatar-container');
        if (container) {
            container.style.display = avatarVisible ? 'block' : 'none';
        }
        
        // Update button text
        const toggleBtn = document.getElementById('toggle-sign-language');
        if (toggleBtn) {
            toggleBtn.textContent = avatarVisible ? 'إخفاء لغة الإشارة' : 'إظهار لغة الإشارة';
        }
        
        // Handle random word interval
        if (avatarVisible) {
            startRandomWordInterval();
            
            // Sign welcome message
            setTimeout(function() {
                signWord('مرحبا');
            }, 500);
        } else {
            stopRandomWordInterval();
        }
    }
    
    function startRandomWordInterval() {
        stopRandomWordInterval();
        
        randomWordInterval = setInterval(function() {
            // Only sign random words if no recent transcription
            if (Date.now() - lastTranscriptionTime > 3000) {
                signRandomWord();
            }
        }, 3000);
    }
    
    function stopRandomWordInterval() {
        if (randomWordInterval) {
            clearInterval(randomWordInterval);
            randomWordInterval = null;
        }
    }
    
    function signRandomWord() {
        // Use word database if available, otherwise use default words
        const wordsToUse = wordDatabase.length > 0 ? wordDatabase : [
            "مرحبا", "أهلا", "شكراً", "رياضة", "كرة", "هدف",
            "فريق", "لاعب", "مباراة", "فوز", "تعادل", "خسارة"
        ];
        
        // Select random word
        const randomWord = wordsToUse[Math.floor(Math.random() * wordsToUse.length)];
        
        // Sign it
        signWord(randomWord);
    }
    
    function loadWordDatabase() {
        // Try to load from multiple possible paths
        const paths = [
            'ASL/algerianSignLanguage-avatar/web-simulator/data/wordlist.json',
            'ASL/data/wordlist.json',
            'data/wordlist.json'
        ];
        
        // Try each path
        tryLoadWordlist(paths, 0);
    }
    
    function tryLoadWordlist(paths, index) {
        if (index >= paths.length) {
            console.warn("Could not load word database from any path");
            return;
        }
        
        fetch(paths[index])
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load from ${paths[index]}`);
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    wordDatabase = data;
                    console.log(`Loaded ${wordDatabase.length} words from ${paths[index]}`);
                }
            })
            .catch(error => {
                console.warn(`Error loading from ${paths[index]}:`, error);
                // Try next path
                tryLoadWordlist(paths, index + 1);
            });
    }
    
    function createCharacterSelector() {
        const container = document.getElementById('asl-avatar-container');
        if (!container) return;
        
        // Create character selector container
        const selectorContainer = document.createElement('div');
        selectorContainer.id = 'character-selector';
        selectorContainer.className = 'character-selector';
        selectorContainer.style.cssText = `
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 10001;
            display: flex;
            align-items: center;
        `;
        
        // Create character button
        const characterButton = document.createElement('button');
        characterButton.className = 'character-button';
        characterButton.innerHTML = `<i class="fas fa-user-friends"></i>`;
        characterButton.title = 'تغيير الشخصية';
        characterButton.style.cssText = `
            width: 32px;
            height: 32px;
            background: rgba(140, 82, 255, 0.5);
            border: none;
            border-radius: 50%;
            color: white;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            transition: background 0.2s;
        `;
        
        // Create dropdown menu
        const dropdownMenu = document.createElement('div');
        dropdownMenu.className = 'character-dropdown';
        dropdownMenu.style.cssText = `
            position: absolute;
            top: 40px;
            left: 0;
            background: rgba(30, 30, 40, 0.95);
            border-radius: 8px;
            padding: 10px;
            min-width: 180px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            display: none;
            flex-direction: column;
            gap: 8px;
            border: 1px solid rgba(140, 82, 255, 0.3);
            z-index: 10002;
        `;
        
        // Add characters to dropdown
        avatarCharacters.forEach(character => {
            const charOption = document.createElement('div');
            charOption.className = 'character-option';
            charOption.dataset.characterId = character.id;
            charOption.style.cssText = `
                padding: 8px 10px;
                border-radius: 6px;
                cursor: pointer;
                display: flex;
                align-items: center;
                transition: background 0.2s;
                direction: rtl;
            `;
            
            // Highlight current selection
            if (character.id === currentCharacter.id) {
                charOption.style.background = 'rgba(140, 82, 255, 0.3)';
            }
            
            charOption.innerHTML = `
                <div style="margin-left: 10px; width: 24px; height: 24px; background: rgba(140, 82, 255, 0.5); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-user"></i>
                </div>
                <div>
                    <div style="font-weight: bold; font-size: 14px;">${character.name}</div>
                    <div style="font-size: 12px; opacity: 0.7;">${character.description}</div>
                </div>
            `;
            
            // Add click handler
            charOption.addEventListener('click', () => {
                changeAvatarCharacter(character);
                
                // Update selection indicator
                document.querySelectorAll('.character-option').forEach(option => {
                    option.style.background = 'transparent';
                });
                charOption.style.background = 'rgba(140, 82, 255, 0.3)';
                
                // Hide dropdown
                dropdownMenu.style.display = 'none';
            });
            
            dropdownMenu.appendChild(charOption);
        });
        
        // Toggle dropdown on button click
        characterButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = dropdownMenu.style.display === 'flex';
            dropdownMenu.style.display = isVisible ? 'none' : 'flex';
        });
        
        // Close dropdown when clicking elsewhere
        document.addEventListener('click', () => {
            dropdownMenu.style.display = 'none';
        });
        
        // Add elements to container
        selectorContainer.appendChild(characterButton);
        selectorContainer.appendChild(dropdownMenu);
        container.appendChild(selectorContainer);
    }
    
    function changeAvatarCharacter(character) {
        currentCharacter = character;
        
        // Update iframe src with new character path
        const frame = document.getElementById('asl-avatar-frame');
        if (!frame) return;
        
        // Store current visibility state
        const avatarContainer = document.getElementById('asl-avatar-container');
        const wasVisible = avatarContainer && avatarContainer.style.display === 'block';
        
        // Create timestamp for cache busting
        const timestamp = Date.now();
        
        // Set new src with character parameter
        frame.src = `ASL/algerianSignLanguage-avatar/web-simulator/index.html?character=${character.path}&t=${timestamp}`;
        
        // Show notification
        showWordNotification(`تم تغيير الشخصية إلى ${character.name}`);
        
        // Notify the iframe about character change
        setTimeout(() => {
            try {
                frame.contentWindow.postMessage({
                    action: 'changeCharacter',
                    character: character.path
                }, '*');
            } catch (e) {
                console.error("Error sending character change message:", e);
            }
        }, 1000);
    }
    
    function addCharacterSelectorStyles() {
        const existingStyle = document.getElementById('avatar-character-styles');
        if (existingStyle) return;
        
        const style = document.createElement('style');
        style.id = 'avatar-character-styles';
        style.textContent += `
            .character-option:hover {
                background: rgba(140, 82, 255, 0.2) !important;
            }
            
            .character-button:hover {
                background: rgba(140, 82, 255, 0.8) !important;
                transform: scale(1.05);
            }
            
            @keyframes characterChange {
                0% { opacity: 0.7; transform: scale(0.95); }
                50% { opacity: 1; transform: scale(1.05); }
                100% { opacity: 1; transform: scale(1); }
            }
            
            .character-changing #asl-avatar-frame {
                animation: characterChange 1s ease-in-out;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // Expose functions globally
    window.avatarAPI = {
        signWord: signWord,
        toggleAvatar: toggleAvatarDisplay,
        processText: processTranscriptionText,
        changeCharacter: changeAvatarCharacter
    };
    
    window.initializeAvatarDisplay = initializeAvatarDisplay;
    window.toggleAvatarDisplay = toggleAvatarDisplay;
})();