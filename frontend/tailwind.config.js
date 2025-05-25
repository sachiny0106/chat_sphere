// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        'custom-3col': 'minmax(280px, 1fr) minmax(0, 2.5fr) minmax(280px, 1fr)',
         // You can also define it as: '0.8fr 1.4fr 0.8fr' or similar fixed ratios if preferred for certain breakpoints
         // Or, using theme values: theme('spacing.72') 1.5fr theme('spacing.72')
      }
    },
  },
  daisyui: { /* ... your daisyui config ... */ },
  plugins: [require("daisyui")],
}