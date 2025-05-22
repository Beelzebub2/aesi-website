import os
import json
from functools import lru_cache
from typing import Dict, Any, Set

class TranslationManager:
    def __init__(self, translations_dir: str = 'translations'):
        self.translations_dir = translations_dir
        self.default_locale = 'pt_PT'
        self._translations: Dict[str, Dict[str, Any]] = {}
        self._available_locales: Set[str] = set()
        # Preload translations at initialization
        self._preload_translations()
        
    def _preload_translations(self):
        """Preload all translation files to improve performance."""
        try:
            for file in os.listdir(self.translations_dir):
                if file.endswith('.json'):
                    locale = file.replace('.json', '')
                    self._available_locales.add(locale)
                    # Load the translations
                    self.load_translations(locale)
            print(f"Preloaded translations for: {', '.join(self._available_locales)}")
        except Exception as e:
            print(f"Error preloading translations: {e}")
            
    @lru_cache(maxsize=16)
    def load_translations(self, locale: str) -> Dict[str, Any]:
        """Load translations for a given locale with improved caching."""
        if locale not in self._translations:
            try:
                file_path = os.path.join(self.translations_dir, f'{locale}.json')
                with open(file_path, 'r', encoding='utf-8') as f:
                    self._translations[locale] = json.load(f)
            except FileNotFoundError:
                print(f"Warning: Translation file for {locale} not found, using default locale")
                return self.load_translations(self.default_locale)
        return self._translations[locale]    
    
    @lru_cache(maxsize=32)
    def get_translations(self, section: str, page: str, locale: str = 'pt_PT') -> Dict[str, Any]:
        """Get translations for a specific section and page with enhanced caching."""
        translations = self.load_translations(locale)
        
        # Get general translations that should be available everywhere
        result = {
            'general': translations.get('general', {})
        }
        
        if section == 'general':
            # For general pages, get page-specific translations
            result.update({
                'page': translations.get('pages', {}).get(page, {})
            })
        else:
            # For subject pages, get subject and page-specific translations
            subject_data = translations.get('subjects', {}).get(section, {})
            if subject_data:
                result.update({
                    'subject': subject_data,  # Pass the full subject dict, including 'pages'
                    'page': subject_data.get('pages', {}).get(page, {})
                })
            
        return result

    def get_coming_soon_subjects(self, locale: str = 'pt_PT') -> Dict[str, Dict[str, str]]:
        """Get all coming soon subjects."""
        translations = self.load_translations(locale)
        return translations.get('coming_soon', {})
