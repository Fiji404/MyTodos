/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js}'],
    theme: {
        extend: {
            animation: {
                textWritting: 'textWritting 4s steps(44) 1s 1 normal both',
            },
            keyframes: {
                textWritting: {
                    '0%': { width: '0em' },
                    '100%': { width: '20em' },
                },
            },
        },
        screens: {
            sm: '300px',
            md: '640px',
            lg: '1080px',
            xl: '1280px',
        },
        extend: {
            colors: {
                transparent: 'transparent',
                current: 'currentColor',
                white: 'rgb(220, 220, 220)',
                darkerWhite: 'rgb(140, 140, 140)',
                darkGrey: 'rgb(35, 35, 35)',
                lightGrey: 'rgb(75, 75, 75)',
                contrastColor: 'rgb(90, 90, 90)',
                lightBlue: 'blue',
                green: {
                    400: '#15803d',
                },
            },
        },
        fontFamily: {
            sans: ['Poppins', 'sans-serif'],
        },
        plugins: [require('tailwindcss/colors')],
    },
};
