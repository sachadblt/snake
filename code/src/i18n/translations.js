// New structure: keys first, languages as sub-objects.
// Example: translations.app.theme.light.en = 'Light'
export const translations = {
  app: {
    title: {
      fr: 'Mon Application',
      en: 'My Application'
    },
    theme: {
      light: {
        fr: 'Clair',
        en: 'Light'
      },
      dark: {
        fr: 'Sombre',
        en: 'Dark'
      }
    }
  },
  button: {
    toggleTheme: {
      fr: 'Thème',
      en: 'Theme'
    }
  },
  home: {
    welcome: {
      fr: 'Bienvenue',
      en: 'Welcome'
    }
  }
};
