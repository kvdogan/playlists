- [Django Initialization](#django-initialization)
  - [mysite/settings.py](#mysitesettingspy)
  - [mysite/urls.py](#mysiteurlspy)
- [React Initialization](#react-initialization)
  - [Manual installation (Package by package)](#manual-installation-package-by-package)
  - [Installation by package.json](#installation-by-packagejson)
  - [React Configurations](#react-configurations)
    - [ESLint Configuration](#eslint-configuration)
    - [Webpack Configuration](#webpack-configuration)
- [Migration React into Django project in Dropbox](#migration-react-into-django-project-in-dropbox)
  - [Project Configurations](#project-configurations)
    - [.vscode User configuration](#vscode-user-configuration)
    - [.vscode Workspace configuration](#vscode-workspace-configuration)
    - [.GITIGNORE configuration](#gitignore-configuration)

# Django Initialization
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

## mysite/settings.py
```python
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
	'debug_toolbar',
	'webpack_loader',
]

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.0/howto/static-files/

STATIC_URL = '/static/'

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "mysitestatic"),
]

# For collectstatic command before deployment
STATIC_ROOT = os.path.join(BASE_DIR, "static")

# This is for local development
WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'build/',
        'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats.json'),
    }
}

```
## mysite/urls.py
```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('{app_name}.urls', namespace='{app_name}')),
]

from django.conf import settings
if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns
```

```bash
# Folder Structure at this level of project
+---$project_name
|   |   manage.py
|   +---mysite
|   +---mysitestatic
|   +---$app_name
```

# React Initialization
--> Start outside dropbox, dropbox is killing for indexing eventhough node_modules is opted out. 

```bash
mkdir {react-project-name}\src
cd {react-project-name}
npm init
```

## Manual installation (Package by package)
```bash
npm i webpack webpack-cli webpack-dev-server html-webpack-plugin --save-dev
npm i react react-dom --save
npm i babel-core babel-eslint babel-loader babel-plugin-transform-object-rest-spread babel-preset-env babel-preset-react --save-dev
npm i css-loader style-loader file-loader url-loader --save-dev
npm i mini-css-extract-plugin css-loader --save-dev

# FontAwesome PRO Installation
npm config set "@fortawesome:registry" https://npm.fontawesome.com/
npm config set "//npm.fontawesome.com/:_authToken" { token }
npm install @fortawesome/fontawesome-svg-core@prerelease --save
npm install @fortawesome/react-fontawesome@prerelease --save
npm install @fortawesome/pro-solid-svg-icons@prerelease --save
npm install @fortawesome/pro-regular-svg-icons@prerelease --save
npm install @fortawesome/pro-light-svg-icons@prerelease --save

# ESLint Installation //airbnb is currently working with 4.19 latest, may change
npm install eslint@"<5" --save-dev
node_modules\.bin\eslint --init
```

## Installation by package.json
Replace the package.json file content with following.
```json
{
  "name": "$react-project-name",
  "version": "1.0.0",
  "description": "$ProjectDescription",
  "main": "index.js",
  "keywords": [],
  "author": "kvdogan",
  "license": "ISC",
  
  "scripts": {
    "start": "webpack-dev-server --mode development --open",
    "build": "webpack --mode production"
  },
  "babel": {
    "presets": [
      "env",
      "react"
    ],
    "plugins": [
      "transform-object-rest-spread"
    ]
  },
  "devDependencies": {
    "babel-core": "^6.26.3",
    "babel-eslint": "^8.2.5",
    "babel-loader": "^7.1.5",
    "babel-plugin-transform-object-rest-spread": "^6.26.0",
    "babel-preset-env": "^1.7.0",
    "babel-preset-react": "^6.24.1",
    "css-loader": "^1.0.0",
    "eslint": "^4.19.1",
    "eslint-config-airbnb": "^17.0.0",
    "eslint-plugin-import": "^2.13.0",
    "eslint-plugin-jsx-a11y": "^6.1.0",
    "eslint-plugin-react": "^7.10.0",
    "file-loader": "^1.1.11",
    "html-webpack-plugin": "^3.2.0",
    "mini-css-extract-plugin": "^0.4.1",
    "style-loader": "^0.21.0",
    "url-loader": "^1.0.1",
    "webpack": "^4.15.1",
    "webpack-bundle-tracker": "^0.3.0",
    "webpack-cli": "^3.0.8",
    "webpack-dev-server": "^3.1.4"
  },
  "dependencies": {
    "@fortawesome/fontawesome-svg-core": "^1.2.0-14",
    "@fortawesome/pro-light-svg-icons": "^5.1.0-11",
    "@fortawesome/pro-regular-svg-icons": "^5.1.0-11",
    "@fortawesome/pro-solid-svg-icons": "^5.1.0-11",
    "@fortawesome/react-fontawesome": "0.1.0-11",
    "react": "^16.4.1",
    "react-dom": "^16.4.1"
  }
}
```

```bash
npm config set "@fortawesome:registry" https://npm.fontawesome.com/
npm config set "//npm.fontawesome.com/:_authToken" { token }
npm install
```

## React Configurations

### ESLint Configuration
```json
// $react-project-name\.eslintrc configuration
{
  "extends": "airbnb",
  "rules": {
      "eqeqeq": "off",
      "curly": "error",

      "react/prop-types": [0, { "ignore": [], "customValidators": [] }],
      "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
      "react/jsx-one-expression-per-line": "off"
  }
}
```
### Webpack Configuration
```js
// $react-project-name\webpack.config.js
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleTracker = require('webpack-bundle-tracker');

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: './src/index.html',
  filename: './index.html',
  favicon: './src/favicon.ico',
});

const devMode = process.env.NODE_ENV !== 'production';
const miniCssExtractPlugin = new MiniCssExtractPlugin({
  // Options similar to the same options in webpackOptions.output
  // both options are optional
  filename: devMode ? '[name].css' : '[name].[hash].css',
  chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
});

const bundleTracker = new BundleTracker({
  filename: '../webpack-stats.json',
});

module.exports = {
  context: path.resolve(__dirname), // Current directory
  entry: {
    app: path.resolve('./src', 'index.js'), // './src/index.js'
    vendors: ['react'],
  },
  output: {
    path: path.resolve('../mysitestatic/build'),
    filename: '[name]-[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(svg$|png$|gif$|jpe?g$|woff$|ttf$|wav$|mp3$)$/,
        include: path.resolve('./src'),
        use: {
          loader: 'file-loader',
          options: {
            context: '',
            name: '[path]/static/[name]-[hash].[ext]',
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          // 'postcss-loader',
          // 'sass-loader',
        ],
      },
    ],
  },
  plugins: [htmlWebpackPlugin, miniCssExtractPlugin, bundleTracker],
};
```
# Migration React into Django project in Dropbox
```bash
# .\Dropbox\Development\Projects\WebProjects\$project_folder
mkdir react-$appname
mkdir react-$appname\node_modules
```
1. Unselect node_modules folder in selective syncronization settings of Dropbox. 
2. Copy following reactapp folders and files
    -  .eslintrc.json
    -  package-lock.json
    -  package.json
    -  README.md
    -  +---node_modules
    -  +---src
3. Initialize git in the parent folder and commit project as initial commit.
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
    +---src
```

## Project Configurations
### .vscode User configuration
```json
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
```
### .vscode Workspace configuration
```json
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
### .GITIGNORE configuration
```sh
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
