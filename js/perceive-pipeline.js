// Add this code at the top of the file
(function() {
    // Clear any stored transcription data on page load
    window.addEventListener('load', function() {
        // Clear localStorage
        localStorage.removeItem('perceiveAI_transcription');
        localStorage.removeItem('perceiveAI_segments');
        localStorage.removeItem('perceiveAI_lastVideo');
        
        // Clear sessionStorage
        sessionStorage.removeItem('perceiveAI_transcription');
        sessionStorage.removeItem('perceiveAI_segments');
        
        console.log("✓ Transcription cache cleared");
        
        // Ensure we don't persist transcriptions
        overrideStorageFunctions();
    });
    
    function overrideStorageFunctions() {
        // Override localStorage setItem to prevent transcription storage
        const originalSetItem = Storage.prototype.setItem;
        Storage.prototype.setItem = function(key, value) {
            if (key.includes('transcription') || key.includes('segments')) {
                console.log("⚠️ Blocking transcription storage:", key);
                return;
            }
            originalSetItem.call(this, key, value);
        };
        
        // Override updateTranscriptionDisplay to avoid storage
        if (window.updateTranscriptionDisplay) {
            const originalUpdate = window.updateTranscriptionDisplay;
            window.updateTranscriptionDisplay = function(text, isAppend = false) {
                const transcriptionContent = document.getElementById('transcription-content');
                
                if (!transcriptionContent) return;
                
                if (isAppend) {
                    // Only append, never store
                    const p = document.createElement('p');
                    p.textContent = text;
                    p.className = 'transcription-segment py-1';
                    transcriptionContent.appendChild(p);
                    
                    // Scroll to bottom
                    transcriptionContent.scrollTop = transcriptionContent.scrollHeight;
                } else {
                    // Complete replacement, no storage
                    transcriptionContent.innerHTML = '';
                    const p = document.createElement('p');
                    p.textContent = text;
                    transcriptionContent.appendChild(p);
                }
                
                // Process for sign language but don't store it
                if (typeof processTextForSignLanguage === 'function') {
                    processTextForSignLanguage(text);
                }
            };
        }
    }
})();

// Add a warning when user tries to navigate away or refresh
window.addEventListener('beforeunload', function(e) {
    // Check if there's active transcription
    const transcriptionContent = document.getElementById('transcription-content');
    if (transcriptionContent && transcriptionContent.innerText.trim() !== '' && 
        transcriptionContent.innerText !== 'في انتظار تحميل الفيديو لاستخراج النص...') {
        
        // Standard way to show a warning
        const message = "ستفقد النص المترجم عند تحديث الصفحة. هل أنت متأكد؟";
        (e || window.event).returnValue = message;
        return message;
    }
});