from flask import Flask, render_template, jsonify, send_from_directory, request, g, session, redirect, url_for
import os
import json
from utils.translations import TranslationManager

app = Flask(__name__)
app.secret_key = 'aesi-secret-key-2024'  # Required for session management
translation_manager = TranslationManager(os.path.join(os.path.dirname(__file__), 'translations'))

def get_current_locale():
    """Get current locale from session or default to Portuguese"""
    return session.get('locale', 'pt_PT')

def get_subjects_from_translations(locale='pt_PT'):
    """
    Dynamically build subjects structure from translations
    """
    try:
        translations = translation_manager.load_translations(locale)
        subjects_data = translations.get('subjects', {})
        subjects = {}

        for subject_id, subject_data in subjects_data.items():
            # Skip coming soon subjects
            if subject_id in translations.get('coming_soon', {}):
                continue

            features = []
            pages = subject_data.get('pages', {})

            for page_id, page_data in pages.items():
                if page_id != 'home':  # Skip home page as it's the subject index
                    features.append({
                        'id': page_id,
                        'name': page_id,
                        'icon': page_data.get('icon', 'fa-question-circle')
                    })

            subjects[subject_id] = {
                'name': subject_data.get('name', ''),
                'icon': subject_data.get('icon', 'fa-chart-line'),
                'features': features
            }

        return subjects
    except Exception as e:
        print(f"Error loading subjects from translations: {e}")
        return {}

# Make translations and subjects available to all templates
@app.context_processor
def inject_global_data():
    def get_translations(subject, page):
        locale = get_current_locale()
        return translation_manager.get_translations(subject, page, locale)

    return dict(
        get_translations=get_translations,
        subjects=get_subjects_from_translations(get_current_locale()),
        current_locale=get_current_locale(),
        available_locales=['pt_PT', 'en_US', 'es_ES']
    )

@app.route("/")
def home():
    locale = get_current_locale()
    # Combine all translations fetching into a single operation
    translations = translation_manager.get_translations('general', 'home', locale)

    # Use translation_manager to efficiently get all needed translations
    full_translations = translation_manager.load_translations(locale)
    translations.update({
        'subjects': full_translations.get('subjects', {}),
        'pages': full_translations.get('pages', {}),
        'general': full_translations.get('general', {})
    })

    # Get coming soon subjects for display (this could be cached if needed)
    coming_soon = translation_manager.get_coming_soon_subjects(locale)

    response = render_template(
        "general/homepage.html",
        title=translations['general']['platform_name'],
        translations=translations,
        coming_soon=coming_soon
    )
      # Add cache control headers for better performance
    headers = {
        'Cache-Control': 'public, max-age=300',  # Cache for 5 minutes
        'Vary': 'Accept-Language'  # Vary cache by language
    }
    return response, 200, headers

# Dynamic subject route generation
@app.route("/<subject>")
def subject_home(subject):
    locale = get_current_locale()
    subjects = get_subjects_from_translations(locale)
    if subject not in subjects:
        # Always provide translations context to 404
        translations = translation_manager.get_translations('general', 'home', locale)
        return render_template('general/404.html', translations=translations, title="Página Não Encontrada"), 404

    translations = translation_manager.get_translations(subject, 'home', locale)
    return render_template(
        f"subjects/{subject}/index.html",
        title=translations['page']['title'],
        translations=translations,
        subject_id=subject
    )

# Dynamic subject feature route generation
@app.route("/<subject>/<feature>")
def subject_feature(subject, feature):
    locale = get_current_locale()
    subjects = get_subjects_from_translations(locale)
    if subject not in subjects:
        translations = translation_manager.get_translations('general', 'home', locale)
        return render_template('general/404.html', translations=translations, title="Página Não Encontrada"), 404

    # Check if feature exists for this subject
    feature_exists = False
    for f in subjects[subject]['features']:
        if f['id'] == feature:
            feature_exists = True
            break

    if not feature_exists:
        translations = translation_manager.get_translations('general', 'home', locale)
        return render_template('general/404.html', translations=translations, title="Página Não Encontrada"), 404

    translations = translation_manager.get_translations(subject, feature, locale)
    return render_template(
        f"subjects/{subject}/{feature}.html",
        title=translations['page']['title'],
        translations=translations,
        subject_id=subject,
        feature_id=feature
    )

