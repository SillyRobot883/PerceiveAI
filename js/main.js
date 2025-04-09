import translations from './translations.js';

document.addEventListener('DOMContentLoaded', function() {
    // Language switch functionality
    const switchButton = document.getElementById('language-switch');
    switchButton.addEventListener('click', switchLanguage);

    function switchLanguage() {
        const currentLang = document.documentElement.lang;
        if (currentLang === 'ar') {
            translateToEnglish();
        } else {
            translateToArabic();
        }
    }

    function translateToEnglish() {
        document.documentElement.lang = 'en';
        document.documentElement.dir = 'ltr';
        switchButton.textContent = 'AR';

        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            el.innerHTML = translations.en[key] || el.innerHTML;
        });
    }

    function translateToArabic() {
        document.documentElement.lang = 'ar';
        document.documentElement.dir = 'rtl';
        switchButton.textContent = 'EN';

        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            el.innerHTML = translations.ar[key] || el.innerHTML;
        });
    }

    // Stats animation functionality
    function isInViewport(element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }

    const statsSection = document.getElementById('stats');
    let animated = false;

    function checkScroll() {
        if (statsSection && isInViewport(statsSection) && !animated) {
            animateStats();
            animated = true;
        }
    }

    function animateStats() {
        const stats = document.querySelectorAll('.stat-number');

        stats.forEach(stat => {
            const targetValue = stat.textContent;
            let value = 0;
            let suffix = '';

            if (targetValue.includes('K')) {
                value = parseFloat(targetValue) * 1000;
                suffix = 'K';
            } else if (targetValue.includes('M')) {
                value = parseFloat(targetValue) * 1000000;
                suffix = 'M';
            } else if (targetValue.includes('%')) {
                value = parseFloat(targetValue);
                suffix = '%';
            } else {
                value = parseFloat(targetValue);
            }

            let startValue = 0;
            let duration = 2000;
            let startTime = null;

            function animate(currentTime) {
                if (!startTime) startTime = currentTime;
                let progress = (currentTime - startTime) / duration;
                if (progress > 1) progress = 1;

                let currentValue = startValue + (value - startValue) * progress;

                let displayValue = '';
                if (suffix === 'K') {
                    displayValue = (currentValue / 1000).toFixed(1) + suffix;
                } else if (suffix === 'M') {
                    displayValue = (currentValue / 1000000).toFixed(2) + suffix;
                } else if (suffix === '%') {
                    displayValue = currentValue.toFixed(1) + suffix;
                } else {
                    displayValue = Math.round(currentValue).toString();
                }

                stat.textContent = displayValue;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            }

            requestAnimationFrame(animate);
        });
    }

    window.addEventListener('scroll', checkScroll);

    // Check on page load
    checkScroll();

    // Add this code to integrate the avatar with the transcription system
    // Listen for the toggle sign language button
    const toggleSignBtn = document.getElementById('toggle-sign-language');
    if (toggleSignBtn) {
        toggleSignBtn.addEventListener('click', function() {
            if (window.avatarController) {
                if (window.avatarController.isVisible) {
                    window.avatarController.hideAvatar();
                    toggleSignBtn.textContent = 'إظهار لغة الإشارة';
                } else {
                    window.avatarController.showAvatar();
                    toggleSignBtn.textContent = 'إخفاء لغة الإشارة';
                }
            }
        });
    }
    
    // Listen for the toggle avatar type button
    const toggleAvatarTypeBtn = document.getElementById('toggle-avatar-type');
    if (toggleAvatarTypeBtn) {
        toggleAvatarTypeBtn.addEventListener('click', function() {
            if (window.avatarController) {
                // Get current settings
                const savedSettings = localStorage.getItem('perceiveAI_avatarSettings');
                const settings = savedSettings ? JSON.parse(savedSettings) : {
                    size: 'normal',
                    position: 'bottom-right',
                    emotionDetection: true,
                    continuousMode: true,
                    avatarType: '3d'
                };
                
                // Toggle avatar type
                settings.avatarType = settings.avatarType === '3d' ? '2d' : '3d';
                
                // Apply settings
                if (window.avatarController.applySettings) {
                    window.avatarController.applySettings(settings);
                }
                
                // Update button text
                toggleAvatarTypeBtn.innerHTML = settings.avatarType === '3d' ? 
                    '<i class="fas fa-user-astronaut mr-2"></i> استخدم الأفاتار ثنائي الأبعاد' : 
                    '<i class="fas fa-user mr-2"></i> استخدم الأفاتار ثلاثي الأبعاد';
            }
        });
    }
    
    // Hook into the transcription system
    if (typeof window.processTextForSignLanguage !== 'function') {
        window.processTextForSignLanguage = function(text) {
            if (!text || !window.avatarController) return;
            
            // Convert text to sign language
            const words = text.split(/\s+/);
            if (words.length > 0) {
                // Sign the latest word or short phrase
                const lastWord = words.slice(-3).join(' '); // Take last 3 words as a phrase
                window.avatarController.signWord(lastWord);
            }
        };
    }
});