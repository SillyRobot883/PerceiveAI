tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#8C52FF',
                secondary: '#FD297A',
                'bg-dark': '#0F1121',
                'bg-card': '#1A1C31',
                'text-light': '#FFFFFF',
                'text-muted': '#AAAAAA',
            },
            fontFamily: {
                tajawal: ['Tajawal', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(45deg, #8C52FF, #FD297A)',
                'gradient-secondary': 'linear-gradient(45deg, #FD297A, #8C52FF)',
            },
            animation: {
                'pulse-slow': 'pulse 2s infinite',
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                pulse: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                }
            }
        }
    }
};