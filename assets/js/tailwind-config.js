tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#16a34a", // Green 600
        "primary-hover": "#15803d", // Green 700
        "background-light": "#FAFAFA",
        "background-dark": "#1A1A1A", // Darker background for contrast
        "surface-light": "#FFFFFF",
        "surface-dark": "#2A2A2A",
        "text-main": "#333333",
        "text-muted": "#666666"
      },
      fontFamily: {
        "display": ["Work Sans", "Noto Sans", "Noto Sans Thai", "sans-serif"],
        "body": ["Work Sans", "Noto Sans", "Noto Sans Thai", "sans-serif"]
      },
      borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "2xl": "1rem", "full": "9999px" },
    },
  },
}
