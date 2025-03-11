document.addEventListener('DOMContentLoaded', function() {

    let tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    let player;
    const loadVideoBtn = document.getElementById('load-video');
    const youtubeUrlInput = document.getElementById('youtube-url');
    const videoPlaceholder = document.getElementById('video-placeholder');
    const videoPlayer = document.getElementById('video-player');

    window.onYouTubeIframeAPIReady = function() {
        console.log('YouTube API Ready');
    };

    if (loadVideoBtn) {
        loadVideoBtn.addEventListener('click', function() {
            const url = youtubeUrlInput.value.trim();
            if (!url) {
                alert('الرجاء إدخال رابط فيديو صحيح');
                return;
            }

            let videoId;
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = url.match(regExp);

            if (match && match[2].length == 11) {
                videoId = match[2];
                loadYouTubeVideo(videoId);
            } else {
                alert('الرجاء إدخال رابط يوتيوب صحيح');
            }
        });
    }

    function loadYouTubeVideo(videoId) {
        if (videoPlaceholder) {
            videoPlaceholder.style.display = 'none';
        }

        if (player) {
            player.destroy();
        }

        player = new YT.Player('video-player', {
            videoId: videoId,
            playerVars: {
                'playsinline': 1,
                'controls': 1,
                'rel': 0
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }

    function onPlayerReady(event) {
        console.log('Player Ready');

        showMessage('جاري معالجة الفيديو وتحويل التعليق الصوتي إلى لغة الإشارة...');

        setTimeout(() => {
            showMessage('عذراً، هذه نسخة تجريبية. سيتم إضافة وظائف الذكاء الاصطناعي لاحقاً.');

            setTimeout(() => {
                hideMessage();
                event.target.playVideo();
            }, 2000);
        }, 3000);
    }

    function onPlayerStateChange(event) {
        // Handle player state changes if needed
    }

    function showMessage(message) {
        hideMessage();

        let messageElement = document.createElement('div');
        messageElement.id = 'ai-message';
        messageElement.className = 'overlay-message';
        messageElement.innerHTML = `<div class="p-5 text-xl text-center text-white">${message}</div>`;

        const videoContainer = document.querySelector('.aspect-video');
        if (videoContainer) {
            videoContainer.appendChild(messageElement);
        }
    }

    function hideMessage() {
        const messageElement = document.getElementById('ai-message');
        if (messageElement) {
            messageElement.remove();
        }
    }
});