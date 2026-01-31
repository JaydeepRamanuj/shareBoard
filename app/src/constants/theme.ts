/**
 * WHAT: App-wide color palette.
 * WHY: Enforces the premium Dark Mode aesthetic requested.
 */

export interface ColorTheme {
    background: string;
    surface: string;
    primary: string;
    primaryVariant: string;
    secondary: string;
    text: string;
    textSecondary: string;
    error: string;
    border: string;
    card: string;
}

const dark: ColorTheme = {
    background: '#121212',
    surface: '#1E1E1E',
    primary: '#BB86FC',
    primaryVariant: '#3700B3',
    secondary: '#03DAC6',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    error: '#CF6679',
    border: '#2C2C2C',
    card: '#252525',
};

const light: ColorTheme = {
    background: '#F5F5F5',
    surface: '#FFFFFF',
    primary: '#6200EE',
    primaryVariant: '#3700B3',
    secondary: '#03DAC6',
    text: '#000000',
    textSecondary: '#666666',
    error: '#B00020',
    border: '#E0E0E0',
    card: '#F0F0F0',
};

export const COLORS = {
    dark,
    light
};

export const SPACING = {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
};

export const SIZES = {
    borderRadius: 12,
    icon: 24,
};
