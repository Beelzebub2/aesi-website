from flask import Flask, render_template, jsonify, send_from_directory, request, g
import os
import json
from utils.translations import TranslationManager

app = Flask(__name__)
translation_manager = TranslationManager(os.path.join(os.path.dirname(__file__), 'translations'))

# Available subjects and their features
SUBJECTS = {
    'probabilidade': {
        'name': 'Probabilidade e Estatística',
        'icon': 'fa-chart-line',
        'features': [
            {
                'id': 'calculator',
                'name': 'calculator',
                'route_name': 'calculator',
                'icon': 'fa-calculator'
            },
            {
                'id': 'quiz',
                'name': 'quiz', 
                'route_name': 'quiz',
                'icon': 'fa-brain'
            },            {
                'id': 'descobrir',
                'name': 'descobrir',
                'route_name': 'descobrir',
                'icon': 'fa-magnifying-glass-chart'
            },
            {
                'id': 'podcasts',
                'name': 'podcasts',
                'route_name': 'podcasts',
                'icon': 'fa-podcast'
            }
        ]
    }
}

# Make translations and subjects available to all templates
@app.context_processor
def inject_global_data():
    def get_translations(subject, page):
        return translation_manager.get_translations(subject, page)
    
    return dict(
        get_translations=get_translations,
        subjects=SUBJECTS
    )

@app.route("/")
def home():
    # Combine all translations fetching into a single operation
    translations = translation_manager.get_translations('general', 'home')
    
    # Use translation_manager to efficiently get all needed translations
    full_translations = translation_manager.load_translations('pt_PT')
    translations.update({
        'subjects': full_translations.get('subjects', {}),
        'pages': full_translations.get('pages', {}),
        'general': full_translations.get('general', {})
    })

    # Get coming soon subjects for display (this could be cached if needed)
    coming_soon = translation_manager.get_coming_soon_subjects()
    
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
    if subject not in SUBJECTS:
        # Always provide translations context to 404
        translations = translation_manager.get_translations('general', 'home')
        return render_template('general/404.html', translations=translations, title="Página Não Encontrada"), 404
        
    translations = translation_manager.get_translations(subject, 'home')
    return render_template(
        f"subjects/{subject}/index.html",
        title=translations['page']['title'],
        translations=translations,
        subject_id=subject
    )

# Dynamic subject feature route generation
@app.route("/<subject>/<feature>")
def subject_feature(subject, feature):
    if subject not in SUBJECTS:
        translations = translation_manager.get_translations('general', 'home')
        return render_template('general/404.html', translations=translations, title="Página Não Encontrada"), 404
        
    # Check if feature exists for this subject
    feature_exists = False
    for f in SUBJECTS[subject]['features']:
        if f['id'] == feature:
            feature_exists = True
            break
            
    if not feature_exists:
        translations = translation_manager.get_translations('general', 'home')
        return render_template('general/404.html', translations=translations, title="Página Não Encontrada"), 404
    
    translations = translation_manager.get_translations(subject, feature)
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
        quiz_path = os.path.join(app.static_folder, "quizzes", f"{subject}_quiz.json")
        if not os.path.exists(quiz_path):
            return jsonify({"error": "Quiz not found"}), 404
            
        with open(quiz_path, 'r', encoding='utf-8') as f:
            quiz_data = json.load(f)
            return jsonify(quiz_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/quizzes")
def get_quizzes():
    quizzes = []
    quiz_dir = os.path.join(app.static_folder, "quizzes")
    for filename in os.listdir(quiz_dir):
        if filename.endswith("_quiz.json"):
            with open(os.path.join(quiz_dir, filename)) as f:
                quiz_data = json.load(f)
                quiz_type = filename.replace("_quiz.json", "")
                quizzes.append({
                    "type": quiz_type,
                    "name": quiz_data["name"],
                    "description": quiz_data["description"]
                })
    return jsonify(quizzes)

# Backward compatibility for existing routes
@app.route("/probabilidade")
def probabilidade():
    return subject_home('probabilidade')

@app.route("/probabilidade/calculator")
def calculator():
    return subject_feature('probabilidade', 'calculator')

@app.route("/probabilidade/quiz")
def quiz():
    return subject_feature('probabilidade', 'quiz')
    
@app.route("/probabilidade/descobrir")
def descobrir():
    return subject_feature('probabilidade', 'descobrir')

@app.route("/probabilidade/podcasts")
def podcasts():
    return subject_feature('probabilidade', 'podcasts')

@app.errorhandler(404)
def page_not_found(e):
    # Provide minimal translations for 404 page
    translations = translation_manager.get_translations('general', 'home')
    return render_template('general/404.html', translations=translations, title="Página Não Encontrada"), 404

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5051)
