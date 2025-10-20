import React from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', labelKey: 'languages.english' }
];

export default function LanguageSwitcher({ className = '' }) {
  const { i18n, t } = useTranslation();

  const handleChange = (e) => {
    const nextLang = e.target.value;
    i18n.changeLanguage(nextLang);
    try {
      localStorage.setItem('i18nextLng', nextLang);
    } catch {}
  };

  return (
    <select
      value={i18n.resolvedLanguage || 'en'}
      onChange={handleChange}
      className={`bg-gray-800 text-white border border-gray-700 rounded-md px-2 py-1 text-xs ${className}`}
      aria-label={t('languages.switcherAria')}
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {t(lang.labelKey)}
        </option>
      ))}
    </select>
  );
}


