// 1. Fix the showCurrentSignIndicator function to make notifications appear briefly
function showCurrentSignIndicator(word) {
    // Remove any existing indicators
    document.querySelectorAll('.current-sign-indicator').forEach(el => el.remove());
    
    // Create the indicator element
    const indicator = document.createElement('div');
    indicator.className = 'current-sign-indicator';
    indicator.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 100, 0, 0.8);
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        z-index: 9999;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        text-align: center;
        direction: rtl; /* For Arabic text */
        border: 2px solid white;
        min-width: 100px;
        opacity: 0;
        transition: opacity 0.3s, transform 0.3s;
        transform: translateY(-10px);
    `;
    
    // Add content
    indicator.innerHTML = `
        <span style="font-size: 12px; margin-bottom: 3px; display: block;">إشارة:</span>
        <span style="font-size: 16px; font-weight: bold;">${word}</span>
    `;
    
    // Add to the document
    document.body.appendChild(indicator);
    
    // Animate in
    setTimeout(() => {
        indicator.style.opacity = '1';
        indicator.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after a shorter time (1.5 seconds)
    setTimeout(() => {
        indicator.style.opacity = '0';
        indicator.style.transform = 'translateY(-10px)';
        setTimeout(() => indicator.remove(), 300);
    }, 1500); // Reduced from 3000 to 1500ms
}

// 2. Improve the emergency animation system with more natural movements
function startEmergencyAnimation() {
    console.log("Starting emergency animation to keep avatar moving");
    
    // Set flag that emergency animation is active
    window.emergencyAnimationActive = true;
    window.idleAnimationActive = false;
    
    // Create a subtle notification instead of a persistent red box
    showSubtleNotification("جاري تشغيل الإشارات التلقائية");
    
    // List of basic SIGML commands that can animate the avatar even without database
    // More varied and natural-looking movements
    const basicAnimations = [
        // Greeting wave
        '<sigml><hamgestural_sign><sign_manual><handconfig handshape="flat"/><handconfig extfidir="u"/><handconfig palmor="l"/><location_bodyarm location="shoulders" side="right_beside"/><par_motion><directedmotion direction="r" size="small"/><tgt_motion><changeposture/><handconfig extfidir="ur"/></tgt_motion></par_motion></sign_manual></hamgestural_sign></sigml>',
        
        // Nodding motion
        '<sigml><hamgestural_sign><sign_nonmanual><head_movement movement="NO"/></sign_nonmanual><sign_manual></sign_manual></hamgestural_sign></sigml>',
        
        // Hand to chest gesture
        '<sigml><hamgestural_sign><sign_manual><handconfig handshape="flat"/><handconfig extfidir="u"/><handconfig palmor="l"/><location_bodyarm location="chest" contact="touch"/><directedmotion direction="o" size="small"/></sign_manual></hamgestural_sign></sigml>',
        
        // Pointing gesture
        '<sigml><hamgestural_sign><sign_manual><handconfig handshape="finger2"/><handconfig extfidir="o"/><handconfig palmor="d"/><location_bodyarm location="chest" side="right_beside"/><directedmotion direction="o" size="small"/></sign_manual></hamgestural_sign></sigml>',
        
        // Hand raise gesture
        '<sigml><hamgestural_sign><sign_manual><handconfig handshape="flat"/><handconfig extfidir="u"/><handconfig palmor="u"/><location_bodyarm location="shoulders" side="right_at"/><directedmotion direction="u" size="small"/></sign_manual></hamgestural_sign></sigml>'
    ];
    
    let animationIndex = 0;
    
    // Function to play the next animation
    function playNextAnimation() {
        // Only continue if emergency animation is still active
        if (!window.emergencyAnimationActive) {
            return;
        }
        
        try {
            if (typeof CWASA !== 'undefined') {
                if (typeof CWASA.stop === 'function') {
                    CWASA.stop();
                }
                
                // Try to use direct SIGML if we can't access files
                if (typeof CWASA.playSiGML === 'function') {
                    CWASA.playSiGML(basicAnimations[animationIndex]);
                    console.log("Playing emergency animation", animationIndex + 1);
                    
                    // Show a minimal indicator of what's happening
                    const animationNames = ["إيماءة", "إشارة", "حركة", "تعبير", "إشارة"];
                    showCurrentSignIndicator(`${animationNames[animationIndex]}`);
                }
            }
            
            // Increment index with wrap-around
            animationIndex = (animationIndex + 1) % basicAnimations.length;
            
            // Vary the timing to make it look more natural (2-4 seconds)
            const nextDelay = 2000 + Math.floor(Math.random() * 2000);
            
            // Schedule next animation
            window.emergencyAnimationTimeout = setTimeout(playNextAnimation, nextDelay);
        } catch (e) {
            console.error("Error in emergency animation:", e);
            // Still try to continue with a longer delay
            window.emergencyAnimationTimeout = setTimeout(playNextAnimation, 5000);
        }
    }
    
    // Start the animation loop
    playNextAnimation();
    
    // After 30 seconds, try to recover by loading available words again
    setTimeout(() => {
        if (window.emergencyAnimationActive) {
            console.log("Attempting recovery from emergency animation mode");
            loadAvailableWords();
            
            // Check if we recovered any words
            setTimeout(() => {
                if (availableWords.length > 0) {
                    console.log("Recovery successful, switching to idle animation");
                    stopEmergencyAnimation();
                    startIdleAnimation();
                }
            }, 5000);
        }
    }, 30000);
}

// 3. Add a function to stop emergency animation
function stopEmergencyAnimation() {
    if (window.emergencyAnimationActive) {
        console.log("Stopping emergency animation");
        window.emergencyAnimationActive = false;
        
        if (window.emergencyAnimationTimeout) {
            clearTimeout(window.emergencyAnimationTimeout);
            window.emergencyAnimationTimeout = null;
        }
        
        // Stop any ongoing animation
        if (typeof CWASA !== 'undefined' && typeof CWASA.stop === 'function') {
            CWASA.stop();
        }
    }
}

// 4. Improve the showSubtleNotification function
function showSubtleNotification(message, duration = 2000) {
    // Remove any existing notifications with the same class
    document.querySelectorAll('.subtle-notification').forEach(elem => {
        elem.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'subtle-notification';
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 9999;
        transition: opacity 0.3s, transform 0.3s;
        opacity: 0;
        max-width: 80%;
        text-align: center;
        direction: rtl; /* For Arabic text */
        transform: translateY(10px);
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
    `;
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Fade in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(10px)';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// 5. Improve the findPartialMatches function to be more accurate
function findPartialMatches(word, callback) {
    // Wait for available words to be loaded if needed
    if (availableWords.length === 0) {
        if (!isLoadingAvailableWords) {
            loadAvailableWords();
        }
        // Retry after a delay
        setTimeout(() => findPartialMatches(word, callback), 1000);
        return;
    }
    
    const matches = [];
    const normalizedWord = normalizeArabic(word.toLowerCase());
    
    // 1. Check for exact match first (as a double-check)
    if (availableWords.includes(word)) {
        console.log(`Found exact match for: ${word}`);
        matches.push(word);
        // If we have an exact match, return it immediately
        callback(matches);
        return;
    }
    
    // 2. Check if this word is a known compound with a directly mappable part
    for (const [baseWord, compounds] of Object.entries(wordRelationships)) {
        // Skip boolean flags (prefixes/suffixes)
        if (typeof compounds === 'boolean') continue;
        
        // If the word is in the list of compounds for this base word
        if (Array.isArray(compounds) && compounds.some(c => {
            const normalizedCompound = normalizeArabic(c);
            return normalizedCompound === normalizedWord || 
                   normalizedWord.includes(normalizedCompound) ||
                   normalizedCompound.includes(normalizedWord);
        })) {
            // Check if the base word exists in our available words
            if (availableWords.includes(baseWord)) {
                console.log(`Found compound word match: ${word} -> ${baseWord}`);
                if (!matches.includes(baseWord)) matches.push(baseWord);
            }
        }
    }
    
    // If we found good compound matches, return them immediately
    if (matches.length > 0) {
        callback(matches);
        return;
    }
    
    // 3. Check if the word contains any of our available words (prioritize longer words)
    for (const availableWord of availableWords) {
        // Skip very short words (1-2 chars) for contains check to avoid too many matches
        if (availableWord.length <= 2) continue;
        
        const normalizedAvailable = normalizeArabic(availableWord);
        
        // Check if the available word is contained in our target word
        if (normalizedWord.includes(normalizedAvailable)) {
            console.log(`Word "${word}" contains available sign "${availableWord}"`);
            if (!matches.includes(availableWord)) matches.push(availableWord);
            
            // Limit to 3 matches to avoid too much signing, but prioritize longer matches
            matches.sort((a, b) => b.length - a.length);
            if (matches.length > 3) matches.length = 3;
        }
    }
    
    // If we found good contained words, return them
    if (matches.length > 0) {
        callback(matches);
        return;
    }
    
    // 4. Check if any of the common prefixes/suffixes match
    for (const [prefix, isCommon] of Object.entries(wordRelationships)) {
        // Only check entries that are marked as true (common prefix/suffix)
        if (isCommon !== true) continue;
        
        // Check if prefix/suffix is in our word and available
        if (normalizedWord.includes(prefix) && availableWords.includes(prefix)) {
            console.log(`Found common prefix/suffix in word: ${word} contains ${prefix}`);
            if (!matches.includes(prefix)) matches.push(prefix);
            
            // Limit to 2 prefixes/suffixes
            if (matches.length >= 2) break;
        }
    }
    
    // If we found prefix/suffix matches, return them
    if (matches.length > 0) {
        callback(matches);
        return;
    }
    
    // 5. Check if our word is contained in any available words
    if (normalizedWord.length >= 3) {
        for (const availableWord of availableWords) {
            const normalizedAvailable = normalizeArabic(availableWord);
            
            // Check if our word is contained in any available word
            if (normalizedAvailable.includes(normalizedWord)) {
                console.log(`Available word "${availableWord}" contains our word "${word}"`);
                if (!matches.includes(availableWord)) matches.push(availableWord);
                
                // Limit to 3 matches
                if (matches.length >= 3) break;
            }
        }
    }
    
    // If we found containing matches, return them
    if (matches.length > 0) {
        callback(matches);
        return;
    }
    
    // 6. If we still have no matches, check using edit distance to find similar words
    if (normalizedWord.length >= 2) {
        const similarWords = findSimilarWords(normalizedWord, availableWords, 2);
        if (similarWords.length > 0) {
            console.log(`Found similar words for "${word}": ${similarWords.join(', ')}`);
            matches.push(...similarWords);
        }
    }
    
    callback(matches);
}

