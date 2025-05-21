from flask import Flask, render_template, jsonify, send_from_directory, request, g
import os
import json
from utils.translations import TranslationManager

app = Flask(__name__)
translation_manager = TranslationManager(os.path.join(os.path.dirname(__file__), 'translations'))

# Make translations available to all templates
@app.context_processor
def inject_translations():
    def get_translations(subject, page):
        return translation_manager.get_translations(subject, page)
    return dict(get_translations=get_translations)

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

# Probabilidade e Estatística routes
@app.route("/probabilidade")
def probabilidade():
    translations = translation_manager.get_translations('probabilidade', 'home')
    return render_template(
        "subjects/probabilidade/index.html",
        title=translations['page']['title'],
        translations=translations
    )

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

@app.route("/probabilidade/calculator")
def calculator():
    translations = translation_manager.get_translations('probabilidade', 'calculator')
    return render_template(
        "subjects/probabilidade/calculator.html",
        title=translations['page']['title'],
        translations=translations
    )

@app.route("/probabilidade/quiz")
def quiz():
    translations = translation_manager.get_translations('probabilidade', 'quiz')
    return render_template(
        "subjects/probabilidade/quiz.html",
        title=translations['page']['title'],
        translations=translations
    )

@app.route("/probabilidade/game")
def game():
    translations = translation_manager.get_translations('probabilidade', 'game')
    return render_template(
        "subjects/probabilidade/game.html",
        title=translations['page']['title'],
        translations=translations
    )

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

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5051)
