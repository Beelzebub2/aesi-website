# AESI Learning Platform

An interactive learning platform designed for educational purposes, featuring a dynamic, translation-driven architecture that ensures all user-facing text is translatable and subjects/features/pages are fully configurable.

## Features

- **Dynamic Translation-Driven Architecture**: All subjects, pages, features, and content are defined in JSON translation files
- **Fully Translatable**: Every user-facing text element can be translated via the translation JSON files
- **Modular Structure**: Easy addition of new subjects, pages, and features without code changes
- **Responsive Design**: Mobile-first design with modern UI components
- **Interactive Elements**: Quizzes, calculators, podcasts, and discovery games
- **Theme Support**: Light/dark mode with persistent user preferences
- **Audio Content**: Educational podcasts with advanced player controls

## Installation

1. Clone the repository
2. Install the required dependencies using pip:
   ```
   pip install -r requirements.txt
   ```
3. Run the application:
   ```
   python app.py
   ```

## Project Structure

```
app.py                     # Main Flask application (fully dynamic routing)
translations/             
  pt_PT.json              # Complete translation file with all content
static/                   
  css/                    # Organized CSS files
    general/              # Platform-wide styles
    subjects/             # Subject-specific styles
  js/                     # JavaScript modules
    general/              # Platform-wide functionality
    subjects/             # Subject-specific functionality
  assets/                 # Audio files and media
  images/                 # Images and icons
templates/                
  base.html               # Base template with dynamic navigation
  general/                # General templates (homepage, 404)
  subjects/               # Subject-specific templates (all translation-driven)
utils/                    
  translations.py         # Translation manager
```

## Architecture Overview

The platform is built on a **translation-driven architecture** where:

1. **All content is defined in `translations/pt_PT.json`**
2. **Routes are dynamically generated** from the translation structure
3. **Templates use translation keys** for all user-facing text
4. **No hardcoded values** exist in the codebase

### Translation Structure

```json
{
  "general": {
    "platform_name": "AESI",
    "copyright": "Todos os direitos reservados"
    // ... general platform text
  },
  "subjects": {
    "subject_id": {
      "name": "Subject Name",
      "description": "Subject description",
      "icon": "fa-icon-name",
      "pages": {
        "page_id": {
          "title": "Page Title",
          "description": "Page description",
          "icon": "fa-icon-name"
          // ... page-specific content
        }
      }
    }
  }
}
```

## Adding New Subjects

To add a new subject, simply add it to the `translations/pt_PT.json` file:
```json
{
  "subjects": {
    "new_subject": {
      "name": "New Subject Name",
      "description": "Subject description",
      "icon": "fa-icon-name",
      "pages": {
        "home": {
          "title": "Subject Home",
          "description": "Subject home page"
        },
        "feature1": {
          "title": "Feature 1",
          "description": "Feature 1 description",
          "icon": "fa-feature-icon"
        },
        "feature2": {
          "title": "Feature 2", 
          "description": "Feature 2 description",
          "icon": "fa-feature-icon"
        }
      }
    }
  }
}
```

**That's it!** The platform will automatically:
- Generate routes for `/subjects/new_subject`, `/subjects/new_subject/feature1`, etc.
- Create navigation menus based on the translation data
- Make all text translatable

### Creating Templates

Create templates in `templates/subjects/new_subject/`:

1. **Subject home page** (`index.html`):
```html
{% extends "base.html" %}
{% block title %}{{ page.title }}{% endblock %}
{% block content %}
<div class="hero-section">
    <h1>{{ page.title }}</h1>
    <p>{{ page.description }}</p>
</div>

<div class="features-grid">
    {% for feature_id, feature in subject.pages.items() %}
    {% if feature_id != 'home' %}
    <div class="feature-card">
        <i class="fas {{ feature.icon }}"></i>
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.description }}</p>
        <a href="{{ url_for('subject_page', subject=subject_id, page=feature_id) }}">
            {{ translations.general.try_again }}
        </a>
    </div>
    {% endif %}
    {% endfor %}
</div>
{% endblock %}
```

2. **Feature pages** (`feature1.html`, etc.):
```html
{% extends "base.html" %}
{% block title %}{{ page.title }}{% endblock %}
{% block content %}
<h1>{{ page.title }}</h1>
<p>{{ page.description }}</p>
<!-- Feature-specific content -->
{% endblock %}
```

## Adding New Pages to Existing Subjects

To add a new page to an existing subject, add it to the subject's `pages` object in `translations/pt_PT.json`:

```json
{
  "subjects": {
    "existing_subject": {
      "pages": {
        // ... existing pages
        "new_page": {
          "title": "New Page Title",
          "description": "New page description", 
          "icon": "fa-new-icon"
        }
      }
    }
  }
}
```