// 6. Improve the startIdleAnimation function for more natural idle behavior
function startIdleAnimation() {
    // Cancel any existing idle animation
    if (window.idleAnimationInterval) {
        clearInterval(window.idleAnimationInterval);
    }
    
    // Cancel any emergency animation
    stopEmergencyAnimation();
    
    // Set flag that idle animation is active
    window.idleAnimationActive = true;
    
    console.log("Starting idle animation for avatar");
    
    // Show a subtle notification initially
    showSubtleNotification("وضع الانتظار - الإشارات العشوائية", 1500);
    
    // Check if we have available words - if not, load them first
    if (availableWords.length === 0) {
        console.log("No available words for idle animation, loading them");
        loadAvailableWords();
    }
    
    let consecutiveErrors = 0;
    const maxConsecutiveErrors = 3;
    
    // List of common expressions for natural idle state
    const commonExpressions = ["نعم", "مرحبا", "شكرا", "أنا", "هنا"];
    
    // Function to pick a good idle sign
    function pickIdleSign() {
        // First try common expressions
        if (availableWords.length > 0) {
            for (const expr of commonExpressions) {
                if (availableWords.includes(expr)) {
                    return expr;
                }
            }
        }
        
        // Fall back to random word if common expressions not available
        if (availableWords.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableWords.length);
            return availableWords[randomIndex];
        }
        
        // Return null if no words available
        return null;
    }
    
    // Create a subtle pattern of random signs at varied intervals
    function scheduleNextIdleAnimation() {
        // Only continue if idle animation is still active
        if (!window.idleAnimationActive) {
            return;
        }
        
        try {
            // Pick a sign to show
            const sign = pickIdleSign();
            
            if (sign) {
                console.log(`Idle animation: signing ${sign}`);
                playSiGMLWithCorrectPath(sign);
                consecutiveErrors = 0;
            } else {
                consecutiveErrors++;
                console.warn(`No idle sign available, error count: ${consecutiveErrors}`);
                
                // If we've had too many errors, try emergency mode
                if (consecutiveErrors >= maxConsecutiveErrors) {
                    console.error("Too many consecutive errors, switching to emergency animation");
                    stopIdleAnimation();
                    startEmergencyAnimation();
                    return;
                }
            }
            
            // Schedule next animation with a varied interval (3-8 seconds)
            // More natural than regular intervals
            const nextInterval = 3000 + Math.floor(Math.random() * 5000);
            window.idleAnimationTimeout = setTimeout(scheduleNextIdleAnimation, nextInterval);
            
        } catch (e) {
            console.error("Error in idle animation:", e);
            consecutiveErrors++;
            
            // If we've had too many errors, try emergency mode
            if (consecutiveErrors >= maxConsecutiveErrors) {
                console.error("Too many errors in idle animation, switching to emergency animation");
                stopIdleAnimation();
                startEmergencyAnimation();
                return;
            }
            
            // Try again after a delay
            window.idleAnimationTimeout = setTimeout(scheduleNextIdleAnimation, 5000);
        }
    }
    
    // Start the idle animation
    scheduleNextIdleAnimation();
}

