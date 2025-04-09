/**
 * Enhanced Avatar Resizer
 * Provides robust resizing capabilities for the ASL Avatar
 */
(function() {
    console.log("Enhanced Avatar Resizer - Loading");
    
    // Initialize on load
    window.addEventListener('load', initEnhancedResizer);
    
    // Track initialization
    let initialized = false;
    
    function initEnhancedResizer() {
        if (initialized) return;
        
        console.log("Initializing Enhanced Avatar Resizer");
        
        // Add resizing styles first
        addResizingStyles();
        
        // Wait for avatar container to exist
        const checkInterval = setInterval(() => {
            const container = document.getElementById('asl-avatar-container');
            if (container) {
                clearInterval(checkInterval);
                setupResizableContainer(container);
                initialized = true;
                console.log("Enhanced Avatar Resizer Initialized");
            }
        }, 300);
        
        // Stop checking after 10 seconds
        setTimeout(() => {
            clearInterval(checkInterval);
        }, 10000);
    }
    
    function addResizingStyles() {
        // Remove any existing styles
        const existingStyle = document.getElementById('enhanced-resizer-styles');
        if (existingStyle) existingStyle.remove();
        
        // Create new style element
        const style = document.createElement('style');
        style.id = 'enhanced-resizer-styles';
        style.textContent = `
            /* Basic container styling */
            #asl-avatar-container {
                position: fixed !important;
                bottom: 20px !important;
                right: 20px !important;
                width: 650px !important;
                height: 700px !important;
                background-color: rgba(15, 17, 33, 0.85) !important;
                border-radius: 12px !important;
                border: 2px solid rgba(140, 82, 255, 0.8) !important;
                box-shadow: 0 0 20px rgba(140, 82, 255, 0.4) !important;
                overflow: hidden !important;
                z-index: 9999 !important;
                display: none;
                min-width: 300px !important;
                min-height: 350px !important;
                max-width: 95vw !important;
                max-height: 95vh !important;
            }
            
            /* Force iframe to fill container */
            #asl-avatar-frame {
                width: 100% !important;
                height: 100% !important;
                border: none !important;
            }
            
            /* Resizer handles */
            .avatar-resizer {
                position: absolute;
                z-index: 10001;
            }
            
            .avatar-resizer.corner {
                width: 20px;
                height: 20px;
                background-color: rgba(140, 82, 255, 0.3);
                border-radius: 50%;
                transition: background-color 0.2s;
            }
            
            .avatar-resizer.corner:hover {
                background-color: rgba(140, 82, 255, 0.7);
            }
            
            .avatar-resizer.top-left {
                top: 5px;
                left: 5px;
                cursor: nwse-resize;
            }
            
            .avatar-resizer.top-right {
                top: 5px;
                right: 5px;
                cursor: nesw-resize;
            }
            
            .avatar-resizer.bottom-left {
                bottom: 5px;
                left: 5px;
                cursor: nesw-resize;
            }
            
            .avatar-resizer.bottom-right {
                bottom: 5px;
                right: 5px;
                cursor: nwse-resize;
            }
            
            .avatar-resizer.edge {
                background-color: rgba(140, 82, 255, 0.1);
                transition: background-color 0.2s;
            }
            
            .avatar-resizer.edge:hover {
                background-color: rgba(140, 82, 255, 0.3);
            }
            
            .avatar-resizer.top {
                top: 0;
                left: 20px;
                right: 20px;
                height: 10px;
                cursor: ns-resize;
            }
            
            .avatar-resizer.right {
                top: 20px;
                bottom: 20px;
                right: 0;
                width: 10px;
                cursor: ew-resize;
            }
            
            .avatar-resizer.bottom {
                bottom: 0;
                left: 20px;
                right: 20px;
                height: 10px;
                cursor: ns-resize;
            }
            
            .avatar-resizer.left {
                top: 20px;
                bottom: 20px;
                left: 0;
                width: 10px;
                cursor: ew-resize;
            }
            
            /* Draggable header */
            .avatar-drag-handle {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 30px;
                cursor: move;
                z-index: 10000;
            }
            
            /* Size indicator */
            .avatar-size-display {
                position: absolute;
                bottom: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.6);
                color: white;
                padding: 5px 10px;
                border-radius: 20px;
                font-size: 12px;
                opacity: 0;
                transition: opacity 0.3s;
                pointer-events: none;
                z-index: 10002;
            }
            
            .avatar-size-display.visible {
                opacity: 1;
            }
            
            /* Resize tool controls */
            .avatar-resize-controls {
                position: absolute;
                bottom: 10px;
                left: 10px;
                display: flex;
                gap: 8px;
                z-index: 10002;
            }
            
            .avatar-resize-btn {
                width: 28px;
                height: 28px;
                border-radius: 6px;
                background: rgba(140, 82, 255, 0.4);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                cursor: pointer;
                transition: all 0.2s;
                border: none;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            }
            
            .avatar-resize-btn:hover {
                background: rgba(140, 82, 255, 0.7);
                transform: translateY(-2px);
            }
            
            /* When resizing */
            #asl-avatar-container.resizing {
                transition: none !important;
            }
            
            #asl-avatar-container.resizing iframe {
                pointer-events: none !important;
            }
            
            /* Keep top control buttons visible during resize */
            .avatar-top-controls {
                position: absolute;
                top: 5px;
                right: 5px;
                display: flex;
                gap: 5px;
                z-index: 10003;
            }
            
            .avatar-top-btn {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: rgba(0, 0, 0, 0.4);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
                border: none;
            }
            
            .avatar-top-btn:hover {
                background: rgba(0, 0, 0, 0.7);
            }
            
            /* Animation for resize guide */
            @keyframes pulse-border {
                0% { border-color: rgba(140, 82, 255, 0.4); }
                50% { border-color: rgba(140, 82, 255, 0.8); }
                100% { border-color: rgba(140, 82, 255, 0.4); }
            }
            
            .show-resize-guide #asl-avatar-container {
                animation: pulse-border 1.5s infinite;
            }
            
            /* Resize guide tooltip */
            .resize-guide {
                position: fixed;
                bottom: 75px;
                right: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 15px;
                border-radius: 10px;
                font-size: 14px;
                z-index: 10010;
                max-width: 250px;
                text-align: center;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.3s, transform 0.3s;
                pointer-events: none;
            }
            
            .resize-guide.show {
                opacity: 1;
                transform: translateY(0);
            }
            
            .resize-guide-dismiss {
                background: rgba(140, 82, 255, 0.6);
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 4px;
                margin-top: 8px;
                cursor: pointer;
                font-size: 12px;
            }
            
            .resize-guide-dismiss:hover {
                background: rgba(140, 82, 255, 0.8);
            }
        `;
        
        // Add to document
        document.head.appendChild(style);
    }
    
    function setupResizableContainer(container) {
        // Make sure container is properly initialized
        if (!container) return;
        
        // Remove native resize property which doesn't work well across browsers
        container.style.removeProperty('resize');
        
        // Add size indicator
        const sizeDisplay = document.createElement('div');
        sizeDisplay.className = 'avatar-size-display';
        container.appendChild(sizeDisplay);
        
        // Add resize handles
        addResizeHandles(container, sizeDisplay);
        
        // Make container draggable
        makeDraggable(container, sizeDisplay);
        
        // Add resize size presets
        addResizeControls(container, sizeDisplay);
        
        // Add top controls
        addTopControls(container);
        
        // Show resize guide
        showResizeGuide(container);
        
        console.log("Avatar container is now fully resizable");
    }
    
    function addResizeHandles(container, sizeDisplay) {
        // Corner handles
        const corners = [
            { class: 'top-left', x: -1, y: -1 },
            { class: 'top-right', x: 1, y: -1 },
            { class: 'bottom-left', x: -1, y: 1 },
            { class: 'bottom-right', x: 1, y: 1 }
        ];
        
        // Edge handles
        const edges = [
            { class: 'top', x: 0, y: -1 },
            { class: 'right', x: 1, y: 0 },
            { class: 'bottom', x: 0, y: 1 },
            { class: 'left', x: -1, y: 0 }
        ];
        
        // Create corner handles
        corners.forEach(corner => {
            const handle = document.createElement('div');
            handle.className = `avatar-resizer corner ${corner.class}`;
            container.appendChild(handle);
            
            handle.addEventListener('mousedown', function(e) {
                e.preventDefault();
                startResize(e, container, corner.x, corner.y, sizeDisplay);
            });
        });
        
        // Create edge handles
        edges.forEach(edge => {
            const handle = document.createElement('div');
            handle.className = `avatar-resizer edge ${edge.class}`;
            container.appendChild(handle);
            
            handle.addEventListener('mousedown', function(e) {
                e.preventDefault();
                startResize(e, container, edge.x, edge.y, sizeDisplay);
            });
        });
    }
    
    function startResize(e, container, dirX, dirY, sizeDisplay) {
        e.stopPropagation();
        
        // Initial mouse position
        const startX = e.clientX;
        const startY = e.clientY;
        
        // Initial container dimensions and position
        const rect = container.getBoundingClientRect();
        const startWidth = rect.width;
        const startHeight = rect.height;
        const startLeft = rect.left;
        const startTop = rect.top;
        
        // Min/Max constraints
        const minWidth = 300;
        const minHeight = 350;
        const maxWidth = window.innerWidth * 0.95;
        const maxHeight = window.innerHeight * 0.95;
        
        // Add resizing class
        container.classList.add('resizing');
        
        // Show size display
        updateSizeDisplay(sizeDisplay, startWidth, startHeight);
        
        // Create resize function
        function doResize(e) {
            // Calculate resize based on direction
            let newWidth = startWidth;
            let newHeight = startHeight;
            let newLeft = startLeft;
            let newTop = startTop;
            
            // Calculate width changes
            if (dirX !== 0) {
                const diffX = (e.clientX - startX) * dirX;
                newWidth = Math.min(maxWidth, Math.max(minWidth, startWidth + diffX));
                
                // If resizing from left edge
                if (dirX === -1) {
                    newLeft = startLeft - (newWidth - startWidth);
                }
            }
            
            // Calculate height changes
            if (dirY !== 0) {
                const diffY = (e.clientY - startY) * dirY;
                newHeight = Math.min(maxHeight, Math.max(minHeight, startHeight + diffY));
                
                // If resizing from top edge
                if (dirY === -1) {
                    newTop = startTop - (newHeight - startHeight);
                }
            }
            
            // Apply new dimensions with !important to override any inline styles
            container.style.setProperty('width', `${newWidth}px`, 'important');
            container.style.setProperty('height', `${newHeight}px`, 'important');
            
            // Apply new position if needed
            if (dirX === -1) {
                container.style.setProperty('left', `${newLeft}px`, 'important');
                container.style.setProperty('right', 'auto', 'important');
            }
            
            if (dirY === -1) {
                container.style.setProperty('top', `${newTop}px`, 'important');
                container.style.setProperty('bottom', 'auto', 'important');
            }
            
            // Update size display
            updateSizeDisplay(sizeDisplay, newWidth, newHeight);
        }
        
        // End resize function
        function endResize() {
            container.classList.remove('resizing');
            
            // Hide size display after a delay
            setTimeout(() => {
                sizeDisplay.classList.remove('visible');
            }, 1500);
            
            document.removeEventListener('mousemove', doResize);
            document.removeEventListener('mouseup', endResize);
        }
        
        // Add event listeners
        document.addEventListener('mousemove', doResize);
        document.addEventListener('mouseup', endResize);
    }
    
    function makeDraggable(container, sizeDisplay) {
        // Create draggable header
        const header = document.createElement('div');
        header.className = 'avatar-drag-handle';
        container.appendChild(header);
        
        // Set up drag functionality
        header.addEventListener('mousedown', function(e) {
            e.preventDefault();
            
            // Get initial positions
            const startX = e.clientX;
            const startY = e.clientY;
            const startLeft = container.offsetLeft;
            const startTop = container.offsetTop;
            
            // Ensure container is using position absolute
            container.style.setProperty('position', 'fixed', 'important');
            container.style.setProperty('right', 'auto', 'important');
            container.style.setProperty('bottom', 'auto', 'important');
            
            // Add dragging class
            container.classList.add('dragging');
            
            // Update size display to show position temporarily
            updatePositionDisplay(sizeDisplay, container);
            
            function doDrag(e) {
                const newLeft = startLeft + (e.clientX - startX);
                const newTop = startTop + (e.clientY - startY);
                
                // Apply with bounds checking
                const maxLeft = window.innerWidth - container.offsetWidth;
                const maxTop = window.innerHeight - container.offsetHeight;
                
                container.style.setProperty('left', `${Math.min(maxLeft, Math.max(0, newLeft))}px`, 'important');
                container.style.setProperty('top', `${Math.min(maxTop, Math.max(0, newTop))}px`, 'important');
                
                // Update position display
                updatePositionDisplay(sizeDisplay, container);
            }
            
            function endDrag() {
                container.classList.remove('dragging');
                
                // Hide size display after delay
                setTimeout(() => {
                    sizeDisplay.classList.remove('visible');
                }, 1000);
                
                document.removeEventListener('mousemove', doDrag);
                document.removeEventListener('mouseup', endDrag);
            }
            
            document.addEventListener('mousemove', doDrag);
            document.addEventListener('mouseup', endDrag);
        });
    }
    
    function addResizeControls(container, sizeDisplay) {
        // Create controls container
        const controls = document.createElement('div');
        controls.className = 'avatar-resize-controls';
        container.appendChild(controls);
        
        // Size presets
        const presets = [
            { name: 'S', icon: '−', width: 450, height: 500, tooltip: 'صغير' },
            { name: 'M', icon: '◯', width: 650, height: 700, tooltip: 'متوسط' },
            { name: 'L', icon: '+', width: 800, height: 850, tooltip: 'كبير' },
            { name: 'F', icon: '⤢', custom: 'maximize', tooltip: 'ملء الشاشة' }
        ];
        
        // Create preset buttons
        presets.forEach(preset => {
            const btn = document.createElement('button');
            btn.className = 'avatar-resize-btn';
            btn.innerHTML = preset.icon || preset.name;
            btn.title = preset.tooltip;
            btn.style.fontSize = preset.icon ? '18px' : '14px';
            
            btn.addEventListener('click', () => {
                if (preset.custom === 'maximize') {
                    // Toggle maximize
                    toggleMaximize(container, sizeDisplay);
                } else {
                    // Animate to preset size
                    animateResize(container, preset.width, preset.height);
                    updateSizeDisplay(sizeDisplay, preset.width, preset.height);
                }
            });
            
            controls.appendChild(btn);
        });
    }
    
    function addTopControls(container) {
        // Create top controls
        const controls = document.createElement('div');
        controls.className = 'avatar-top-controls';
        container.appendChild(controls);
        
        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'avatar-top-btn';
        closeBtn.innerHTML = '×';
        closeBtn.title = 'إغلاق';
        closeBtn.addEventListener('click', () => {
            container.style.display = 'none';
            
            // Call toggle function if it exists
            if (typeof toggleAvatarDisplay === 'function') {
                toggleAvatarDisplay();
            }
        });
        
        controls.appendChild(closeBtn);
    }
    
    function toggleMaximize(container, sizeDisplay) {
        // Check if already maximized
        if (container.classList.contains('maximized')) {
            // Restore previous size
            const prevWidth = parseInt(container.dataset.prevWidth) || 650;
            const prevHeight = parseInt(container.dataset.prevHeight) || 700;
            const prevLeft = container.dataset.prevLeft;
            const prevTop = container.dataset.prevTop;
            
            // Animate to previous size
            animateResize(container, prevWidth, prevHeight);
            
            // Restore position
            if (prevLeft && prevTop) {
                container.style.setProperty('left', prevLeft, 'important');
                container.style.setProperty('top', prevTop, 'important');
            }
            
            container.classList.remove('maximized');
        } else {
            // Save current size and position
            container.dataset.prevWidth = container.offsetWidth;
            container.dataset.prevHeight = container.offsetHeight;
            container.dataset.prevLeft = container.style.left;
            container.dataset.prevTop = container.style.top;
            
            // Calculate maximum size with small margin
            const maxWidth = window.innerWidth - 40;
            const maxHeight = window.innerHeight - 40;
            
            // Animate to maximum size
            animateResize(container, maxWidth, maxHeight);
            
            // Center position
            container.style.setProperty('left', '20px', 'important');
            container.style.setProperty('top', '20px', 'important');
            
            container.classList.add('maximized');
        }
        
        // Update size display
        updateSizeDisplay(sizeDisplay, container.offsetWidth, container.offsetHeight);
    }
    
    function animateResize(container, width, height) {
        // Add transition
        container.style.transition = 'width 0.3s ease, height 0.3s ease';
        
        // Set new dimensions
        container.style.setProperty('width', `${width}px`, 'important');
        container.style.setProperty('height', `${height}px`, 'important');
        
        // Remove transition after animation completes
        setTimeout(() => {
            container.style.transition = '';
        }, 300);
    }
    
    function updateSizeDisplay(display, width, height) {
        if (!display) return;
        
        display.textContent = `${Math.round(width)} × ${Math.round(height)}`;
        display.classList.add('visible');
    }
    
    function updatePositionDisplay(display, container) {
        if (!display) return;
        
        const x = Math.round(container.offsetLeft);
        const y = Math.round(container.offsetTop);
        display.textContent = `x: ${x}, y: ${y}`;
        display.classList.add('visible');
    }
    
    function showResizeGuide(container) {
        // Only show guide once
        if (localStorage.getItem('resize-guide-shown')) {
            return;
        }
        
        // Create guide element
        const guide = document.createElement('div');
        guide.className = 'resize-guide';
        guide.innerHTML = `
            <div>يمكنك الآن تغيير حجم نافذة المترجم بسهولة:</div>
            <div style="margin-top:8px;">• اسحب من الأركان أو الحواف</div>
            <div>• استخدم أزرار الحجم (S, M, L, F)</div>
            <div>• اسحب النافذة من الأعلى لنقلها</div>
            <button class="resize-guide-dismiss">فهمت</button>
        `;
        
        document.body.appendChild(guide);
        
        // Add highlight effect to container
        document.body.classList.add('show-resize-guide');
        
        // Show guide after a delay
        setTimeout(() => {
            guide.classList.add('show');
        }, 1000);
        
        // Set up dismiss button
        const dismissBtn = guide.querySelector('.resize-guide-dismiss');
        dismissBtn.addEventListener('click', () => {
            guide.classList.remove('show');
            document.body.classList.remove('show-resize-guide');
            
            // Remember that guide was shown
            localStorage.setItem('resize-guide-shown', 'true');
            
            // Remove after animation
            setTimeout(() => {
                if (guide.parentNode) {
                    guide.parentNode.removeChild(guide);
                }
            }, 300);
        });
        
        // Auto-hide after 15 seconds
        setTimeout(() => {
            if (guide.classList.contains('show')) {
                dismissBtn.click();
            }
        }, 15000);
    }
    
    // Expose API
    window.avatarEnhancedResizerAPI = {
        resizeTo: function(width, height) {
            const container = document.getElementById('asl-avatar-container');
            if (container) {
                animateResize(container, width, height);
                return true;
            }
            return false;
        },
        maximize: function() {
            const container = document.getElementById('asl-avatar-container');
            const sizeDisplay = container.querySelector('.avatar-size-display');
            if (container) {
                toggleMaximize(container, sizeDisplay);
                return true;
            }
            return false;
        },
        reset: function() {
            const container = document.getElementById('asl-avatar-container');
            if (container) {
                animateResize(container, 650, 700);
                return true;
            }
            return false;
        }
    };
})();