/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{astro,ts}'],
    darkMode: 'class',
    theme: {
        maxWidth: {
            '5': '50px'
        },
        fontFamily: {
            sans: ['Poppins', 'sans-serif'],
        },
    },
};