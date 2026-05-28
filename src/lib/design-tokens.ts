/**
 * NIDO TECH DESIGN SYSTEM TOKENS
 * ================================
 * This file serves as a single source of truth for all design tokens.
 * Use these tokens throughout the application for consistency.
 * 
 * Last updated: May 2026
 */

// =============================================================================
// 1. TYPOGRAPHY
// =============================================================================

export const typography = {
  // Font Families
  fontFamily: {
    primary: "'Inter', system-ui, sans-serif",
    accent: "'Poppins', 'Inter', system-ui, sans-serif", // Headings only
  },

  // Font Scale
  fontSize: {
    h1: "24px",        // Page Title - SemiBold, -0.3 tracking
    h2: "18px",        // Section Title - Medium
    h3: "16px",        // Card Title - Medium
    bodyLarge: "15px", // Body Large - Regular
    body: "14px",      // Body Default - Regular
    bodySmall: "13px", // Body Small - Regular
    label: "13px",     // Label - Medium
    helper: "12px",    // Helper Text - Regular
    button: "14px",    // Button Text - Medium
    table: "13px",     // Table Text - Regular
  },

  // Font Weights
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Letter Spacing
  letterSpacing: {
    h1: "-0.3px",
    normal: "0",
  },

  // Line Heights
  lineHeight: {
    heading: "1.25",    // 120-130%
    body: "1.45",       // 140-150%
    table: "1.3",       // 130%
  },
} as const;

// =============================================================================
// 2. COLORS
// =============================================================================

export const colors = {
  // Primary Brand Colors
  primary: {
    DEFAULT: "#2563EB",
    hover: "#1D4ED8",
    light: "#DBEAFE",
  },

  // Neutral Colors (Core UI)
  neutral: {
    background: "#F8FAFC",
    card: "#FFFFFF",
    border: "#E5E7EB",
    divider: "#F1F5F9",
  },

  // Text Colors
  text: {
    primary: "#111827",
    secondary: "#6B7280",
    muted: "#9CA3AF",
  },

  // Status Colors
  status: {
    success: {
      DEFAULT: "#16A34A",
      light: "#DCFCE7",
      text: "#065F46",
    },
    warning: {
      DEFAULT: "#F59E0B",
      light: "#FEF3C7",
      text: "#92400E",
    },
    error: {
      DEFAULT: "#DC2626",
      light: "#FEE2E2",
      text: "#7F1D1D",
    },
    info: {
      DEFAULT: "#0EA5E9",
      light: "#E0F2FE",
      text: "#055E8A",
    },
  },

  // SLA Status Colors
  sla: {
    withinSLA: "#16A34A",   // Green
    nearBreach: "#F59E0B",  // Amber
    breached: "#DC2626",    // Red
  },
} as const;

// =============================================================================
// 3. SPACING (8pt Grid System)
// =============================================================================

export const spacing = {
  micro: "4px",      // Micro spacing
  tight: "8px",      // Tight spacing
  small: "12px",     // Small spacing
  default: "16px",   // Default spacing
  medium: "20px",    // Medium spacing
  section: "24px",   // Section spacing
  large: "32px",     // Large spacing
  page: "40px",      // Page spacing
  major: "48px",     // Major separation
} as const;

// Usage Examples
export const spacingUsage = {
  inputPadding: "12px-16px",
  cardPadding: "20px-24px",
  sectionGap: "24px-32px",
  tableRowHeight: "44px-48px",
} as const;

// =============================================================================
// 4. LAYOUT SYSTEM
// =============================================================================

export const layout = {
  // Page Layout
  sidebarWidth: "240px",
  contentPadding: "24px",
  maxWidth: "1440px",

  // Grid System
  gridColumns: 12,
  gridGutter: "24px",

  // Card Design
  card: {
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "12px",
    padding: "20px",
    shadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
} as const;

// =============================================================================
// 5. COMPONENTS
// =============================================================================

export const components = {
  // Buttons
  button: {
    borderRadius: "8px",
    padding: "10px 16px",
    fontSize: "14px",
    fontWeight: 500,
    
    primary: {
      background: "#2563EB",
      text: "#FFFFFF",
      hoverBackground: "#1D4ED8",
    },
    secondary: {
      background: "#FFFFFF",
      text: "#111827",
      border: "#E5E7EB",
    },
    danger: {
      background: "#DC2626",
      text: "#FFFFFF",
    },
  },

  // Input Fields
  input: {
    height: "40px",
    border: "#E5E7EB",
    borderRadius: "8px",
    focusBorder: "#2563EB",
    padding: "12px",
  },

  // Tables
  table: {
    headerBackground: "#F9FAFB",
    rowHeight: "44px",
    border: "#E5E7EB",
    hoverBackground: "#F1F5F9",
    fontSize: "13px",
  },

  // Tags / Status Pills
  tag: {
    borderRadius: "999px",
    padding: "4px 10px",
  },
} as const;

// =============================================================================
// 6. NAVIGATION
// =============================================================================

export const navigation = {
  // Sidebar
  sidebar: {
    background: "#FFFFFF",
    activeItemBackground: "#DBEAFE",
    text: "#374151",
    iconSize: "18px",
  },

  // Top Bar
  topBar: {
    height: "64px",
    searchBorderRadius: "8px",
  },
} as const;

// =============================================================================
// 7. COMMENTS & COLLABORATION
// =============================================================================

export const collaboration = {
  commentBox: {
    padding: "12px",
    avatarSize: "32px",
    background: "#F9FAFB",
    borderRadius: "10px",
  },
  visibilityTags: {
    admin: "#DC2626",     // Red
    internal: "#2563EB",  // Blue
    external: "#16A34A",  // Green
  },
} as const;

// =============================================================================
// 8. FILE ATTACHMENTS
// =============================================================================

export const attachments = {
  uploadBox: {
    border: "dashed",
    borderColor: "#D1D5DB",
  },
} as const;

// =============================================================================
// 9. BORDER RADIUS
// =============================================================================

export const borderRadius = {
  sm: "6px",
  md: "8px",
  lg: "12px",
  pill: "999px",
} as const;

// =============================================================================
// 10. SHADOWS
// =============================================================================

export const shadows = {
  card: "0 1px 2px rgba(0,0,0,0.05)",
  cardHover: "0 4px 6px rgba(0,0,0,0.07)",
  dropdown: "0 4px 12px rgba(0,0,0,0.1)",
} as const;

// =============================================================================
// 11. TRANSITIONS
// =============================================================================

export const transitions = {
  fast: "150ms ease",
  default: "200ms ease",
  slow: "300ms ease",
} as const;

// =============================================================================
// EXPORT ALL TOKENS
// =============================================================================

export const designTokens = {
  typography,
  colors,
  spacing,
  layout,
  components,
  navigation,
  collaboration,
  attachments,
  borderRadius,
  shadows,
  transitions,
} as const;

export default designTokens;
