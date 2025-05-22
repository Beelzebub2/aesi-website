# AESI Learning Platform

A interactive learning platform developed for educational purposes.

## Features

- Modular structure for easy addition of new subjects and features
- Dynamic routing based on subjects and features
- Internationalization support via JSON translation files
- Common base template with theme switching

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
app.py                  # Main Flask application
static/                 # Static assets (CSS, JS, images)
templates/              # HTML templates
  base.html             # Base template with common structure
  general/              # General templates (homepage, 404)
  subjects/             # Subject-specific templates
    [subject-name]/     # Templates for each subject
translations/           # Translation files
  pt_PT.json            # Portuguese translation file
utils/                  # Utility modules
  translations.py       # Translation manager
```

## Adding New Subjects

To add a new subject to the platform, follow these steps:

1. **Define the subject in app.py**:

```python
SUBJECTS = {
    # Existing subjects...
    'new_subject': {
        'name': 'New Subject Name',
        'icon': 'fa-icon-name',  # Font Awesome icon
        'features': [
            {
                'id': 'feature1',
                'name': 'feature1',
                'route_name': 'feature1',
                'icon': 'fa-feature-icon'
            },
            # Additional features...
        ]
    }
}
```

2. **Create the directory structure**:

```
templates/subjects/new_subject/
  index.html
  feature1.html
  feature2.html
static/css/subjects/new_subject/
  index.css
  feature1.css
  feature2.css
static/js/subjects/new_subject/
  feature1.js
  feature2.js
```

3. **Add translations to `translations/pt_PT.json`**:

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
                'route_name': 'new_feature',
                'icon': 'fa-feature-icon'
            }
        ]
    }
}
```

2. **Create the template file**:
   - Create `templates/subjects/existing_subject/new_feature.html`

3. **Add translation entries**:

```json
"subjects": {
  "existing_subject": {
    "pages": {
      "new_feature": {
        "title": "New Feature Name",
        "description": "New feature description"
      }
    }
  }
}
```

4. **Create any necessary CSS/JS files**:
   - Create `static/css/subjects/existing_subject/new_feature.css`
   - Create `static/js/subjects/existing_subject/new_feature.js`

## Theme Customization

The platform includes a dark/light theme toggle. To customize or extend the themes:

1. Update the CSS variables in `static/css/general/style.css`
2. Modify the theme toggle functionality in `static/js/general/theme.js`

## Additional Notes

- Each template extends the base template and defines blocks for specific content.
- The navigation menu and features are dynamically generated based on the subject configuration.
- Subject-specific CSS and JS files are included in their respective templates.