/**
 * Innovative features to enhance the PerceiveAI experience
 */
(function() {
    // Initialize once DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initInnovativeFeatures();
    });
    
    // Also try on window load in case DOMContentLoaded already fired
    window.addEventListener('load', function() {
        initInnovativeFeatures();
    });
    
    function initInnovativeFeatures() {
        // Add a visual waveform for the audio transcription
        addAudioWaveform();
        
        // Add interactive particles for a more dynamic background
        addInteractiveBackground();
        
        // Add a floating action button for quick actions
        addFloatingActionButton();
        
        // Add keyboard shortcuts
        addKeyboardShortcuts();
        
        // Make the transcription bar more interactive and visually appealing
        enhanceTranscriptionBar();
    }
    
    function addAudioWaveform() {
        const videoContainer = document.getElementById('video-container');
        if (!videoContainer) return;
        
        const waveformContainer = document.createElement('div');
        waveformContainer.id = 'audio-waveform';
        waveformContainer.className = 'absolute bottom-0 left-0 right-0 h-12 z-20 pointer-events-none';
        
        // Create the waveform visualization
        const waveform = document.createElement('div');
        waveform.className = 'flex items-end justify-center h-full gap-1 px-4';
        
        // Create bars for the waveform
        for (let i = 0; i < 50; i++) {
            const bar = document.createElement('div');
            bar.className = 'waveform-bar bg-white/40';
            bar.style.cssText = `
                width: 3px;
                height: 5px;
                transition: height 0.1s ease;
            `;
            waveform.appendChild(bar);
        }
        
        waveformContainer.appendChild(waveform);
        videoContainer.appendChild(waveformContainer);
        
        // Animate the waveform when transcription is active
        let waveformActive = false;
        function animateWaveform() {
            if (!waveformActive) return;
            
            const bars = document.querySelectorAll('.waveform-bar');
            bars.forEach(bar => {
                const height = Math.floor(Math.random() * 20) + 3;
                bar.style.height = `${height}px`;
            });
            
            requestAnimationFrame(animateWaveform);
        }
        
        // Listen for transcription events
        document.addEventListener('transcriptionStarted', function() {
            waveformActive = true;
            animateWaveform();
            document.getElementById('audio-waveform').style.opacity = '1';
        });
        
        document.addEventListener('transcriptionEnded', function() {
            waveformActive = false;
            document.getElementById('audio-waveform').style.opacity = '0';
        });
        
        // Create custom events for transcription
        window.startWaveformAnimation = function() {
            document.dispatchEvent(new Event('transcriptionStarted'));
        };
        
        window.stopWaveformAnimation = function() {
            document.dispatchEvent(new Event('transcriptionEnded'));
        };
    }
    
    function addInteractiveBackground() {
        const container = document.createElement('div');
        container.id = 'particle-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.6;
        `;
        document.body.appendChild(container);
        
        // Add particle canvas
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        `;
        container.appendChild(canvas);
        
        // Setup particles
        const ctx = canvas.getContext('2d');
        const particles = [];
        
        for (let i = 0; i < 30; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25,
                color: `rgba(140, 82, 255, ${Math.random() * 0.4 + 0.1})`
            });
        }
        
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
                
                // Update position
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                // Wrap around edges
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;
            });
            
            // Connect particles with lines if they're close
            particles.forEach((p1, i) => {
                particles.slice(i + 1).forEach(p2 => {
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.strokeStyle = `rgba(140, 82, 255, ${0.2 * (1 - distance / 100)})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                });
            });
            
            requestAnimationFrame(animateParticles);
        }
        
        // Start animation
        animateParticles();
        
        // Resize handler
        window.addEventListener('resize', function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
    
    function addFloatingActionButton() {
        const fab = document.createElement('div');
        fab.id = 'floating-action-button';
        fab.className = 'fixed bottom-6 right-6 z-50 shadow-xl';
        fab.innerHTML = `
            <button id="main-fab" class="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center text-white shadow-lg">
                <i class="fas fa-plus text-xl"></i>
            </button>
            <div id="fab-menu" class="absolute bottom-16 right-0 bg-bg-card rounded-lg p-2 hidden">
                <div class="flex flex-col gap-2">
                    <button id="fab-screenshot" class="fab-item">
                        <i class="fas fa-camera mr-2"></i> لقطة شاشة
                    </button>
                    <button id="fab-fullscreen" class="fab-item">
                        <i class="fas fa-expand mr-2"></i> ملء الشاشة
                    </button>
                    <button id="fab-share" class="fab-item">
                        <i class="fas fa-share-alt mr-2"></i> مشاركة
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(fab);
        
        // Style the FAB
        const style = document.createElement('style');
        style.textContent = `
            #floating-action-button {
                transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0);
            }
            #main-fab {
                transition: all 0.2s;
                box-shadow: 0 5px 15px rgba(140, 82, 255, 0.4);
            }
            #main-fab:hover {
                transform: scale(1.1);
            }
            .fab-item {
                color: white;
                padding: 8px 16px;
                border-radius: 6px;
                border: none;
                background: transparent;
                cursor: pointer;
                text-align: center;
                font-size: 14px;
                white-space: nowrap;
                transition: all 0.2s;
                width: 100%;
            }
            .fab-item:hover {
                background: rgba(255,255,255,0.1);
            }
        `;
        document.head.appendChild(style);
        
        // Toggle FAB menu
        document.getElementById('main-fab').addEventListener('click', function() {
            const menu = document.getElementById('fab-menu');
            menu.classList.toggle('hidden');
            
            // Rotate icon when open
            if (!menu.classList.contains('hidden')) {
                this.querySelector('i').className = 'fas fa-times text-xl';
                this.style.transform = 'rotate(45deg)';
            } else {
                this.querySelector('i').className = 'fas fa-plus text-xl';
                this.style.transform = 'rotate(0)';
            }
        });
        
        // Close menu when clicking elsewhere
        document.addEventListener('click', function(event) {
            const fab = document.getElementById('floating-action-button');
            const menu = document.getElementById('fab-menu');
            
            if (fab && !fab.contains(event.target) && !menu.classList.contains('hidden')) {
                menu.classList.add('hidden');
                document.getElementById('main-fab').querySelector('i').className = 'fas fa-plus text-xl';
                document.getElementById('main-fab').style.transform = 'rotate(0)';
            }
        });
        
        // FAB actions
        document.getElementById('fab-screenshot').addEventListener('click', function() {
            takeScreenshot();
            document.getElementById('fab-menu').classList.add('hidden');
            document.getElementById('main-fab').querySelector('i').className = 'fas fa-plus text-xl';
            document.getElementById('main-fab').style.transform = 'rotate(0)';
        });
        
        document.getElementById('fab-fullscreen').addEventListener('click', function() {
            toggleFullScreen();
            document.getElementById('fab-menu').classList.add('hidden');
            document.getElementById('main-fab').querySelector('i').className = 'fas fa-plus text-xl';
            document.getElementById('main-fab').style.transform = 'rotate(0)';
        });
        
        document.getElementById('fab-share').addEventListener('click', function() {
            shareContent();
            document.getElementById('fab-menu').classList.add('hidden');
            document.getElementById('main-fab').querySelector('i').className = 'fas fa-plus text-xl';
            document.getElementById('main-fab').style.transform = 'rotate(0)';
        });
    }
    
    function takeScreenshot() {
        const videoContainer = document.getElementById('video-container');
        if (!videoContainer) return;
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'screenshot-notification';
        notification.innerHTML = '<i class="fas fa-camera mr-2"></i> جاري التقاط الشاشة...';
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px 25px;
            border-radius: 30px;
            font-size: 16px;
            opacity: 0;
            transition: all 0.3s;
            z-index: 9999;
        `;
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);
        
        // Flash effect
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            opacity: 0;
            transition: opacity 0.5s;
            z-index: 9998;
        `;
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.style.opacity = '1';
            
            setTimeout(() => {
                flash.style.opacity = '0';
                
                setTimeout(() => {
                    flash.remove();
                    
                    // Change notification text
                    notification.innerHTML = '<i class="fas fa-check-circle mr-2"></i> تم حفظ الصورة';
                    
                    setTimeout(() => {
                        notification.style.opacity = '0';
                        notification.style.transform = 'translate(-50%, -50%) scale(0.9)';
                        
                        setTimeout(() => {
                            notification.remove();
                        }, 300);
                    }, 2000);
                }, 500);
            }, 100);
        }, 300);
        
        // Use html2canvas for actual screenshot (would need to be included in the project)
        if (typeof html2canvas === 'function') {
            html2canvas(videoContainer).then(function(canvas) {
                const link = document.createElement('a');
                link.download = 'perceive-ai-screenshot.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        }
    }
    
    function toggleFullScreen() {
        const videoContainer = document.getElementById('video-container');
        if (!videoContainer) return;
        
        if (!document.fullscreenElement) {
            if (videoContainer.requestFullscreen) {
                videoContainer.requestFullscreen();
            } else if (videoContainer.mozRequestFullScreen) {
                videoContainer.mozRequestFullScreen();
            } else if (videoContainer.webkitRequestFullscreen) {
                videoContainer.webkitRequestFullscreen();
            } else if (videoContainer.msRequestFullscreen) {
                videoContainer.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
    
    function shareContent() {
        // Get current URL
        const url = window.location.href;
        const title = document.title;
        
        // Check if Web Share API is available
        if (navigator.share) {
            navigator.share({
                title: title,
                text: 'شاهد هذا الفيديو مع ترجمة لغة الإشارة على PerceiveAI',
                url: url
            }).catch(console.error);
            return;
        }
        
        // Fallback to clipboard
        navigator.clipboard.writeText(url).then(function() {
            // Show notification
            const notification = document.createElement('div');
            notification.className = 'share-notification';
            notification.innerHTML = '<i class="fas fa-check-circle mr-2"></i> تم نسخ الرابط إلى الحافظة';
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 20px;
                border-radius: 20px;
                font-size: 14px;
                opacity: 0;
                transition: all 0.3s;
                z-index: 9999;
            `;
            document.body.appendChild(notification);
            
            // Show notification
            setTimeout(() => {
                notification.style.opacity = '1';
            }, 10);
            
            // Hide after delay
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 2000);
        });
    }
    
    function addKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Alt+S: Screenshot
            if (e.altKey && e.key === 's') {
                e.preventDefault();
                takeScreenshot();
            }
            
            // Alt+F: Fullscreen
            if (e.altKey && e.key === 'f') {
                e.preventDefault();
                toggleFullScreen();
            }
            
            // Alt+A: Toggle avatar
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                const toggleBtn = document.getElementById('toggle-sign-language');
                if (toggleBtn) toggleBtn.click();
            }
            
            // Alt+T: Toggle transcription
            if (e.altKey && e.key === 't') {
                e.preventDefault();
                toggleTranscriptionVisibility();
            }
        });
    }
    
    function toggleTranscriptionVisibility() {
        const transcription = document.getElementById('video-transcription-bar-container');
        if (!transcription) return;
        
        transcription.classList.toggle('hidden');
        
        // Show feedback
        if (!transcription.classList.contains('hidden')) {
            showNotification('تم إظهار النصوص');
        } else {
            showNotification('تم إخفاء النصوص');
        }
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'general-notification';
        notification.innerHTML = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            font-size: 14px;
            opacity: 0;
            transition: all 0.3s;
            z-index: 9999;
        `;
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        // Hide after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }
    
    function enhanceTranscriptionBar() {
        const style = document.createElement('style');
        style.textContent = `
            #main-transcription-display {
                position: relative;
                overflow: hidden;
            }
            
            #main-transcription-display::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 1px;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
                animation: transcription-scanner 2s infinite linear;
                opacity: 0.7;
            }
            
            @keyframes transcription-scanner {
                0% {
                    transform: translateX(-100%);
                }
                100% {
                    transform: translateX(100%);
                }
            }
            
            .new-word {
                animation: highlight-word 0.5s ease-out;
            }
            
            @keyframes highlight-word {
                0% {
                    background-color: rgba(140, 82, 255, 0.5);
                }
                100% {
                    background-color: transparent;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Override the transcription update function to add word highlighting
        const originalUpdateTranscription = window.updateTranscriptionDisplay || function() {};
        window.updateTranscriptionDisplay = function(text, isAppend = false) {
            // First call the original function
            originalUpdateTranscription(text, isAppend);
            
            // Then enhance the display
            const display = document.getElementById('main-transcription-display');
            if (!display) return;
            
            // Get the last word and highlight it
            const words = text.split(' ');
            if (words.length > 0) {
                const lastWord = words[words.length - 1];
                const content = display.innerHTML;
                
                // Only replace if we find the word and it's not already highlighted
                if (content.includes(lastWord) && !content.includes(`<span class="new-word">${lastWord}</span>`)) {
                    const newContent = content.replace(
                        new RegExp(`${lastWord}(?![^<]*>)`, 'g'), 
                        `<span class="new-word">${lastWord}</span>`
                    );
                    display.innerHTML = newContent;
                    
                    // Remove the highlight after animation completes
                    setTimeout(() => {
                        const highlightedSpans = display.querySelectorAll('.new-word');
                        highlightedSpans.forEach(span => {
                            const text = span.textContent;
                            const parent = span.parentNode;
                            if (parent) {
                                parent.replaceChild(document.createTextNode(text), span);
                            }
                        });
                    }, 500);
                }
            }
        };
    }
})();