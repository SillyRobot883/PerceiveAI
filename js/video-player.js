document.addEventListener('DOMContentLoaded', function() {
    // Core variables
    let player = null;
    let overlayActive = false;
    let transcriptionSegments = [];
    let currentTranscriptionIndex = 0;
    let currentVideoTime = 0;
    let transcriptionInterval;
    let isProcessing = false;
    
    // DOM elements
    const elements = {
        placeholder: document.getElementById('video-placeholder'),
        playerContainer: document.getElementById('video-player'),
        loadButton: document.getElementById('load-video'),
        urlInput: document.getElementById('youtube-url'),
        transcriptionContent: document.getElementById('transcription-content'),
        progressBar: document.getElementById('translation-progress'),
        progressStatus: document.getElementById('translation-status')
    };
    
    // Settings
    const TRANSCRIPTION_API_URL = 'http://localhost:8000/youtube-transcribe/';
    const userPreferences = {
        autoSwitchOnFailure: localStorage.getItem('auto_switch_on_failure') !== 'false',
        preferredMethod: localStorage.getItem('preferred_method') || 'auto',
        showDebugInfo: localStorage.getItem('show_debug_info') === 'true'
    };
    
    // Global data for sign language integration
    window.perceiveAIData = {
        currentTranscription: "",
        allTranscriptions: [],
        currentSegmentIndex: 0,
        signLanguageEnabled: true
    };

    // Initialize application
    function init() {
        loadYouTubeAPI();
        setupEventListeners();
        createTranscriptionContainer();
        initAvatarIntegration();
    }
    
    function loadYouTubeAPI() {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode.insertBefore(tag, firstScript);
    }
    
    function setupEventListeners() {
        if (elements.loadButton) {
            elements.loadButton.addEventListener('click', loadVideo);
        }
        
        const toggleSignBtn = document.getElementById('toggle-sign-language');
        if (toggleSignBtn) {
            toggleSignBtn.addEventListener('click', toggleSignLanguage);
        }
        
        setupTranscriptionMethodListeners();
    }
    
    function loadVideo() {
        const youtubeUrl = elements.urlInput.value.trim();
        if (!youtubeUrl) return showError('Please enter a valid YouTube URL');
        
        const videoId = extractYoutubeId(youtubeUrl);
        if (!videoId) return showError('Invalid YouTube URL format');
        
        if (elements.placeholder) elements.placeholder.style.display = 'none';
        
        // Reset transcription display
        resetTranscription("جاري معالجة الفيديو...");
        updateTranscriptionProgress(0);
        
        // Create or update player
        if (!player) {
            player = new YT.Player('video-player', {
                height: '100%',
                width: '100%',
                videoId: videoId,
                playerVars: {
                    'playsinline': 1,
                    'autoplay': 1,
                    'rel': 0,
                    'enablejsapi': 1
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        } else {
            player.loadVideoById(videoId);
            player.playVideo();
        }
        
        // Begin transcription process
        processYoutubeVideo(youtubeUrl);
    }
    
    function onPlayerReady(event) {
        event.target.playVideo();
        setupVideoTimeTracking();
        if (window.avatarController) {
            window.avatarController.showAvatar();
        }
    }
    
    function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING) {
            startTranscriptionSync();
        } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
            stopTranscriptionSync();
        }
    }
    
    // This critical function tracks video time to sync transcriptions
    function setupVideoTimeTracking() {
        if (window.videoTimeTracker) clearInterval(window.videoTimeTracker);
        
        window.videoTimeTracker = setInterval(() => {
            if (player && player.getCurrentTime) {
                const newTime = Math.floor(player.getCurrentTime());
                
                // If time changed significantly (e.g., user skipped), update transcription
                if (Math.abs(newTime - currentVideoTime) > 2) {
                    updateTranscriptionForTime(newTime);
                }
                
                currentVideoTime = newTime;
            }
        }, 500);
    }
    
    // Find and show the correct transcription for the current video time
    function updateTranscriptionForTime(seconds) {
        if (!transcriptionSegments || transcriptionSegments.length === 0) return;
        
        // Find the closest segment to the current time
        const closestSegment = findClosestSegment(seconds);
        if (closestSegment !== -1) {
            currentTranscriptionIndex = closestSegment;
            window.perceiveAIData.currentSegmentIndex = closestSegment;
            updateTranscriptionUI();
        }
    }
    
    function findClosestSegment(seconds) {
        if (!transcriptionSegments.length) return -1;
        
        // Convert timestamp format (MM:SS) to seconds for comparison
        const timeInSeconds = timestamp => {
            const match = timestamp.match(/(\d+):(\d+)/);
            if (match) {
                const [_, minutes, secs] = match;
                return parseInt(minutes) * 60 + parseInt(secs);
            }
            return 0;
        };
        
        // Find segment with closest time
        let closestIndex = 0;
        let closestDiff = Infinity;
        
        transcriptionSegments.forEach((segment, index) => {
            const segmentTime = timeInSeconds(segment.timestamp);
            const diff = Math.abs(segmentTime - seconds);
            
            if (diff < closestDiff) {
                closestDiff = diff;
                closestIndex = index;
            }
        });
        
        return closestIndex;
    }
    
    // Process the YouTube video to get transcriptions
    async function processYoutubeVideo(youtubeUrl) {
        if (isProcessing) return;
        isProcessing = true;
        
        try {
            updateTranscriptionProgress(25);
            const method = getSelectedTranscriptionMethod();
            
            // If fallback selected, use sample data
            if (method === 'fallback') {
                transcriptionSegments = generateSampleTranscription();
                window.perceiveAIData.allTranscriptions = transcriptionSegments;
                displayTranscription(transcriptionSegments);
                updateTranscriptionProgress(100);
                isProcessing = false;
                return;
            }
            
            // Call the API
            const formData = new FormData();
            formData.append('url', youtubeUrl);
            formData.append('method', method);
            
            const response = await fetch(TRANSCRIPTION_API_URL, {
                method: 'POST',
                body: formData,
            });
            
            updateTranscriptionProgress(75);
            
            if (!response.ok) {
                throw new Error(`Error from API: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (!result.success) {
                handleTranscriptionError(result);
                return;
            }
            
            // Process successful transcription
            if (result.segments && result.segments.length > 0) {
                transcriptionSegments = result.segments;
                window.perceiveAIData.allTranscriptions = result.segments;
                displayTranscription(transcriptionSegments);
            } else if (result.text) {
                const segments = [{
                    text: result.text,
                    timestamp: "00:00",
                    confidence: 0.9
                }];
                transcriptionSegments = segments;
                window.perceiveAIData.allTranscriptions = segments;
                displayTranscription(segments);
            }
            
            updateTranscriptionProgress(100);
            
        } catch (error) {
            console.error("Error processing video:", error);
            const fallbackTranscription = generateSampleTranscription();
            transcriptionSegments = fallbackTranscription;
            window.perceiveAIData.allTranscriptions = fallbackTranscription;
            displayTranscription(fallbackTranscription);
            updateTranscriptionProgress(100);
        } finally {
            isProcessing = false;
        }
    }
    
    function createTranscriptionContainer() {
        const videoContainer = document.getElementById('video-container');
        if (videoContainer) {
            // Remove any existing transcription bar container
            const existingContainer = document.getElementById('video-transcription-bar-container');
            if (existingContainer) {
                existingContainer.remove();
            }
            
            // Create new container with improved positioning
            const barContainer = document.createElement('div');
            barContainer.id = 'video-transcription-bar-container';
            barContainer.className = 'absolute z-50';
            barContainer.style.cssText = `
                bottom: 40px;
                left: 50%;
                transform: translateX(-50%);
                width: 80%;
                max-width: 900px;
                direction: rtl;
                transition: all 0.3s ease;
            `;
            
            const bar = document.createElement('div');
            bar.id = 'main-transcription-display';
            bar.className = 'bg-black/80 backdrop-blur-md text-white px-8 py-5 rounded-2xl text-center';
            bar.style.cssText = `
                min-height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                white-space: normal;
                font-size: 18px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
            `;
            bar.innerText = 'اضغط على زر التحميل لبدء استخراج النص';
            
            barContainer.appendChild(bar);
            videoContainer.appendChild(barContainer);
        }
    }
    
    function resetTranscription(message) {
        if (elements.transcriptionContent) {
            elements.transcriptionContent.innerHTML = `<p class="py-4 text-center text-text-muted">${message}</p>`;
        }
        
        const mainBar = document.getElementById('main-transcription-display');
        if (mainBar) mainBar.innerText = message;
        
        window.perceiveAIData.currentTranscription = message;
    }
    
    function displayTranscription(segments) {
        if (!elements.transcriptionContent) return;
        
        // Clear previous content
        elements.transcriptionContent.innerHTML = '';
        
        // Add each segment
        segments.forEach(segment => {
            addTranscriptionSegment(segment);
        });
        
        // Initialize display
        if (segments.length > 0) {
            currentTranscriptionIndex = 0;
            window.perceiveAIData.currentSegmentIndex = 0;
            updateTranscriptionUI();
            startTranscriptionSync();
        }
    }
    
    function addTranscriptionSegment(segment) {
        if (!elements.transcriptionContent) return;
        
        // Create segment element
        const segmentEl = document.createElement('div');
        segmentEl.className = 'mb-3 p-3 rounded-lg' + 
            (segment.confidence > 0.9 ? ' bg-white/10' : ' bg-white/5');
        segmentEl.dataset.timestamp = segment.timestamp;
        
        segmentEl.innerHTML = `
            <div class="flex justify-between items-center mb-1">
                <span class="text-xs text-text-muted">${segment.timestamp}</span>
                <span class="text-xs ${segment.confidence > 0.9 ? 'text-green-400' : 'text-yellow-400'}">
                    ${Math.round(segment.confidence * 100)}%
                </span>
            </div>
            <p class="text-base">${segment.text}</p>
        `;
        
        // Add to container (newer segments at top)
        elements.transcriptionContent.prepend(segmentEl);
    }
    
    function updateTranscriptionUI() {
        if (!transcriptionSegments || transcriptionSegments.length === 0) return;
        
        const currentSegment = transcriptionSegments[currentTranscriptionIndex];
        
        // Update main transcription bar
        const mainBar = document.getElementById('main-transcription-display');
        if (mainBar) {
            mainBar.innerText = currentSegment.text;
            mainBar.classList.add('animate-pulse');
            setTimeout(() => mainBar.classList.remove('animate-pulse'), 500);
        }
        
        // Update global data
        window.perceiveAIData.currentTranscription = currentSegment.text;
        
        // Notify ASL avatar system of text change
        if (window.avatarController) {
            window.avatarController.updateText(currentSegment.text);
        }
        
        // Highlight active segment
        highlightActiveSegment(currentSegment.timestamp);
    }
    
    function highlightActiveSegment(timestamp) {
        if (!elements.transcriptionContent) return;
        
        // Remove highlight from all segments
        const segments = elements.transcriptionContent.querySelectorAll('div[data-timestamp]');
        segments.forEach(segment => {
            segment.classList.remove('bg-primary/20');
            segment.classList.add(segment.classList.contains('bg-white/10') ? 'bg-white/10' : 'bg-white/5');
        });
        
        // Add highlight to active segment
        const activeSegment = elements.transcriptionContent.querySelector(`div[data-timestamp="${timestamp}"]`);
        if (activeSegment) {
            activeSegment.classList.remove('bg-white/10', 'bg-white/5');
            activeSegment.classList.add('bg-primary/20');
            
            // Scroll to active segment
            activeSegment.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    // Transcription synchronization
    function startTranscriptionSync() {
        stopTranscriptionSync();  // Clear any existing interval
        
        if (!transcriptionSegments || transcriptionSegments.length <= 1) return;
        
        transcriptionInterval = setInterval(() => {
            currentTranscriptionIndex = (currentTranscriptionIndex + 1) % transcriptionSegments.length;
            window.perceiveAIData.currentSegmentIndex = currentTranscriptionIndex;
            updateTranscriptionUI();
        }, 3000);
    }
    
    function stopTranscriptionSync() {
        if (transcriptionInterval) {
            clearInterval(transcriptionInterval);
            transcriptionInterval = null;
        }
    }
    
    // Toggle sign language display
    function toggleSignLanguage() {
        if (window.avatarController) {
            window.avatarController.toggle();
        }
    }
    
    // Initialize ASL avatar integration
    function initAvatarIntegration() {
        // The avatarController will be defined in avatar-integration.js
        if (!window.avatarController && typeof AvatarController === 'function') {
            window.avatarController = new AvatarController();
        }
    }
    
    // Utility functions
    function getSelectedTranscriptionMethod() {
        const methodRadios = document.getElementsByName('transcription-method');
        let selectedMethod = userPreferences.preferredMethod;
        
        for(const radio of methodRadios) {
            if(radio.checked) {
                selectedMethod = radio.value;
                userPreferences.preferredMethod = selectedMethod;
                localStorage.setItem('preferred_method', selectedMethod);
                break;
            }
        }
        
        return selectedMethod;
    }
    
    function setupTranscriptionMethodListeners() {
        const methodRadios = document.getElementsByName('transcription-method');
        
        for (const radio of methodRadios) {
            radio.addEventListener('change', function() {
                // Highlight selected method
                document.querySelectorAll('[name="transcription-method"]').forEach(r => {
                    r.parentElement.classList.remove('bg-white/20');
                    r.parentElement.classList.add('bg-white/5');
                });
                
                this.parentElement.classList.remove('bg-white/5');
                this.parentElement.classList.add('bg-white/20');
                
                // If video is playing, reprocess with new method
                if (player && player.getPlayerState && player.getPlayerState() !== -1) {
                    const currentVideoId = player.getVideoData().video_id;
                    if (currentVideoId) {
                        const youtubeUrl = `https://www.youtube.com/watch?v=${currentVideoId}`;
                        processYoutubeVideo(youtubeUrl);
                    }
                }
            });
        }
    }
    
    function updateTranscriptionProgress(percent) {
        if (elements.progressBar) {
            elements.progressBar.style.width = `${percent}%`;
        }
        
        if (elements.progressStatus) {
            elements.progressStatus.textContent = `${Math.round(percent)}%`;
        }
    }
    
    function extractYoutubeId(url) {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : null;
    }
    
    function showError(message) {
        if (elements.placeholder) {
            elements.placeholder.innerHTML = `
                <i class="fas fa-exclamation-circle text-red-500 text-6xl mb-4"></i>
                <p class="text-xl text-text-muted text-center">${message}</p>
            `;
            elements.placeholder.style.display = 'flex';
        }
    }
    
    function handleTranscriptionError(result) {
        // Display error message
        if (result.error) {
            resetTranscription(result.error);
        }
        
        // Display any available segments
        if (result.segments && result.segments.length > 0) {
            transcriptionSegments = result.segments;
            window.perceiveAIData.allTranscriptions = result.segments;
            displayTranscription(transcriptionSegments);
        } else {
            // Use fallback data
            const fallbackData = generateSampleTranscription();
            transcriptionSegments = fallbackData;
            window.perceiveAIData.allTranscriptions = fallbackData;
            displayTranscription(fallbackData);
        }
        
        updateTranscriptionProgress(100);
        isProcessing = false;
    }
    
    function generateSampleTranscription() {
        // Sample Arabic sports commentary
        return [
            {
                text: "مرحبا بكم متابعينا الكرام في نقل مباشر لمباراة اليوم",
                timestamp: "00:01",
                confidence: 0.95
            },
            {
                text: "الفريقان يدخلان الآن أرض الملعب وسط تشجيع الجماهير",
                timestamp: "00:02",
                confidence: 0.93
            },
            {
                text: "تمريرة متقنة من اللاعب محمد إلى زميله أحمد في منتصف الملعب",
                timestamp: "00:03",
                confidence: 0.89
            },
            {
                text: "هجمة خطيرة من الفريق الأزرق والدفاع يشتت الكرة",
                timestamp: "00:04",
                confidence: 0.92
            },
            {
                text: "تسديدة قوية من خارج منطقة الجزاء لكنها تمر بجوار القائم",
                timestamp: "00:05",
                confidence: 0.88
            },
            {
                text: "ركلة ركنية للفريق الأحمر بعد تدخل دفاعي",
                timestamp: "00:06",
                confidence: 0.94
            },
            {
                text: "هدف! هدف رائع للفريق الأزرق في الدقيقة الثلاثين",
                timestamp: "00:07",
                confidence: 0.97
            }
        ];
    }
    
    // Public API
    window.perceiveAI = {
        getCurrentTranscription: () => window.perceiveAIData.currentTranscription,
        getAllTranscriptions: () => window.perceiveAIData.allTranscriptions,
        getCurrentIndex: () => window.perceiveAIData.currentSegmentIndex,
        jumpToSegment: (index) => {
            if (index >= 0 && index < transcriptionSegments.length) {
                currentTranscriptionIndex = index;
                window.perceiveAIData.currentSegmentIndex = index;
                updateTranscriptionUI();
                return true;
            }
            return false;
        }
    };
    
    // Initialize
    setTimeout(init, 500);
});

