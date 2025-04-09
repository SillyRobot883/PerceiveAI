/**
 * Character Switcher for ASL Avatar
 * Provides a standalone button to switch between different avatar characters
 */
(function() {
    console.log("Character Switcher - Loading");
    
    // Define available characters - make sure these match your actual avatar directories
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
            description: 'شخصية أنثوية عصرية'
        },
        {
            id: 'ahmed',
            name: 'أحمد',
            path: 'ahmed',
            description: 'شخصية عربية'
        }
    ];
    
    // Store current character
    let currentCharacter = avatarCharacters[0];
    
    // Wait for DOM load
    document.addEventListener('DOMContentLoaded', initCharacterSwitcher);
    window.addEventListener('load', initCharacterSwitcher);
    
    // Track initialization
    let initialized = false;
    
    // Listen for character changed messages
    window.addEventListener('message', function(event) {
        if (event.data && event.data.action === 'characterChanged') {
            const newCharId = event.data.character;
            const character = avatarCharacters.find(c => c.id === newCharId || c.path === newCharId);
            
            if (character) {
                currentCharacter = character;
                updateCharacterSelectionUI();
            }
        }
    });
    
    function initCharacterSwitcher() {
        if (initialized) return;
        
        console.log("Initializing Character Switcher");
        
        // Add required styles
        addCharacterStyles();
        
        // Create the switcher button
        setTimeout(() => {
            createCharacterSwitcherButton();
            initialized = true;
            console.log("Character Switcher Initialized");
        }, 1000);
    }
    
    function addCharacterStyles() {
        // Remove any existing styles first
        const existingStyle = document.getElementById('character-switcher-styles');
        if (existingStyle) existingStyle.remove();
        
        const style = document.createElement('style');
        style.id = 'character-switcher-styles';
        style.textContent = `
            #character-switcher-button {
                background: linear-gradient(135deg, #8c52ff, #5271ff);
                color: white;
                border: none;
                border-radius: 50px;
                padding: 8px 16px;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
                transition: all 0.3s;
                box-shadow: 0 2px 10px rgba(140, 82, 255, 0.3);
                position: relative;
                z-index: 10001;
            }
            
            #character-switcher-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(140, 82, 255, 0.5);
            }
            
            #character-switcher-dropdown {
                position: absolute;
                top: 100%;
                right: 0;
                background: rgba(30, 30, 40, 0.95);
                border-radius: 12px;
                padding: 12px;
                min-width: 220px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
                z-index: 10002;
                margin-top: 8px;
                display: none;
                flex-direction: column;
                gap: 8px;
                border: 1px solid rgba(140, 82, 255, 0.3);
                backdrop-filter: blur(10px);
                transition: opacity 0.3s, transform 0.3s;
                transform-origin: top right;
                opacity: 0;
                transform: scale(0.95);
            }
            
            #character-switcher-dropdown.show {
                display: flex;
                opacity: 1;
                transform: scale(1);
            }
            
            .character-option {
                padding: 10px;
                border-radius: 8px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: background 0.2s;
                direction: rtl;
                text-align: right;
            }
            
            .character-option:hover {
                background: rgba(140, 82, 255, 0.2);
            }
            
            .character-option.selected {
                background: rgba(140, 82, 255, 0.3);
            }
            
            .character-avatar {
                width: 36px;
                height: 36px;
                background: rgba(140, 82, 255, 0.3);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                color: white;
                flex-shrink: 0;
            }
            
            .character-info {
                flex-grow: 1;
            }
            
            .character-name {
                font-weight: bold;
                font-size: 14px;
            }
            
            .character-desc {
                font-size: 12px;
                opacity: 0.7;
            }
            
            .character-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                width: 18px;
                height: 18px;
                background: #ff4d4d;
                border-radius: 50%;
                color: white;
                font-size: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
            
            @keyframes pulse-badge {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
            
            .character-badge.new {
                animation: pulse-badge 1.5s infinite;
            }
            
            /* Character notification */
            #character-notification {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(140, 82, 255, 0.9);
                color: white;
                padding: 10px 20px;
                border-radius: 8px;
                font-size: 14px;
                z-index: 10010;
                opacity: 0;
                transition: opacity 0.3s, transform 0.3s;
                text-align: center;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                pointer-events: none;
            }
            
            #character-notification.show {
                opacity: 1;
                transform: translateX(-50%) translateY(10px);
            }
            
            /* In-avatar character selector */
            #in-avatar-character {
                position: absolute;
                top: 10px;
                left: 10px;
                z-index: 10001;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    function createCharacterSwitcherButton() {
        // Remove any existing button first
        const existingButton = document.getElementById('character-switcher-button');
        if (existingButton) existingButton.remove();
        
        // Create character notification element
        let notification = document.getElementById('character-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'character-notification';
            document.body.appendChild(notification);
        }
        
        // Find a good place to add the button
        let container = document.querySelector('#toggle-sign-language');
        
        if (container) {
            // Create button container
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = 'display: inline-block; margin-left: 10px; position: relative;';
            buttonContainer.id = 'character-switcher-container';
            
            // Create the button
            const button = document.createElement('button');
            button.id = 'character-switcher-button';
            button.innerHTML = `
                <i class="fas fa-user-friends"></i>
                <span>الشخصيات</span>
                <div class="character-badge new">${avatarCharacters.length}</div>
            `;
            
            // Create dropdown
            const dropdown = document.createElement('div');
            dropdown.id = 'character-switcher-dropdown';
            
            // Add characters to dropdown
            avatarCharacters.forEach(character => {
                const option = document.createElement('div');
                option.className = 'character-option';
                option.dataset.characterId = character.id;
                
                if (character.id === currentCharacter.id) {
                    option.classList.add('selected');
                }
                
                option.innerHTML = `
                    <div class="character-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="character-info">
                        <div class="character-name">${character.name}</div>
                        <div class="character-desc">${character.description}</div>
                    </div>
                `;
                
                // Add click handler
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    // Call character change function
                    changeCharacter(character);
                    
                    // Update selection in dropdown
                    document.querySelectorAll('.character-option').forEach(el => {
                        el.classList.remove('selected');
                    });
                    option.classList.add('selected');
                    
                    // Hide dropdown
                    dropdown.classList.remove('show');
                    
                    // Remove new badge after selection
                    const badge = button.querySelector('.character-badge');
                    if (badge) {
                        badge.classList.remove('new');
                        badge.textContent = avatarCharacters.length;
                    }
                });
                
                dropdown.appendChild(option);
            });
            
            // Toggle dropdown on button click
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('show');
            });
            
            // Close dropdown when clicking elsewhere
            document.addEventListener('click', () => {
                dropdown.classList.remove('show');
            });
            
            // Add to button
            buttonContainer.appendChild(button);
            buttonContainer.appendChild(dropdown);
            
            // Add after the toggle button
            container.parentNode.insertBefore(buttonContainer, container.nextSibling);
            
            // Also create in-avatar selector if container exists
            const avatarContainer = document.getElementById('asl-avatar-container');
            if (avatarContainer) {
                createInAvatarSelector(avatarContainer);
            }
        }
    }
    
    function updateCharacterSelectionUI() {
        // Update dropdown selections
        document.querySelectorAll('.character-option').forEach(el => {
            el.classList.remove('selected');
            if (el.dataset.characterId === currentCharacter.id) {
                el.classList.add('selected');
            }
        });
    }
    
    function createInAvatarSelector(container) {
        // Check if selector already exists
        if (document.getElementById('in-avatar-character')) return;
        
        const selector = document.createElement('div');
        selector.id = 'in-avatar-character';
        
        // Create dropdown button
        const dropdownBtn = document.createElement('button');
        dropdownBtn.className = 'asl-control-btn'; // Use consistent styling with other avatar controls
        dropdownBtn.innerHTML = '<i class="fas fa-user"></i>';
        dropdownBtn.title = 'تغيير الشخصية';
        dropdownBtn.style.cssText = `
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
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        `;
        
        // Create dropdown content
        const dropdownContent = document.createElement('div');
        dropdownContent.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            background: rgba(30, 30, 40, 0.95);
            border-radius: 8px;
            padding: 8px;
            min-width: 180px;
            display: none;
            flex-direction: column;
            gap: 6px;
            margin-top: 5px;
            z-index: 10002;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        // Add characters to dropdown
        avatarCharacters.forEach(character => {
            const item = document.createElement('div');
            item.style.cssText = `
                padding: 8px;
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: background 0.2s;
                direction: rtl;
                text-align: right;
            `;
            item.innerHTML = `
                <div style="width: 24px; height: 24px; background: rgba(140, 82, 255, 0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <i class="fas fa-user" style="font-size: 12px; color: white;"></i>
                </div>
                <div style="flex-grow: 1;">
                    <div style="font-weight: bold; font-size: 12px; color: white;">${character.name}</div>
                </div>
            `;
            
            if (character.id === currentCharacter.id) {
                item.style.background = 'rgba(140, 82, 255, 0.3)';
            }
            
            // Add hover effect
            item.addEventListener('mouseover', () => {
                item.style.background = 'rgba(140, 82, 255, 0.2)';
            });
            
            item.addEventListener('mouseout', () => {
                if (character.id !== currentCharacter.id) {
                    item.style.background = 'transparent';
                } else {
                    item.style.background = 'rgba(140, 82, 255, 0.3)';
                }
            });
            
            // Add click handler
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Change character
                changeCharacter(character);
                
                // Update selection
                dropdownContent.querySelectorAll('div').forEach(div => {
                    div.style.background = 'transparent';
                });
                item.style.background = 'rgba(140, 82, 255, 0.3)';
                
                // Hide dropdown
                dropdownContent.style.display = 'none';
            });
            
            dropdownContent.appendChild(item);
        });
        
        // Toggle dropdown on button click
        dropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownContent.style.display = dropdownContent.style.display === 'flex' ? 'none' : 'flex';
        });
        
        // Close dropdown when clicking elsewhere
        document.addEventListener('click', () => {
            dropdownContent.style.display = 'none';
        });
        
        // Add to selector
        selector.appendChild(dropdownBtn);
        selector.appendChild(dropdownContent);
        
        // Add to container
        container.appendChild(selector);
    }
    
    // Update the changeCharacter function to be more robust:

    function changeCharacter(character) {
        console.log("Changing character to:", character.name);
        
        // Show notification
        showCharacterNotification(`تم تغيير الشخصية إلى ${character.name}`);
        
        // Update current character
        currentCharacter = character;
        
        // Get the avatar frame
        const frame = document.getElementById('asl-avatar-frame');
        if (!frame) {
            console.error("Avatar frame not found");
            return;
        }
        
        // Set loading indicator
        const avatarContainer = document.getElementById('asl-avatar-container');
        if (avatarContainer) {
            // Create and show a loading overlay if it doesn't exist
            let loadingOverlay = avatarContainer.querySelector('.character-loading-overlay');
            if (!loadingOverlay) {
                loadingOverlay = document.createElement('div');
                loadingOverlay.className = 'character-loading-overlay';
                loadingOverlay.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10005;
                    opacity: 0;
                    transition: opacity 0.3s;
                    pointer-events: none;
                `;
                
                const loadingText = document.createElement('div');
                loadingText.style.cssText = `
                    background: rgba(140, 82, 255, 0.8);
                    color: white;
                    padding: 15px 30px;
                    border-radius: 10px;
                    font-size: 18px;
                    text-align: center;
                `;
                loadingText.textContent = `جاري تغيير الشخصية إلى ${character.name}...`;
                
                loadingOverlay.appendChild(loadingText);
                avatarContainer.appendChild(loadingOverlay);
            }
            
            // Show loading overlay
            loadingOverlay.style.opacity = '1';
            
            // Hide after 2.5s
            setTimeout(() => {
                loadingOverlay.style.opacity = '0';
            }, 2500);
        }
        
        // APPROACH 1: First try direct method - immediately send postMessage
        try {
            frame.contentWindow.postMessage({
                action: 'changeCharacter',
                character: character.path
            }, '*');
            console.log("Sent character change message to iframe:", character.path);
        } catch (e) {
            console.error("Error sending message to iframe:", e);
        }
        
        // APPROACH 2: After a delay, reload the iframe with the character parameter
        // This is our more reliable fallback method
        setTimeout(() => {
            // Create a unique timestamp to prevent caching
            const timestamp = Date.now();
            const newSrc = `ASL/algerianSignLanguage-avatar/web-simulator/index.html?character=${character.path}&t=${timestamp}`;
            
            console.log("Reloading iframe with new character:", newSrc);
            frame.src = newSrc;
        }, 300);
        
        // Update UI selection indicators
        updateCharacterSelectionUI();
    }
    
    function showCharacterNotification(message) {
        const notification = document.getElementById('character-notification');
        if (!notification) return;
        
        // Set message
        notification.textContent = message;
        
        // Show notification
        notification.classList.add('show');
        
        // Hide after delay
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Expose functions globally
    window.switchAvatarCharacter = function(characterId) {
        const character = avatarCharacters.find(c => c.id === characterId);
        if (character) {
            changeCharacter(character);
            return true;
        }
        return false;
    };
    
    // Make character switcher available as API
    window.characterSwitcherAPI = {
        switchCharacter: switchAvatarCharacter,
        getCurrentCharacter: () => currentCharacter,
        getAvailableCharacters: () => avatarCharacters
    };
})();