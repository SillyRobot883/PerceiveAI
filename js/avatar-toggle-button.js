/**
 * Improved ASL Avatar Toggle Button
 */
(function() {
    console.log("ASL Toggle Button - Loading");
    
    // Initialize on page load and DOMContentLoaded
    document.addEventListener('DOMContentLoaded', initToggleButton);
    window.addEventListener('load', initToggleButton);
    
    // Also run immediately
    setTimeout(initToggleButton, 100);
    
    // Track initialization
    let initialized = false;
    
    function initToggleButton() {
        if (initialized) return;
        initialized = true;
        
        console.log("Initializing ASL toggle button");
        
        // Create button if needed and set up handler
        createToggleButton();
        
        // Ensure button works with translations
        integrateWithTranslations();
    }
    
    function createToggleButton() {
        // Check if button already exists
        let toggleBtn = document.getElementById('toggle-sign-language');
        
        if (!toggleBtn) {
            console.log("Creating ASL toggle button");
            
            // Create button
            toggleBtn = document.createElement('button');
            toggleBtn.id = 'toggle-sign-language';
            toggleBtn.innerHTML = '<i class="fas fa-sign-language" style="margin-left: 8px;"></i> إظهار لغة الإشارة';
            toggleBtn.className = 'px-8 py-4 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl';
            toggleBtn.setAttribute('data-translate', 'toggle-sign-language-show');
            
            // Find proper location for button
            const buttonContainer = findButtonContainer();
            
            if (buttonContainer) {
                buttonContainer.appendChild(toggleBtn);
            } else {
                // Add as floating button
                toggleBtn.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    z-index: 9990;
                    padding: 10px 20px;
                    background: #8c52ff;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    font-size: 16px;
                    cursor: pointer;
                `;
                document.body.appendChild(toggleBtn);
            }
        }
        
        // Set up click handler
        toggleBtn.removeEventListener('click', handleToggleClick);
        toggleBtn.addEventListener('click', handleToggleClick);
    }
    
    function findButtonContainer() {
        // Try to find a suitable container for the button
        const containers = [
            document.querySelector('#demo .flex'),
            document.querySelector('.flex:has(#load-video)'),
            document.querySelector('.flex:has(#toggle-avatar-type)'),
            document.getElementById('buttons-container'),
            document.querySelector('.buttons')
        ];
        
        return containers.find(container => container !== null);
    }
    
    function handleToggleClick() {
        console.log("Toggle button clicked");
        
        // Use API if available
        if (window.aslAvatarAPI && typeof window.aslAvatarAPI.toggleAvatar === 'function') {
            window.aslAvatarAPI.toggleAvatar();
            return;
        }
        
        // Use global function if available
        if (typeof window.toggleAvatarDisplay === 'function') {
            window.toggleAvatarDisplay();
            return;
        }
        
        // Direct implementation as fallback
        const container = document.getElementById('asl-avatar-container');
        if (!container) {
            console.log("Avatar container not found, initializing");
            
            if (typeof window.initializeAvatarDisplay === 'function') {
                window.initializeAvatarDisplay();
                setTimeout(handleToggleClick, 100);
            } else {
                console.error("Cannot initialize avatar display");
            }
            return;
        }
        
        // Toggle visibility
        const isVisible = container.style.display === 'block';
        
        if (isVisible) {
            // Exit animation
            container.style.opacity = '0';
            container.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                container.style.display = 'none';
            }, 300);
        } else {
            // Entrance animation
            container.style.display = 'block';
            container.style.opacity = '0';
            container.style.transform = 'translateY(20px)';
            
            // Force reflow
            void container.offsetWidth;
            
            // Show with animation
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }
        
        // Update button text
        updateButtonText(!isVisible);
    }
    
    function updateButtonText(isVisible) {
        const toggleBtn = document.getElementById('toggle-sign-language');
        if (!toggleBtn) return;
        
        if (isVisible) {
            toggleBtn.innerHTML = '<i class="fas fa-sign-language" style="margin-left: 8px;"></i> إخفاء لغة الإشارة';
            toggleBtn.setAttribute('data-translate', 'toggle-sign-language-hide');
        } else {
            toggleBtn.innerHTML = '<i class="fas fa-sign-language" style="margin-left: 8px;"></i> إظهار لغة الإشارة';
            toggleBtn.setAttribute('data-translate', 'toggle-sign-language-show');
        }
    }
    
    function integrateWithTranslations() {
        // Check if translations system exists
        if (window.translations) {
            // Add our translations
            if (!window.translations.ar['toggle-sign-language-show']) {
                window.translations.ar['toggle-sign-language-show'] = 'إظهار لغة الإشارة';
            }
            
            if (!window.translations.ar['toggle-sign-language-hide']) {
                window.translations.ar['toggle-sign-language-hide'] = 'إخفاء لغة الإشارة';
            }
            
            if (!window.translations.en['toggle-sign-language-show']) {
                window.translations.en['toggle-sign-language-show'] = 'Show Sign Language';
            }
            
            if (!window.translations.en['toggle-sign-language-hide']) {
                window.translations.en['toggle-sign-language-hide'] = 'Hide Sign Language';
            }
        }
    }
    
    // Make available globally
    window.toggleAvatarButton = handleToggleClick;
})();