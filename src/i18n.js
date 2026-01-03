import { createI18n } from 'vue-i18n'
import en from '@/config/langs/en.json'
import ar from '@/config/langs/ar.json'

function loadLocaleMessages() {
  const locales = [{ en: en }, { ar: ar }]
  const messages = {}
  locales.forEach(lang => {
    const key = Object.keys(lang)
    messages[key] = lang[key] 
  })
  return messages
}

const userLocale = localStorage.getItem('selectedLanguage') || 'ar';


export default createI18n({
  legacy: false,
  locale: userLocale,
  fallbackLocale: 'ar',
  messages: loadLocaleMessages()
})
