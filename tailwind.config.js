module.exports = {
    purge: [
        'src/**/*.js',
        'src/**/*.jsx',
        'src/**/*.ts',
        'src/**/*.tsx',
        'public/**/*.html',
    ],
    darkMode: 'class', // 'media' or 'class'
    theme: {
        extend: {},
    },
    variants: {},
    plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
        require('@tailwindcss/typography'),
    ],
}