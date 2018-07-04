# Progression

1. Activate Conda environment for the project.
2. django-admin startproject mysite
3. cd mysite
4. django-admin startapp { app_name }
5. pip install django-webpack-loader	
	(Installing 'django-webpack-loader' of which one and only job is letting Django know 
	what the name of latest bundle (react build files) is. This is good to have for
	development environment.)
5. mkdir mysitestatic
6. python manage.py runserver (testing initial project)

	
```python
# mysite\settings.py
INSTALLED_APPS = [
	'django.contrib.admin',
	'django.contrib.auth',
	'django.contrib.contenttypes',
	'django.contrib.sessions',
	'django.contrib.messages',
	'django.contrib.staticfiles',
	# Apps
	'{ app_name }',
	# 3rd party apps
	'webpack_loader',
]

STATICFILES_DIRS = [
	os.path.join(BASE_DIR, "mysitestatic"),
]
```


```bash
# Folder Structure at this level of project
+---$project_name
|   |   manage.py
|   +---mysite
|   +---mysitestatic
|   +---$app_name
```


--> Go outside of dropbox, dropbox is killing for indexing eventhough node_modules is opted out. 
1. create-react-app { react-app_name }
2. fontawesome pro installation
    1. npm config set "@fortawesome:registry" https://npm.fontawesome.com/
    2. npm config set "//npm.fontawesome.com/:_authToken" { token }
    3. npm install --save-dev @fortawesome/fontawesome-pro
3. npm install eslint@"<5" // airbnb is currently working with 4.19 latest, may change.
4. node_modules\.bin\eslint --init

5. Create react-{app_name} folder in Dropbox project folder.
6. mkdir react-{app_name}\node_modules
6. Unselect node_modules folder in selective syncronization settings of Dropbox. 
6. Copy following reactapp folders and files
    |   .eslintrc.json
    |   package-lock.json
    |   package.json
    |   README.md
    +---node_modules   
    +---public
    +---src
7. Initialize git in the parent folder and commit project as initial commit.
```bash
# Folder Structure at this level of project
$project_folder:
|   .gitignore
|   manage.py
|   
+---.git
+---.vscode
+---mysite
|       settings.py
|       urls.py
|       wsgi.py
|       __init__.py
|
+---mysitestatic
+---$app_name
|   |   admin.py
|   |   apps.py
|   |   models.py
|   |   tests.py
|   |   urls.py
|   |   views.py
|   |   __init__.py
|   +---migrations
|   +---templates
|
\---react-$app_name
    |   .eslintrc.json
    |   package-lock.json
    |   package.json
    |   README.md
    +---node_modules   
    +---public
    +---src
```

```json
// .vscode user settings
{
    "terminal.integrated.shell.windows": "C:\\WINDOWS\\System32\\cmd.exe",
    "files.autoSave": "afterDelay",    
    "window.zoomLevel": 0,
    "workbench.colorTheme": "Monokai",
    "editor.rulers": [
        97
    ],
    "jupyter.appendResults": false,
}

// .vscode Workspace settings
{
    "python.pythonPath": "C:\\Miniconda3\\envs\\webapps\\python.exe",
    "python.linting.enabled": true,
    
    "python.linting.pylintEnabled": false,
    "python.linting.pylintArgs": ["--rcfile=${workspaceRoot}/setup.cfg"],

    "python.linting.pep8Enabled": false,
    "python.linting.pep8Args": ["--config=${workspaceRoot}/setup.cfg"],
    "python.formatting.autopep8Args": [],

    "python.linting.flake8Enabled": true,
    "python.linting.flake8Args": ["--config=${workspaceRoot}/setup.cfg"],

    "liveSassCompile.settings.excludeList": [
        "**/node_modules/**",
        ".vscode/**",
        "__ref_files",
    ],
}
```

```md
#--------------- Django stuff ---------------#

# Byte-compiled / optimized / DLL files
__pycache__/
*.py[cod]
*$py.class
*~

# Django stuff:
*.log
local_settings.py

# Ref files
__ref_files/**
__ref/**

# Fixtures
/fixtures/**


# DB files
*.sqlite3

# VS Code settings
.vscode/**

#---------------- React stuff ----------------#

# Byte-compiled / optimized / DLL files
*~

# dependencies
/node_modules

# testing
coverage/
flow-coverage/
test/the-files-to-test.generated.js
fixtures/dom/public/react-dom.js
fixtures/dom/public/react.js

# production
/build
/static/bundles/local/
webpack-stats-local.json
webpack.local-settings.js

# logging
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local
.module-cache
.grunt

scripts/flow/*/.flowconfig
_SpecRunner.html
__benchmarks__
remote-repo/

chrome-user-data
*.iml
*.swp
*.swo

```