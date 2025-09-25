
# Note-Taking App

[Note Taking App Documentation](https://docs.google.com/document/d/1WgxgrtsTGFwISTvtfSkNetjVB-Ol8XlGzf6ErFFc1QI/edit?usp=sharing)

This repository contains a full-stack **Note-Taking App** with a **React frontend** and a **FastAPI backend**. Users can create, edit, delete, and share notes. The app includes authentication, protected routes, and email sharing functionality.

<img width="1073" height="651" alt="Dashboard" src="https://github.com/user-attachments/assets/a9f6dce2-bb1d-4f63-b346-389752d6a39c" />
<img width="1070" height="651" alt="Register" src="https://github.com/user-attachments/assets/8cde4481-e439-43a0-b6f6-88249e54cd4e" />
<img width="1072" height="651" alt="Login" src="https://github.com/user-attachments/assets/4f834fd8-ed55-49f1-825e-69436c3b3ad3" />
<img width="1059" height="650" alt="Notes 1" src="https://github.com/user-attachments/assets/3e95d654-e905-4f5a-b7f1-648eaecc109e" />
<img width="1056" height="654" alt="Notes 2" src="https://github.com/user-attachments/assets/e63310f8-dd2d-4a29-bc48-caaa6ac66a51" />
<img width="1070" height="643" alt="Notes 3" src="https://github.com/user-attachments/assets/51ff0e83-701c-42b7-aa2e-4f165536733a" />
<img width="1071" height="651" alt="Shared with me" src="https://github.com/user-attachments/assets/61056dda-a774-4f26-b67c-6f81b6329a63" />

---

## Table of Contents

- [Features](#features)  
- [Backend](#backend)  
  - [Requirements](#requirements)  
  - [Files and Description](#files-and-description)  
  - [Commit History](#commit-history)  
- [Frontend](#frontend)  
  - [Files and Description](#files-and-description-1)  
  - [Commit History](#commit-history-1)  
- [Setup](#setup)  
- [License](#license)  

---

## Features

- User authentication (login/register)  
- Create, edit, delete notes  
- Share notes via email  
- View notes shared with you  
- Protected routes for authenticated users  
- Soft sepia theme and responsive UI  

---

## Backend

The backend is built with **Python 3.10+** and **FastAPI**, using **PostgreSQL** for persistence and **SendGrid** for email sharing.

### Requirements

`requirements.txt`:

```

annotated-types==0.7.0
anyio==4.11.0
bcrypt==4.3.0
cffi==2.0.0
click==8.3.0
colorama==0.4.6
cryptography==46.0.1
dnspython==2.8.0
ecdsa==0.19.1
email-validator==2.3.0
exceptiongroup==1.3.0
fastapi==0.117.1
greenlet==3.2.4
h11==0.16.0
httptools==0.6.4
idna==3.10
MarkupSafe==3.0.2
passlib==1.7.4
psycopg==3.2.10
psycopg-binary==3.2.10
psycopg2-binary==2.9.10
pyasn1==0.6.1
pycparser==2.23
pydantic==2.11.9
pydantic-settings==2.11.0
pydantic_core==2.33.2
python-dotenv==1.1.1
python-http-client==3.3.7
python-jose==3.5.0
python-multipart==0.0.20
PyYAML==6.0.2
rsa==4.9.1
sendgrid==6.12.5
six==1.17.0
sniffio==1.3.1
SQLAlchemy==2.0.43
starlette==0.48.0
typing-inspection==0.4.1
typing_extensions==4.15.0
tzdata==2025.2
uvicorn==0.37.0
watchfiles==1.1.0
websockets==15.0.1
Werkzeug==3.1.3

````

### Files and Description

- `main.py`: Entry point for FastAPI application  
- `schemas/`: Pydantic models for request validation  
- `models/`: Database models  
- `routes/`: API routes (notes, auth, shared notes)  
- `requirements.txt`: Python dependencies  
- `.gitignore`: Ignored files  

### Commit History (Backend)

| File | Commit Message |
|------|----------------|
| `requirements.txt` | `add all backend Python dependencies` |
| `main.py` | `initialize FastAPI application` |
| `auth.py` | `implement authentication endpoints` |
| `notes.py` | `create CRUD operations for notes` |
| `shared.py` | `add shared notes functionality` |
| `schemas/` | `define Pydantic models` |

---

## Frontend

The frontend is built with **React 18**, **React Router 6**, and **Vite** as a build tool.

### Files and Description

- `src/App.jsx`: Main router configuration with protected routes  
- `src/components/Navbar.jsx`: Navigation bar with login/logout links  
- `src/components/NoteCard.jsx`: Individual note display with edit, delete, and share  
- `src/components/ProtectedRoute.jsx`: Handles route protection based on authentication  
- `src/pages/`: Pages including `Dashboard`, `Login`, `Register`, `NoteEditor`, `SharedNotes`  
- `src/services/api.js`: Axios instance with authorization interceptors  
- `vite.config.js`: Vite configuration with React plugin  
- `package.json`: Project dependencies and scripts  
- `index.html`: Main HTML file  

### Commit History (Frontend)

| File | Commit Message |
|------|----------------|
| `Navbar.jsx` | `create navbar with auth links` |
| `NoteCard.jsx` | `implement note card component` |
| `ProtectedRoute.jsx` | `create protected route wrapper` |
| `Dashboard.jsx` | `implement dashboard with notes CRUD` |
| `Login.jsx` | `create login page with form` |
| `Register.jsx` | `create registration page` |
| `NoteEditor.jsx` | `implement note editing page` |
| `SharedNotes.jsx` | `display notes shared with user` |
| `api.js` | `setup Axios with auth interceptor` |
| `App.jsx` | `configure frontend routing` |
| `main.jsx` | `render React app to DOM` |
| `vite.config.js` | `configure Vite for React project` |
| `style.css` | `define global and theme styles` |

---

## Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Linux/macOS
venv\Scripts\activate      # Windows
pip install -r requirements.txt
uvicorn main:app --reload
````

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Navigate to `http://localhost:5173` to view the frontend.

---

## License

This project is licensed under the MIT License.

```
