document.addEventListener('DOMContentLoaded', function() {
    const segments = document.querySelectorAll('.pie-segment');
    const segmentLabels = document.querySelectorAll('.segment-label');
    const legendItems = document.querySelectorAll('.legend-item');

    if (!segments.length) return;

    const pieData = [
        { id: 'segment1', value: 57.1, color: '#8C52FF', label: 'الإعاقة الحركية' },
        { id: 'segment2', value: 12.3, color: '#FD297A', label: 'الإعاقة البصرية' },
        { id: 'segment3', value: 11.3, color: '#FF6B6B', label: 'الإعاقة السمعية' },
        { id: 'segment4', value: 7.4, color: '#4ECDC4', label: 'الإعاقة الذهنية' },
        { id: 'segment5', value: 11.9, color: '#FFE66D', label: 'إعاقات أخرى' }
    ];

    segments.forEach(segment => {
        segment.addEventListener('mouseover', function() {
            const segmentId = this.id;
            highlightSegment(segmentId);
        });

        segment.addEventListener('mouseout', function() {
            resetSegments();
        });

        segment.addEventListener('click', function() {
            const segmentId = this.id;
            const segmentData = pieData.find(data => data.id === segmentId);

            if (segmentData) {
                const infoText = `${segmentData.label}: ${segmentData.value}% من إجمالي الإعاقات في المملكة`;
            }
        });
    });

    legendItems.forEach(item => {
        item.addEventListener('mouseover', function() {
            const segmentId = this.getAttribute('data-segment');
            highlightSegment(segmentId);
            this.classList.add('bg-white/20', 'shadow-md');
        });

        item.addEventListener('mouseout', function() {
            resetSegments();
            this.classList.remove('bg-white/20', 'shadow-md');
        });

        item.addEventListener('click', function() {
            const segmentId = this.getAttribute('data-segment');
            const segmentData = pieData.find(data => data.id === segmentId);

            if (segmentData) {
                const infoText = `${segmentData.label}: ${segmentData.value}% من إجمالي الإعاقات في المملكة`;
            }
        });
    });

    function highlightSegment(segmentId) {
        resetSegments();

        const segment = document.getElementById(segmentId);
        if (segment) {
            segment.classList.add('active');
        }

        const segmentLabel = document.getElementById(segmentId + '-label');
        if (segmentLabel) {
            segmentLabel.style.opacity = '1';
        }

        legendItems.forEach(item => {
            if (item.getAttribute('data-segment') === segmentId) {
                item.classList.add('bg-white/20', 'shadow-md');
            }
        });
    }

    function resetSegments() {
        segments.forEach(segment => {
            segment.classList.remove('active');
        });

        segmentLabels.forEach(label => {
            label.style.opacity = '0';
        });

        legendItems.forEach(item => {
            item.classList.remove('bg-white/20', 'shadow-md');
        });
    }
});