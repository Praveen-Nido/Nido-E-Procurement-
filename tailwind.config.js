/** @type {import("tailwindcss").Config} */
const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      /* =======================================================================
         FONT FAMILIES
         Primary: Inter (everywhere)
         Accent: Poppins (headings only)
         ======================================================================= */
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "Inter", "system-ui", "sans-serif"],
      },

      /* =======================================================================
         FONT SIZES (Design System Scale)
         ======================================================================= */
      fontSize: {
        "h1": ["24px", { lineHeight: "1.25", fontWeight: "600", letterSpacing: "-0.3px" }],
        "h2": ["18px", { lineHeight: "1.25", fontWeight: "500" }],
        "h3": ["16px", { lineHeight: "1.25", fontWeight: "500" }],
        "body-lg": ["15px", { lineHeight: "1.45" }],
        "body": ["14px", { lineHeight: "1.45" }],
        "body-sm": ["13px", { lineHeight: "1.45" }],
        "label": ["13px", { lineHeight: "1.3", fontWeight: "500" }],
        "helper": ["12px", { lineHeight: "1.4" }],
        "button": ["14px", { lineHeight: "1", fontWeight: "500" }],
        "table": ["13px", { lineHeight: "1.3" }],
      },

      /* =======================================================================
         COLORS (Enterprise SaaS Palette)
         ======================================================================= */
      colors: {
        /* Primary Brand Colors */
        primary: {
          DEFAULT: "#2563EB",
          hover: "#1D4ED8",
          light: "#DBEAFE",
          foreground: "#FFFFFF",
        },

        /* Neutral Colors (Core UI) */
        background: "#F8FAFC",
        card: "#FFFFFF",
        border: "#E5E7EB",
        divider: "#F1F5F9",

        /* Text Colors */
        "text-primary": "#111827",
        "text-secondary": "#6B7280",
        "text-muted": "#9CA3AF",

        /* Status Colors */
        success: {
          DEFAULT: "#16A34A",
          light: "#DCFCE7",
          foreground: "#065F46",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#FEF3C7",
          foreground: "#92400E",
        },
        error: {
          DEFAULT: "#DC2626",
          light: "#FEE2E2",
          foreground: "#7F1D1D",
        },
        info: {
          DEFAULT: "#0EA5E9",
          light: "#E0F2FE",
          foreground: "#055E8A",
        },

        /* SLA Status Colors */
        sla: {
          within: "#16A34A",
          nearBreach: "#F59E0B",
          breached: "#DC2626",
        },

        /* Table Colors */
        table: {
          header: "#F9FAFB",
          hover: "#F1F5F9",
        },

        /* HSL-based colors for shadcn/ui compatibility */
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        /* Sidebar Colors */
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },

      /* =======================================================================
         SPACING (8pt Grid System)
         ======================================================================= */
      spacing: {
        "micro": "4px",
        "tight": "8px",
        "small": "12px",
        "default": "16px",
        "medium": "20px",
        "section": "24px",
        "large": "32px",
        "page": "40px",
        "major": "48px",
        // Numeric shortcuts
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "8": "32px",
        "10": "40px",
        "12": "48px",
      },

      /* =======================================================================
         BORDER RADIUS
         ======================================================================= */
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
        pill: "999px",
        DEFAULT: "8px",
      },

      /* =======================================================================
         BOX SHADOWS
         ======================================================================= */
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.05)",
        "card-hover": "0 4px 6px rgba(0,0,0,0.07)",
        dropdown: "0 4px 12px rgba(0,0,0,0.1)",
        "input-focus": "0 0 0 3px #DBEAFE",
      },

      /* =======================================================================
         LAYOUT
         ======================================================================= */
      maxWidth: {
        content: "1440px",
      },
      width: {
        sidebar: "240px",
      },
      height: {
        topbar: "64px",
        input: "40px",
        "table-row": "44px",
      },

      /* =======================================================================
         ANIMATIONS
         ======================================================================= */
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out forwards",
        "scale-in": "scale-in 0.25s ease-out forwards",
        "slide-up": "slide-up 0.4s ease-out forwards",
      },

      /* =======================================================================
         TRANSITIONS
         ======================================================================= */
      transitionDuration: {
        fast: "150ms",
        default: "200ms",
        slow: "300ms",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
