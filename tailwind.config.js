/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'check-blue': '#0e2f4a',   // Fundo da página
                'check-card': '#334151',   // Fundo do formulário
                'check-green': '#84cc16',  // Botão
            }
        },
    },
    plugins: [],
}