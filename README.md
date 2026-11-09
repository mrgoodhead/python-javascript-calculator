# Calc — Python + JavaScript Calculator

A responsive calculator with a browser-based frontend and a Python Flask backend.

## Features

- Addition, subtraction, multiplication, division and modulo
- Parentheses, decimal numbers and exponentiation (`**`)
- Python API calculates expressions using a restricted AST parser (not `eval`)
- Calculation history for the current browser session
- Keyboard support
- Responsive layout

## Tech stack

- HTML5 — page structure
- CSS3 — responsive styling
- JavaScript — calculator interaction and API requests
- Python 3 — calculation logic
- Flask — backend web server and JSON API

## Run locally

### 1. Install Python

Use Python 3.10 or newer. Check your installation:

```bash
python --version
```

### 2. Open this project folder in a terminal

```bash
cd calculator-app
```

### 3. Create and activate a virtual environment

Windows PowerShell:

```powershell
python -m venv .venv
.venv\\Scripts\\Activate.ps1
```

macOS / Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Start the app

```bash
python app.py
```

Open http://127.0.0.1:5000 in your browser.

## API endpoints

- `GET /` — serves the calculator page
- `POST /api/calculate` — accepts JSON such as `{"expression":"12*(3+4)"}`
- `GET /api/health` — checks that the backend is running

Example API response:

```json
{
  "success": true,
  "expression": "12*(3+4)",
  "result": 84
}
```

## Push this project to GitHub

1. Create a new empty repository on GitHub. For example, name it `python-javascript-calculator`. Do not initialize it with a README because this project already has one.
2. In your terminal, from inside the `calculator-app` folder, run:

```bash
git init
git add .
git commit -m "Build full-stack calculator app"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/python-javascript-calculator.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. GitHub may ask you to authenticate using your browser or a personal access token.

## Project structure

```text
calculator-app/
├── app.py
├── requirements.txt
├── README.md
├── .gitignore
├── templates/
│   └── index.html
└── static/
    ├── style.css
    └── script.js
```

## Learning note

The browser does not execute Python directly. JavaScript sends the expression to the Flask backend over HTTP, and Python returns the answer as JSON. This is a simple example of how a frontend communicates with a backend.
