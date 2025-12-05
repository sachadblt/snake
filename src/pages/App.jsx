import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import styled from 'styled-components'
import { themes } from '../styles/theme'
import AppRoutes from '../routes/routes'
import AtmButton from '../components/atoms/AtmButton'
import { useTranslation } from '../i18n/LanguageContext'

const AppContainer = styled.div`
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  min-height: 100vh;
`;

const AppTitle = styled.h1`
  color: ${props => props.theme.colors.text};
`;

const App = () => {
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('theme') || 'light')
  const { t } = useTranslation()

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light'
    setCurrentTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <ThemeProvider theme={themes[currentTheme]}>
      <Router>
        <AppContainer>
          <AppTitle>{t('app.title')}</AppTitle>
          <AtmButton label={`${t('button.toggleTheme')} ${t(`app.theme.${currentTheme}`)}`} onClick={toggleTheme} />
          <AppRoutes />
        </AppContainer>
      </Router>
    </ThemeProvider>
  )
}

export default App
