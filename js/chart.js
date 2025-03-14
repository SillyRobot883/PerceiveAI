document.addEventListener('DOMContentLoaded', function() {
    // Get chart canvas
    const ctx = document.getElementById('disabilityChart');
    
    if (ctx) {
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [
                    'Physical (57.1%)',
                    'Visual (12.3%)',
                    'Hearing (11.3%)',
                    'Mental (7.4%)',
                    'Other (11.9%)'
                ],
                datasets: [{
                    data: [57.1, 12.3, 11.3, 7.4, 11.9],
                    backgroundColor: [
                        '#8C52FF',  // Primary
                        '#FD297A',  // Secondary
                        '#FF6B6B',  // Red
                        '#4ECDC4',  // Teal
                        '#FFE66D'   // Yellow
                    ],
                    borderColor: 'rgba(15, 17, 33, 0.7)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 17, 33, 0.9)',
                        titleFont: {
                            family: 'Inter, Tajawal, sans-serif',
                            size: 14
                        },
                        bodyFont: {
                            family: 'Inter, Tajawal, sans-serif',
                            size: 14
                        },
                        padding: 12,
                        boxPadding: 8,
                        bodySpacing: 8
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
    }
    
    // Update chart language when language changes
    const languageSwitch = document.getElementById('language-switch');
    if (languageSwitch) {
        languageSwitch.addEventListener('click', function() {
            setTimeout(() => {
                updateChartLanguage();
            }, 100);
        });
    }
    
    function updateChartLanguage() {
        const currentLang = document.documentElement.lang;
        
        if (ctx && Chart.getChart(ctx)) {
            const chart = Chart.getChart(ctx);
            
            if (currentLang === 'ar') {
                chart.data.labels = [
                    'الإعاقة الحركية (57.1%)',
                    'الإعاقة البصرية (12.3%)',
                    'الإعاقة السمعية (11.3%)',
                    'الإعاقة الذهنية (7.4%)',
                    'إعاقات أخرى (11.9%)'
                ];
            } else {
                chart.data.labels = [
                    'Physical (57.1%)',
                    'Visual (12.3%)',
                    'Hearing (11.3%)',
                    'Mental (7.4%)',
                    'Other (11.9%)'
                ];
            }
            
            chart.update();
        }
    }
});