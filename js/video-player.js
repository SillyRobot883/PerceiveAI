document.addEventListener('DOMContentLoaded', function() {
    // YouTube API setup
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
    let player;
    let overlayActive = false;
    const placeholder = document.getElementById('video-placeholder');
    const playerContainer = document.getElementById('video-player');
    const loadButton = document.getElementById('load-video');
    const urlInput = document.getElementById('youtube-url');
    
    if (loadButton && urlInput) {
        loadButton.addEventListener('click', function() {
            const youtubeUrl = urlInput.value.trim();
            
            if (!youtubeUrl) {
                showError('Please enter a valid YouTube URL');
                return;
            }
            
            const videoId = extractYoutubeId(youtubeUrl);
            
            if (!videoId) {
                showError('Invalid YouTube URL format');
                return;
            }
            
            if (placeholder) placeholder.style.display = 'none';
            
            // Create player if doesn't exist yet
            if (!player) {
                player = new YT.Player('video-player', {
                    height: '100%',
                    width: '100%',
                    videoId: videoId,
                    playerVars: {
                        'playsinline': 1,
                        'autoplay': 0,
                        'rel': 0
                    },
                    events: {
                        'onReady': onPlayerReady,
                        'onStateChange': onPlayerStateChange
                    }
                });
            } else {
                // Load new video if player already exists
                player.loadVideoById(videoId);
                player.playVideo();
            }
        });
    }
    
    function onPlayerReady(event) {
        event.target.playVideo();
        // After player is ready, wait a bit and add sign language overlay
        setTimeout(addSignLanguageOverlay, 1500);
    }
    
    function onPlayerStateChange(event) {
        // When video starts playing
        if (event.data === YT.PlayerState.PLAYING && !overlayActive) {
            addSignLanguageOverlay();
        }
    }
    
    function addSignLanguageOverlay() {
        if (overlayActive) return;
        
        // Create sign language overlay
        const overlay = document.createElement('div');
        overlay.className = 'sign-language-overlay';
        overlay.style.cssText = `
            position: absolute;
            bottom: 20px;
            right: 20px;
            width: 180px;
            height: 250px;
            background-image: url('assets/sign-language-avatar.gif');
            background-size: cover;
            background-position: center;
            border-radius: 10px;
            z-index: 10;
        `;
        
        // Fallback if gif doesn't exist
        overlay.onerror = function() {
            this.style.backgroundColor = 'rgba(140, 82, 255, 0.3)';
            this.style.backdropFilter = 'blur(5px)';
            this.style.display = 'flex';
            this.style.justifyContent = 'center';
            this.style.alignItems = 'center';
            this.innerHTML = '<div style="text-align:center;"><i class="fas fa-sign-language" style="font-size:32px;margin-bottom:10px;"></i><p>Sign Language Overlay</p></div>';
        };
        
        if (playerContainer) {
            playerContainer.style.position = 'relative';
            playerContainer.appendChild(overlay);
            overlayActive = true;
        }
    }
    
    function extractYoutubeId(url) {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : null;
    }
    
    function showError(message) {
        if (placeholder) {
            placeholder.innerHTML = `
                <i class="fas fa-exclamation-circle text-red-500 text-6xl mb-4"></i>
                <p class="text-xl text-text-muted text-center">${message}</p>
                <p class="text-sm text-text-muted text-center mt-2">Please try again with a valid YouTube URL</p>
            `;
            
            // Restore the placeholder after error
            placeholder.style.display = 'flex';
        }
    }
});

// Make YT available globally
window.onYouTubeIframeAPIReady = function() {
    // YouTube API is ready
    console.log('YouTube API ready');
};