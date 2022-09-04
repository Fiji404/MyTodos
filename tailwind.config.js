/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js}'],
    darkMode: 'class',
    theme: {
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
