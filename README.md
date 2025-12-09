**MedFlow – Medical Appointment Platform**

MedFlow est une application de gestion de rendez-vous médicaux composée de :

Backend : Django REST Framework

Frontend : React (JSX)

Gestion des rôles : Médecin, Patient, Réceptionniste

Disponibilités, réservation de créneaux et authentification JWT.

🚀 Installation
1️⃣ Backend – Django
cd backend
python -m venv venv
source venv/bin/activate     # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver


Le backend tourne sur : http://127.0.0.1:8000

2️⃣ Frontend – React
cd frontend
npm install
npm start



📁 Structure du Projet
MedFlow/
│
├── backend/     # API Django REST
└── frontend/    # Interface React JSX

🎯 Fonctionnalités principales

Authentification sécurisée (JWT)

Gestion des utilisateurs & rôles

Gestion des disponibilités (médecins)

Réservation de rendez-vous (patients)

Consultation des rendez-vous (médecins & personnel)

🛠️ Technologies utilisées

Django, Django REST Framework

React, Axios, React Router

SQLite 
