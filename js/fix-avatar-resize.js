/**
 * Quick fix for avatar resizing issues
 */
(function() {
    console.log("Applying emergency avatar resize fix");
    
    // Fix when the page loads
    document.addEventListener('DOMContentLoaded', applyResizeFix);
    window.addEventListener('load', applyResizeFix);
    
    // Also try to fix after a delay
    setTimeout(applyResizeFix, 1000);
    setTimeout(applyResizeFix, 2000);
    
    function applyResizeFix() {
        const container = document.getElementById('asl-avatar-container');
        if (!container) return;
        
        console.log("Found container, applying resize fix");
        
        // Remove problematic styles
        container.style.removeProperty('resize');
        
        // Make sure size is set correctly
        container.style.setProperty('width', '650px', 'important');
        container.style.setProperty('height', '700px', 'important');
        
        // Add manual resize handles
        if (!container.querySelector('.quick-resize-handle')) {
            // Add basic resize handle
            const handle = document.createElement('div');
            handle.className = 'quick-resize-handle';
            handle.style.cssText = `
                position: absolute;
                bottom: 0;
                right: 0;
                width: 20px;
                height: 20px;
                background: rgba(140, 82, 255, 0.6);
                clip-path: polygon(100% 0, 100% 100%, 0 100%);
                cursor: nwse-resize;
                z-index: 10005;
            `;
            container.appendChild(handle);
            
            // Add resize functionality
            handle.addEventListener('mousedown', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const startX = e.clientX;
                const startY = e.clientY;
                const startWidth = container.offsetWidth;
                const startHeight = container.offsetHeight;
                
                function doResize(e) {
                    const newWidth = Math.max(300, startWidth + (e.clientX - startX));
                    const newHeight = Math.max(350, startHeight + (e.clientY - startY));
                    
                    container.style.setProperty('width', newWidth + 'px', 'important');
                    container.style.setProperty('height', newHeight + 'px', 'important');
                }
                
                function stopResize() {
                    document.removeEventListener('mousemove', doResize);
                    document.removeEventListener('mouseup', stopResize);
                }
                
                document.addEventListener('mousemove', doResize);
                document.addEventListener('mouseup', stopResize);
            });
            
            console.log("Added emergency resize handle");
        }
    }
})();