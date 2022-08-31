/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js}'],
    darkMode: 'class',
    theme: {
        extend: {
            animation: {
                textWritting: 'textWritting 4s steps(44) 1s 1 normal both',
                originate: 'originate 2s ease forwards'
            },
            keyframes: {
                textWritting: {
                    '0%': { width: '0em' },
                    '100%': { width: '20em' },
                },
                originate: {
                    '0%, 100%': { transform: 'scale(1)' },
                }
            },
        },
        screens: {
            sm: '300px',
            md: '640px',
            lg: '1080px',
            xl: '1280px',
        },
        fontFamily: {
            sans: ['Poppins', 'sans-serif'],
        },
    },
};