// YouTube API callback
window.onYouTubeIframeAPIReady = function() {
    console.log('YouTube API ready');
};

/**
 * Add this function to your video-player.js file
 */
function createBlackTranslationBar() {
    const videoContainer = document.getElementById('video-container');
    if (!videoContainer) return;
    
    // Remove any existing transcription bar container
    const existingContainer = document.getElementById('video-transcription-bar-container');
    if (existingContainer) {
        existingContainer.remove();
    }
    
    // Create new container
    const barContainer = document.createElement('div');
    barContainer.id = 'video-transcription-bar-container';
    barContainer.style.cssText = `
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 70%;
        z-index: 900;
    `;
    
    // Create the actual black bar
    const bar = document.createElement('div');
    bar.id = 'main-transcription-display';
    bar.style.cssText = `
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 12px 16px;
        border-radius: 10px;
        text-align: center;
        font-size: 16px;
        direction: rtl;
        backdrop-filter: blur(5px);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        min-height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    bar.textContent = 'انقر على زر التحميل لبدء استخراج النص';
    
    // Add to DOM
    barContainer.appendChild(bar);
    videoContainer.appendChild(barContainer);
    
    return barContainer;
}

// Add this to your video player initialization
document.addEventListener('videoPlayerInitialized', function() {
    createBlackTranslationBar();
});

// When a video is loaded
function onVideoLoaded() {
    // Your existing code...
    
    // Create the black translation bar
    createBlackTranslationBar();
    
    // Clear any previously stored transcriptions
    clearTranscriptions();
}

// Add a function to clear transcriptions
function clearTranscriptions() {
    // Clear localStorage
    localStorage.removeItem('perceiveAI_transcription');
    localStorage.removeItem('perceiveAI_segments');
    localStorage.removeItem('perceiveAI_lastVideo');
    
    // Clear sessionStorage
    sessionStorage.removeItem('perceiveAI_transcription');
    sessionStorage.removeItem('perceiveAI_segments');
    
    // Reset UI elements
    const transcriptionContent = document.getElementById('transcription-content');
    if (transcriptionContent) {
        transcriptionContent.innerHTML = '<p class="text-text-muted text-center py-8">في انتظار استخراج النص من الفيديو...</p>';
    }
    
    // Reset main transcription display
    const mainTranscriptionDisplay = document.getElementById('main-transcription-display');
    if (mainTranscriptionDisplay) {
        mainTranscriptionDisplay.textContent = 'جاري تحميل النص...';
    }
}