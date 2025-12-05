import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './lib/store/store.js'
import App from './pages/App'
import { LanguageProvider } from './i18n/LanguageContext'
import './styles/globals.css'
import AppWrapper from './components/SnakeGame/AppWrapper'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <Provider store={store}>
    <LanguageProvider>
      <AppWrapper>
        <App />
      </AppWrapper>
    </LanguageProvider>
  </Provider>
)
