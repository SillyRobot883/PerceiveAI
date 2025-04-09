/**
 * Emergency Fix for PerceiveAI Avatar
 * Addresses resize and transcription issues
 */
(function() {
    console.log("🔧 EMERGENCY FIX: Loading direct fixes");
    
    // Run when document is loaded
    document.addEventListener('DOMContentLoaded', applyEmergencyFixes);
    window.addEventListener('load', applyEmergencyFixes);
    
    // Also run after a delay to ensure everything is loaded
    setTimeout(applyEmergencyFixes, 1500);
    setTimeout(applyEmergencyFixes, 3000);
    
    function applyEmergencyFixes() {
        console.log("🔧 EMERGENCY FIX: Applying fixes");
        
        // Fix 1: Fix avatar container resizing
        fixAvatarResize();
        
        // Fix 2: Fix transcription to avatar
        fixTranscriptionToAvatar();
        
        // Fix 3: Fix character switcher
        fixCharacterSwitcher();
    }
    
    function fixAvatarResize() {
        const container = document.getElementById('asl-avatar-container');
        if (!container) {
            console.log("🔧 EMERGENCY FIX: Avatar container not found");
            return;
        }
        
        console.log("🔧 EMERGENCY FIX: Fixing avatar resize");
        
        // Force remove problematic styles
        container.style.removeProperty('resize');
        
        // Apply important styles with !important to override conflicting styles
        const styles = {
            'position': 'fixed',
            'bottom': '20px',
            'right': '20px',
            'width': '600px', // Larger default size
            'height': '650px',
            'background-color': 'rgba(15, 17, 33, 0.9)',
            'border-radius': '12px',
            'border': '2px solid rgba(140, 82, 255, 0.8)',
            'box-shadow': '0 0 20px rgba(140, 82, 255, 0.4)',
            'z-index': '9999',
            'overflow': 'hidden',
            'min-width': '300px',
            'min-height': '350px',
            'max-width': '95vw',
            'max-height': '95vh'
        };
        
        // Apply all styles with !important
        Object.keys(styles).forEach(key => {
            container.style.setProperty(key, styles[key], 'important');
        });
        
        // Add the resize handle if it doesn't exist
        if (!container.querySelector('.resize-handle')) {
            // Create the resize handle
            const handle = document.createElement('div');
            handle.className = 'resize-handle';
            handle.style.cssText = `
                position: absolute;
                bottom: 0;
                right: 0;
                width: 20px;
                height: 20px;
                cursor: nwse-resize;
                z-index: 10001;
                background: rgba(140, 82, 255, 0.5);
                clip-path: polygon(100% 0%, 100% 100%, 0% 100%);
            `;
            
            // Add resize functionality
            handle.addEventListener('mousedown', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Initial positions
                const startX = e.clientX;
                const startY = e.clientY;
                const startWidth = container.offsetWidth;
                const startHeight = container.offsetHeight;
                
                // Set container to resizing mode
                container.classList.add('resizing');
                
                // Create and add size display if it doesn't exist
                let sizeDisplay = container.querySelector('.size-display');
                if (!sizeDisplay) {
                    sizeDisplay = document.createElement('div');
                    sizeDisplay.className = 'size-display';
                    sizeDisplay.style.cssText = `
                        position: absolute;
                        bottom: 30px;
                        right: 30px;
                        background: rgba(0, 0, 0, 0.7);
                        color: white;
                        padding: 5px 10px;
                        border-radius: 4px;
                        font-size: 12px;
                        z-index: 10002;
                    `;
                    container.appendChild(sizeDisplay);
                }
                
                // Update size display
                sizeDisplay.textContent = `${startWidth} × ${startHeight}`;
                sizeDisplay.style.display = 'block';
                
                // Move function
                function onMouseMove(e) {
                    const width = startWidth + (e.clientX - startX);
                    const height = startHeight + (e.clientY - startY);
                    
                    // Apply minimum dimensions
                    const newWidth = Math.max(300, width);
                    const newHeight = Math.max(350, height);
                    
                    // Set new dimensions with !important
                    container.style.setProperty('width', `${newWidth}px`, 'important');
                    container.style.setProperty('height', `${newHeight}px`, 'important');
                    
                    // Update size display
                    sizeDisplay.textContent = `${newWidth} × ${newHeight}`;
                }
                
                // End resize function
                function onMouseUp() {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    
                    // Remove resizing class
                    container.classList.remove('resizing');
                    
                    // Hide size display after delay
                    setTimeout(() => {
                        sizeDisplay.style.display = 'none';
                    }, 1500);
                }
                
                // Add event listeners
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
            
            container.appendChild(handle);
            console.log("🔧 EMERGENCY FIX: Added resize handle");
        }
        
        // If iframe exists, ensure it fills the container
        const frame = container.querySelector('#asl-avatar-frame');
        if (frame) {
            frame.style.width = '100%';
            frame.style.height = '100%';
            frame.style.border = 'none';
        }
    }
    
    function fixTranscriptionToAvatar() {
        console.log("🔧 EMERGENCY FIX: Setting up transcription to avatar");
        
        // Get the transcription bar
        const transcriptionBar = document.getElementById('transcription-bar');
        const mainTranscription = document.getElementById('main-transcription-display');
        const transcriptionContent = document.getElementById('transcription-content');
        
        if (transcriptionBar || mainTranscription || transcriptionContent) {
            // Create a MutationObserver to watch for content changes
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList' || mutation.type === 'characterData') {
                        const element = mutation.target;
                        const text = element.textContent.trim();
                        
                        if (text && text !== "انقر على زر الميكروفون لبدء الاستماع") {
                            sendToAvatar(text);
                        }
                    }
                });
            });
            
            // Observe transcription bar
            if (transcriptionBar) {
                observer.observe(transcriptionBar, {
                    childList: true,
                    characterData: true,
                    subtree: true
                });
                console.log("🔧 EMERGENCY FIX: Observing transcription bar");
            }
            
            // Observe main transcription display if available
            if (mainTranscription) {
                observer.observe(mainTranscription, {
                    childList: true,
                    characterData: true,
                    subtree: true
                });
                console.log("🔧 EMERGENCY FIX: Observing main transcription display");
            }
            
            // Observe transcription content if available
            if (transcriptionContent) {
                observer.observe(transcriptionContent, {
                    childList: true,
                    characterData: true,
                    subtree: true
                });
                console.log("🔧 EMERGENCY FIX: Observing transcription content");
            }
        } else {
            console.log("🔧 EMERGENCY FIX: No transcription elements found");
        }
        
        // Use more robust method to send text to avatar
        window.sendToAvatar = function(text) {
            console.log("🔧 EMERGENCY FIX: Sending to avatar:", text);
            
            // Method 1: Direct iframe access
            try {
                const frame = document.getElementById('asl-avatar-frame');
                if (frame && frame.contentWindow) {
                    const glossInput = frame.contentWindow.document.getElementById('glossInput');
                    if (glossInput) {
                        // Set value
                        glossInput.value = text;
                        
                        // Try to trigger play
                        if (typeof frame.contentWindow.playGloss === 'function') {
                            frame.contentWindow.playGloss();
                        }
                        return true;
                    }
                }
            } catch (e) {
                console.log("🔧 EMERGENCY FIX: Error accessing iframe directly:", e);
            }
            
            // Method 2: PostMessage communication
            try {
                const frame = document.getElementById('asl-avatar-frame');
                if (frame) {
                    frame.contentWindow.postMessage({
                        action: 'playGloss',
                        text: text
                    }, '*');
                    return true;
                }
            } catch (e) {
                console.log("🔧 EMERGENCY FIX: Error sending postMessage:", e);
            }
            
            return false;
        };
    }
    
    function fixCharacterSwitcher() {
        console.log("🔧 EMERGENCY FIX: Fixing character switcher");
        
        // Define available characters - make sure these match your folders
        const characters = [
            { id: 'anna', name: 'آنا' },
            { id: 'marcus', name: 'ماركوس' },
            { id: 'luna', name: 'لونا' },
            { id: 'ahmed', name: 'أحمد' }
        ];
        
        // If no character switcher exists, create a simple one
        if (!document.getElementById('simple-character-switcher')) {
            // Create the switcher
            const switcher = document.createElement('div');
            switcher.id = 'simple-character-switcher';
            switcher.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(15, 17, 33, 0.9);
                border-radius: 8px;
                padding: 10px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 5px;
            `;
            
            // Add a title
            const title = document.createElement('div');
            title.textContent = 'اختيار الشخصية';
            title.style.cssText = `
                font-weight: bold;
                margin-bottom: 5px;
                color: white;
                text-align: center;
            `;
            switcher.appendChild(title);
            
            // Add character buttons
            characters.forEach(character => {
                const button = document.createElement('button');
                button.textContent = character.name;
                button.dataset.characterId = character.id;
                button.style.cssText = `
                    padding: 5px 10px;
                    background: rgba(140, 82, 255, 0.5);
                    border: none;
                    border-radius: 4px;
                    color: white;
                    cursor: pointer;
                    transition: background 0.2s;
                `;
                
                button.addEventListener('mouseover', () => {
                    button.style.background = 'rgba(140, 82, 255, 0.8)';
                });
                
                button.addEventListener('mouseout', () => {
                    button.style.background = 'rgba(140, 82, 255, 0.5)';
                });
                
                button.addEventListener('click', () => {
                    changeCharacter(character.id);
                });
                
                switcher.appendChild(button);
            });
            
            // Add close button
            const closeButton = document.createElement('button');
            closeButton.textContent = 'إغلاق';
            closeButton.style.cssText = `
                padding: 5px 10px;
                background: rgba(255, 82, 82, 0.5);
                border: none;
                border-radius: 4px;
                color: white;
                cursor: pointer;
                margin-top: 5px;
                transition: background 0.2s;
            `;
            
            closeButton.addEventListener('mouseover', () => {
                closeButton.style.background = 'rgba(255, 82, 82, 0.8)';
            });
            
            closeButton.addEventListener('mouseout', () => {
                closeButton.style.background = 'rgba(255, 82, 82, 0.5)';
            });
            
            closeButton.addEventListener('click', () => {
                switcher.style.display = 'none';
            });
            
            switcher.appendChild(closeButton);
            
            // Add a toggle button
            const toggleButton = document.createElement('button');
            toggleButton.textContent = 'الشخصيات';
            toggleButton.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(140, 82, 255, 0.8);
                color: white;
                border: none;
                border-radius: 4px;
                padding: 5px 10px;
                cursor: pointer;
                z-index: 9999;
                display: none;
            `;
            
            toggleButton.addEventListener('click', () => {
                switcher.style.display = 'flex';
                toggleButton.style.display = 'none';
            });
            
            document.body.appendChild(toggleButton);
            
            // Initially hide the switcher
            switcher.style.display = 'none';
            toggleButton.style.display = 'block';
            
            document.body.appendChild(switcher);
            console.log("🔧 EMERGENCY FIX: Added simple character switcher");
            
            // Add character changing function
            window.changeCharacter = function(characterId) {
                console.log("🔧 EMERGENCY FIX: Changing character to", characterId);
                
                // Get the frame
                const frame = document.getElementById('asl-avatar-frame');
                if (!frame) return;
                
                // Try to send message to frame
                try {
                    frame.contentWindow.postMessage({
                        action: 'changeCharacter',
                        character: characterId
                    }, '*');
                } catch (e) {
                    console.log("🔧 EMERGENCY FIX: Error sending character change message:", e);
                }
                
                // Also reload frame with the character parameter
                try {
                    const timestamp = new Date().getTime();
                    frame.src = `ASL/algerianSignLanguage-avatar/web-simulator/index.html?character=${characterId}&v=${timestamp}`;
                } catch (e) {
                    console.log("🔧 EMERGENCY FIX: Error reloading frame:", e);
                }
                
                // Show notification
                showNotification(`تم تغيير الشخصية إلى ${characterId}`);
                
                // Hide switcher and show toggle button
                switcher.style.display = 'none';
                toggleButton.style.display = 'block';
                
                return true;
            };
        }
    }
    
    // Helper function to show notifications
    function showNotification(message) {
        // Check if notification element exists
        let notification = document.getElementById('emergency-notification');
        
        // Create if it doesn't exist
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'emergency-notification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(140, 82, 255, 0.8);
                color: white;
                padding: 10px 20px;
                border-radius: 8px;
                font-size: 14px;
                text-align: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s;
            `;
            document.body.appendChild(notification);
        }
        
        // Set message and show
        notification.textContent = message;
        notification.style.opacity = '1';
        
        // Hide after delay
        setTimeout(() => {
            notification.style.opacity = '0';
        }, 3000);
    }
})();