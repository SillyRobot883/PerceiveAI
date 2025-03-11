document.addEventListener('DOMContentLoaded', function() {
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
});