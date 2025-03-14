tailwind.config = {
    theme: {
        extend: {
            colors: {
                'primary': '#8C52FF',
                'primary-light': '#A47AFF',
                'primary-dark': '#6E41CB',
                'secondary': '#FD297A',
                'secondary-light': '#FF5B9D',
                'secondary-dark': '#CB1E5F',
                'accent': '#00D9FF',
                'bg-dark': '#0F1121',
                'bg-card': '#1A1C31',
                'bg-code': '#262A45',
                'text-light': '#FFFFFF',
                'text-muted': '#B1B5C3',
                'text-label': '#7780A1',
                'border': '#2E334E',
            },
            fontFamily: {
                'inter': ['Inter', 'sans-serif'],
                'tajawal': ['Tajawal', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(45deg, #8C52FF, #FD297A)',
                'gradient-accent': 'linear-gradient(45deg, #00D9FF, #8C52FF)',
            },
            boxShadow: {
                'primary': '0 5px 15px rgba(140, 82, 255, 0.3)',
                'secondary': '0 5px 15px rgba(253, 41, 122, 0.3)',
            },
            animation: {
                'pulse-glow': 'pulse-glow 8s ease-in-out infinite alternate',
                'float': 'float 6s ease-in-out infinite',
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
    },
    variants: {
        extend: {},
    },
    plugins: [],
}