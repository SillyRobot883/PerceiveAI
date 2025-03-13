document.addEventListener('DOMContentLoaded', function() {
    // Check if chart container exists
    const chartCanvas = document.getElementById('disabilityChart');
    if (!chartCanvas) return;

    // Chart data
    const data = {
        labels: [
            'الإعاقة الحركية',
            'الإعاقة البصرية',
            'الإعاقة السمعية',
            'الإعاقة الذهنية',
            'إعاقات أخرى'
        ],
        datasets: [{
            data: [57.1, 12.3, 11.3, 7.4, 11.9],
            backgroundColor: [
                '#8C52FF', // Primary color
                '#FD297A', // Secondary color
                '#FF6B6B',
                '#4ECDC4',
                '#FFE66D'
            ],
            borderColor: '#1A1C31', // bg-card color
            borderWidth: 2,
            hoverBorderWidth: 0,
            hoverBackgroundColor: [
                '#9D6FFF', // Slightly lighter
                '#FF4B8E',
                '#FF8A8A',
                '#65E5DE',
                '#FFF08A'
            ]
        }]
    };

    // Chart options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false // We're using our own custom legend
            },
            tooltip: {
                backgroundColor: 'rgba(26, 28, 49, 0.9)', // bg-card color
                titleFont: {
                    family: 'Tajawal',
                    size: 16,
                    weight: 'bold'
                },
                bodyFont: {
                    family: 'Tajawal',
                    size: 14
                },
                callbacks: {
                    label: function(context) {
                        return context.parsed + '%';
                    }
                }
            }
        },
        cutout: '40%', // Makes it a doughnut chart
        animation: {
            animateRotate: true,
            animateScale: true
        }
    };

    // Create the chart
    new Chart(chartCanvas, {
        type: 'doughnut',
        data: data,
        options: options
    });
});