// 7. Improve the stop idle animation function
function stopIdleAnimation() {
    if (window.idleAnimationInterval) {
        clearInterval(window.idleAnimationInterval);
        window.idleAnimationInterval = null;
    }
    
    if (window.idleAnimationTimeout) {
        clearTimeout(window.idleAnimationTimeout);
        window.idleAnimationTimeout = null;
    }
    
    window.idleAnimationActive = false;
    console.log("Idle animation stopped");
}

// 8. Add a function to handle network issues when checking file existence
function checkFileExistsWithRetry(url, callback, retries = 2, delay = 500) {
    const xhr = new XMLHttpRequest();
    xhr.open('HEAD', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            callback(xhr.status === 200);
        }
    };
    xhr.onerror = function() {
        console.error(`Error checking file: ${url}`);
        if (retries > 0) {
            console.log(`Retrying (${retries} left)...`);
            setTimeout(() => {
                checkFileExistsWithRetry(url, callback, retries - 1, delay);
            }, delay);
        } else {
            callback(false);
        }
    };
    xhr.send();
}

// 9. Replace all instances of checkFileExists with checkFileExistsWithRetry
// (You'll need to manually replace all instances in your actual code)

// 10. Improve signIndividualCharacters to handle characters better
function signIndividualCharacters(word) {
    if (!word) return;
    
    // Display notification
    showSubtleNotification(`محاولة عرض الإشارات للأحرف: ${word}`);
    
    // Special handling for digits
    if (/^\d+$/.test(word)) {
        const digits = word.split('');
        console.log(`Signing number: ${word}`);
        
        // Create a prefix sign for numbers
        const numberSigns = digits.map(d => `${d}`); // Convert to string format
        playSignsSequentially(numberSigns, 0, () => {
            // Start idle animation after signing digits
            startIdleAnimation();
        });
        return;
    }
    
    // For Arabic text
    const chars = word.split('');
    let validChars = [];
    
    // Find the valid characters (those with SIGML files)
    function checkNextChar(index) {
        if (index >= chars.length) {
            // All characters checked, play the valid ones
            if (validChars.length > 0) {
                console.log(`Signing characters: ${validChars.join(', ')}`);
                playSignsSequentially(validChars, 0, () => {
                    // Start idle animation after character signing is done
                    startIdleAnimation();
                });
                
                // Show what we're doing
                const charPercentage = Math.floor((validChars.length / chars.length) * 100);
                showSubtleNotification(
                    `تم عرض ${validChars.length} من أصل ${chars.length} حرف (${charPercentage}%)`, 
                    2000
                );
            } else {
                console.warn("No valid characters found to sign");
                showSubtleNotification("لم يتم العثور على حروف قابلة للإشارة");
                startRandomSigning(word);
            }
            return;
        }
        
        const char = chars[index];
        const sigmlURL = SIGML_PATH + char + ".sigml";
        
        checkFileExistsWithRetry(sigmlURL, (exists) => {
            if (exists) {
                validChars.push(char);
            }
            checkNextChar(index + 1);
        });
    }
    
    // Start checking characters
    checkNextChar(0);
}