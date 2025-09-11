import os
import json
from typing import Dict, List

class AudioFileManager:
    """Manages audio file availability for different languages"""

    def __init__(self, assets_path: str):
        self.assets_path = assets_path
        self.audio_files = self._scan_audio_files()

    def _scan_audio_files(self) -> Dict[str, List[str]]:
        """Scan assets folder and categorize audio files by language"""
        audio_files = {}
        if not os.path.exists(self.assets_path):
            return audio_files

        for filename in os.listdir(self.assets_path):
            if filename.endswith('.wav'):
                # Extract base name and language code
                if '_pt_PT.wav' in filename:
                    base_name = filename.replace('_pt_PT.wav', '.wav')
                    if 'pt_PT' not in audio_files:
                        audio_files['pt_PT'] = []
                    audio_files['pt_PT'].append(base_name)
                elif '_en_US.wav' in filename:
                    base_name = filename.replace('_en_US.wav', '.wav')
                    if 'en_US' not in audio_files:
                        audio_files['en_US'] = []
                    audio_files['en_US'].append(base_name)
                elif '_es_ES.wav' in filename:
                    base_name = filename.replace('_es_ES.wav', '.wav')
                    if 'es_ES' not in audio_files:
                        audio_files['es_ES'] = []
                    audio_files['es_ES'].append(base_name)
                else:
                    # Files without language suffix (legacy)
                    if 'default' not in audio_files:
                        audio_files['default'] = []
                    audio_files['default'].append(filename)

        return audio_files

    def get_available_episodes(self, locale: str) -> Dict[str, bool]:
        """Get availability status for all episodes in a specific language"""
        availability = {}

        # Define episode mappings (base filenames)
        episode_files = {
            '1': 'Estatística Descritiva.wav',
            '2': 'Teoria das Probabilidades.wav',
            '3': 'Probabilidade Condicionada e Independência.wav',
            '4': 'Variáveis Aleatórias e Propriedades Fundamentais.wav',
            '5': 'Distribuições de Probabilidade Discretas.wav',
            '6': 'Distribuições Contínuas_ Normal e Exponencial.wav',
            '7': 'Amostragem e Distribuições Amostrais.wav',
            '8': 'Estimação de Parâmetros e Intervalos de Confiança.wav',
            '9': 'Testes de Hipóteses Paramétricos.wav'
        }

        # Check availability for each episode
        for episode_id, base_filename in episode_files.items():
            if locale in self.audio_files and base_filename in self.audio_files[locale]:
                availability[episode_id] = True
            elif locale == 'pt_PT' and base_filename in self.audio_files.get('default', []):
                # For Portuguese, also check legacy files without suffix
                availability[episode_id] = True
            else:
                availability[episode_id] = False

        return availability

    def get_audio_filename(self, episode_id: str, locale: str) -> str:
        """Get the correct audio filename for an episode and language"""
        episode_files = {
            '1': 'Estatística Descritiva.wav',
            '2': 'Teoria das Probabilidades.wav',
            '3': 'Probabilidade Condicionada e Independência.wav',
            '4': 'Variáveis Aleatórias e Propriedades Fundamentais.wav',
            '5': 'Distribuições de Probabilidade Discretas.wav',
            '6': 'Distribuições Contínuas_ Normal e Exponencial.wav',
            '7': 'Amostragem e Distribuições Amostrais.wav',
            '8': 'Estimação de Parâmetros e Intervalos de Confiança.wav',
            '9': 'Testes de Hipóteses Paramétricos.wav'
        }

        base_filename = episode_files.get(episode_id, '')
        if not base_filename:
            return base_filename

        # Check if language-specific version exists
        if locale in self.audio_files and base_filename in self.audio_files[locale]:
            return base_filename.replace('.wav', f'_{locale}.wav')
        elif locale == 'pt_PT' and base_filename in self.audio_files.get('default', []):
            # For Portuguese, use the file without suffix if available
            return base_filename
        else:
            # Fallback to default/Portuguese version
            return base_filename

    def update_translation_availability(self, translation_file: str, locale: str):
        """Update the availability status in a translation file"""
        availability = self.get_available_episodes(locale)

        try:
            with open(translation_file, 'r', encoding='utf-8') as f:
                translations = json.load(f)

            # Update podcast episodes availability
            if 'subjects' in translations and 'probabilidade' in translations['subjects']:
                if 'pages' in translations['subjects']['probabilidade']:
                    if 'podcasts' in translations['subjects']['probabilidade']['pages']:
                        if 'episodes' in translations['subjects']['probabilidade']['pages']['podcasts']:
                            episodes = translations['subjects']['probabilidade']['pages']['podcasts']['episodes']

                            for episode_id, episode_data in episodes.items():
                                episode_data['available'] = availability.get(episode_id, False)
                                # Update audio filename
                                episode_data['audio'] = self.get_audio_filename(episode_id, locale)

            # Write back the updated translations
            with open(translation_file, 'w', encoding='utf-8') as f:
                json.dump(translations, f, indent=4, ensure_ascii=False)

            print(f"Updated availability for {locale}")

        except Exception as e:
            print(f"Error updating translation file {translation_file}: {e}")

# Usage example:
if __name__ == "__main__":
    assets_path = "static/assets"
    manager = AudioFileManager(assets_path)

    # Update all translation files
    translations_dir = "translations"
    for filename in os.listdir(translations_dir):
        if filename.endswith('.json'):
            locale = filename.replace('.json', '')
            translation_file = os.path.join(translations_dir, filename)
            manager.update_translation_availability(translation_file, locale)