Then create the corresponding template file at `templates/subjects/existing_subject/new_page.html`.

## Translation Guidelines

### Required Translation Keys

All templates must use translation keys for user-facing text:

- **Navigation**: Use `{{ subject.name }}`, `{{ page.title }}`
- **Content**: Define in translation file and access via `{{ translations.subjects.subject_id.pages.page_id.content_key }}`
- **Buttons**: Use `{{ translations.general.submit }}`, `{{ translations.general.next }}`, etc.
- **Dynamic content**: For lists, use loops over translation data

### Translation Best Practices

1. **Never hardcode user-facing text** in templates or JavaScript
2. **Use descriptive keys** like `calculator.select_distribution` instead of generic keys
3. **Group related translations** under logical hierarchies
4. **Include all metadata** (icons, colors, file paths) in translations
5. **Test with different languages** to ensure UI adapts properly

### Example of Complete Page Translation

```json
{
  "subjects": {
    "probabilidade": {
      "pages": {
        "calculator": {
          "title": "Calculadora Estatística",
          "description": "Calcule probabilidades e visualize distribuições",
          "icon": "fa-calculator",
          "select_distribution": "Selecionar Distribuição:",
          "result": "Resultado:",
          "distributions": {
            "binomial": {
              "name": "Distribuição Binomial",
              "params": {
                "n": "Número de tentativas (n)",
                "p": "Probabilidade de sucesso (p)"
              }
            }
          }
        }
      }
    }
  }
}
```

## Development Workflow

### Adding New Features

1. Add feature definition to `translations/pt_PT.json`
2. Create template file using translation keys
3. Add CSS/JS files if needed
4. Test that all text is translatable
5. Verify responsive design

### Modifying Existing Features

1. Update translations in `pt_PT.json`
2. Update templates to use new translation keys
3. Remove any hardcoded text
4. Test functionality

### Testing Translation Coverage

Use this command to find hardcoded text in templates:
```bash
grep -r "\"[A-Za-z]" templates/ --include="*.html"
```

All user-facing text should come from the translation file.

## Technical Details

### Dynamic Routing

The `app.py` file automatically generates routes based on the translation structure:

- `/subjects/<subject_id>` → Subject home page
- `/subjects/<subject_id>/<page_id>` → Subject feature page

### Template Context

All templates receive:
- `translations`: Complete translation object
- `subject_id`: Current subject ID
- `subject`: Current subject translation data
- `page_id`: Current page ID (if applicable)
- `page`: Current page translation data (if applicable)

### CSS/JS Organization

- Global styles: `static/css/general/`
- Subject styles: `static/css/subjects/[subject_id]/`
- Global JS: `static/js/general/`
- Subject JS: `static/js/subjects/[subject_id]/`

## Current Subjects

### Probabilidade e Estatística (`probabilidade`)

Complete subject with the following features:
- **Home** (`index.html`): Subject overview with feature cards
- **Quiz** (`quiz.html`): Interactive quiz with auto-scroll and styled answers
- **Discovery** (`descobrir.html`): Distribution identification game
- **Calculator** (`calculator.html`): Statistical probability calculator with auto-calculation
- **Podcasts** (`podcasts.html`): Educational audio content with advanced player

All features are fully translation-driven and responsive.

## Future Enhancements

- Additional subject areas (Calculus, Physics, etc.)
- Multi-language support (English, Spanish)
- User progress tracking
- Advanced analytics and reporting
- Mobile app version

```json
"subjects": {
  "new_subject": {
    "name": "New Subject Name",
    "description": "Description of the new subject",
    "pages": {
      "home": {
        "title": "New Subject Home Page",
        "description": "Home page description"
      },
      "feature1": {
        "title": "Feature 1 Name",
        "description": "Feature 1 description"
      },
      "feature2": {
        "title": "Feature 2 Name",
        "description": "Feature 2 description"
      }
    }
  }
}
```

4. **Create template files**:

- Create `index.html` that extends the base template
- Create feature templates (feature1.html, feature2.html, etc.)

## Adding Features to Existing Subjects

To add a new feature to an existing subject:

1. **Update the subject definition in app.py**:

```python
SUBJECTS = {
    'existing_subject': {
        # Existing properties...
        'features': [
            # Existing features...
            {
                'id': 'new_feature',
                'name': 'new_feature',
## Contributing

When contributing to this project:

1. **Follow the translation-driven architecture**
2. **Ensure all user-facing text is translatable**
3. **Test responsive design on multiple devices**
4. **Maintain consistent code formatting**
5. **Update documentation when adding new features**

## License

This project is developed for educational purposes.