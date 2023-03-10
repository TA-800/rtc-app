/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: ["./app/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            keyframes: {
                slideUpAndFade: {
                    from: { opacity: 0, transform: "translateY(3px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                },
            },
            animation: {
                slideUpAndFade: "slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                // slideRightAndFade: "slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                // slideDownAndFade: "slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                // slideLeftAndFade: "slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
            },
        },
    },

    plugins: [],
};