# API routes
@app.route("/api/quiz/<subject>")
def get_quiz(subject):
    try:
        locale = get_current_locale()
        # Try the new translated quiz file first
        translated_quiz_path = os.path.join(app.static_folder, "quizzes", f"{subject}_quiz_translated.json")
        original_quiz_path = os.path.join(app.static_folder, "quizzes", f"{subject}_quiz.json")

        quiz_data = None

        # Check if translated version exists
        if os.path.exists(translated_quiz_path):
            with open(translated_quiz_path, 'r', encoding='utf-8') as f:
                quiz_data = json.load(f)
        elif os.path.exists(original_quiz_path):
            with open(original_quiz_path, 'r', encoding='utf-8') as f:
                quiz_data = json.load(f)
        else:
            return jsonify({"error": "Quiz not found"}), 404

        # Process the quiz data based on the format
        if quiz_data:
            # Check if this is the new translated format
            if 'questions' in quiz_data and len(quiz_data['questions']) > 0:
                first_question = quiz_data['questions'][0]
                if 'question' in first_question and isinstance(first_question['question'], dict):
                    # New translated format - extract the appropriate language
                    lang_code = 'pt' if locale == 'pt_PT' else 'en'

                    translated_quiz = {
                        'name': quiz_data['name'].get(lang_code, quiz_data['name'].get('pt', '')),
                        'description': quiz_data['description'].get(lang_code, quiz_data['description'].get('pt', '')),
                        'questionsPerSession': quiz_data['questionsPerSession'],
                        'questions': []
                    }

                    for question in quiz_data['questions']:
                        translated_question = {
                            'id': question['id'],
                            'question': question['question'].get(lang_code, question['question'].get('pt', '')),
                            'options': [opt.get(lang_code, opt.get('pt', '')) for opt in question['options']],
                            'correctAnswer': question['correctAnswer'],
                            'explanation': question['explanation'].get(lang_code, question['explanation'].get('pt', ''))
                        }
                        translated_quiz['questions'].append(translated_question)

                    return jsonify(translated_quiz)
                else:
                    # Legacy format without translations
                    return jsonify(quiz_data)
            else:
                # Legacy format without translations
                return jsonify(quiz_data)

        return jsonify({"error": "Invalid quiz format"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/quizzes")
def get_quizzes():
    quizzes = []
    locale = get_current_locale()
    lang_code = 'pt' if locale == 'pt_PT' else 'en'
    quiz_dir = os.path.join(app.static_folder, "quizzes")

    for filename in os.listdir(quiz_dir):
        if filename.endswith("_quiz_translated.json"):
            quiz_type = filename.replace("_quiz_translated.json", "")
            quiz_path = os.path.join(quiz_dir, filename)

            try:
                with open(quiz_path, 'r', encoding='utf-8') as f:
                    quiz_data = json.load(f)

                # Extract translated name and description
                name = quiz_data.get('name', {}).get(lang_code, quiz_data.get('name', {}).get('pt', quiz_type))
                description = quiz_data.get('description', {}).get(lang_code, quiz_data.get('description', {}).get('pt', ''))

                quizzes.append({
                    "type": quiz_type,
                    "name": name,
                    "description": description
                })
            except Exception as e:
                print(f"Error loading quiz {filename}: {e}")
                continue

        elif filename.endswith("_quiz.json") and not filename.endswith("_quiz_translated.json"):
            # Handle legacy quiz files
            quiz_type = filename.replace("_quiz.json", "")
            quiz_path = os.path.join(quiz_dir, filename)

            try:
                with open(quiz_path, 'r', encoding='utf-8') as f:
                    quiz_data = json.load(f)

                quizzes.append({
                    "type": quiz_type,
                    "name": quiz_data.get("name", quiz_type),
                    "description": quiz_data.get("description", "")
                })
            except Exception as e:
                print(f"Error loading quiz {filename}: {e}")
                continue

    return jsonify(quizzes)

@app.route("/set_language/<locale>")
def set_language(locale):
    """Set the user's language preference"""
    if locale in ['pt_PT', 'en_US', 'es_ES']:
        session['locale'] = locale
    return redirect(request.referrer or url_for('home'))

@app.errorhandler(404)
def page_not_found(e):
    # Provide minimal translations for 404 page
    locale = get_current_locale()
    translations = translation_manager.get_translations('general', 'home', locale)
    return render_template('general/404.html', translations=translations, title="Página Não Encontrada"), 404

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5051)
