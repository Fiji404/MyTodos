/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{astro,ts}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: 'rgb(248, 248, 248)',
                accent: 'rgb(230, 230, 230)',
                accentDark: 'rgb(55, 55, 55)',
            },
        },
        maxWidth: {
            5: '50px',
        },
        fontFamily: {
            sans: ['Poppins', 'sans-serif'],
        },
    },
};
