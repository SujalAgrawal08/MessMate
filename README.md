<div align="center">

# MessMate

### A Data-Driven Hostel Mess Management Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-171717?style=for-the-badge&logo=fastapi&logoColor=06b6d4)](https://fastapi.tiangolo.com/)
[![Vite](https://img.shields.io/badge/Vite-171717?style=for-the-badge&logo=vite&logoColor=06b6d4)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-171717?style=for-the-badge&logo=postgresql&logoColor=06b6d4)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-171717?style=for-the-badge&logo=docker&logoColor=06b6d4)](https://www.docker.com/)
[![Python](https://img.shields.io/badge/Python_3.9+-171717?style=for-the-badge&logo=python&logoColor=06b6d4)](https://python.org/)

<br/>

[![Live Demo](https://img.shields.io/badge/✨_LIVE_DEMO-TRY_IT_NOW-06b6d4?style=for-the-badge)](https://messmate-iiitu.vercel.app)
[![API Docs](https://img.shields.io/badge/📖_API-Documentation-0891b2?style=for-the-badge)](https://messmate-api.onrender.com/docs)
[![Report Bug](https://img.shields.io/badge/🐛_Report-Bug-171717?style=for-the-badge)](../../issues)
[![Request Feature](https://img.shields.io/badge/💡_Request-Feature-0891b2?style=for-the-badge)](../../issues)



<img src="assets/MessMate_Home.png" alt="Homepage" width="80%"/>

<br/><br/>

<img src="assets/MessMate_Login.png" alt="Login Page" width="80%"/>

</div>


## 🎯 About

**MessMate** transforms traditional hostel mess management through intelligent automation and data analytics. Beyond basic management, the platform employs an **AI-driven Analytics Engine** that provides:

| Capability | Description |
|:---:|:---|
| 🥗 **Nutritional Intelligence** | AI-powered meal planning with macro/micronutrient tracking |
| 📈 **Demand Forecasting** | Linear regression models predicting meal attendance |
| ♻️ **Waste Reduction** | Predictive analytics reducing food waste by up to 30% |
| 💬 **Sentiment Analysis** | NLP-driven feedback processing for quality insights |

> **Impact Metrics:** Designed to serve 500+ students with <100ms API response times

---

## 🏗 System Architecture

```
                           ┌─────────────────────────────────────────────────────────────────────────────────┐
                           │                              CLIENT LAYER                                       │
                           ├─────────────────────────────────────────────────────────────────────────────────┤
                           │                                                                                 │
                           │    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                     │
                           │    │   Student    │    │    Admin     │    │   Mobile     │                     │
                           │    │   Portal     │    │  Dashboard   │    │   (Future)   │                     │
                           │    │  (React.js)  │    │  (React.js)  │    │              │                     │
                           │    └──────┬───────┘    └──────┬───────┘    └──────────────┘                     │
                           │           │                   │                                                 │
                           │           └─────────┬─────────┘                                                 │
                           │                     │ HTTPS                                                     │
                           │                     ▼                                                           │
                           ├─────────────────────────────────────────────────────────────────────────────────┤
                           │                              API GATEWAY LAYER                                  │
                           ├─────────────────────────────────────────────────────────────────────────────────┤
                           │                                                                                 │
                           │    ┌────────────────────────────────────────────────────────────────────────┐   │
                           │    │                         FastAPI Application                            │   │
                           │    │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │   │
                           │    │  │    Auth     │  │    CORS     │  │    Rate     │  │   Request   │    │   │
                           │    │  │ Middleware  │  │ Middleware  │  │  Limiter    │  │  Validator  │    │   │
                           │    │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │   │
                           │    └────────────────────────────────────────────────────────────────────────┘   │
                           │                                                                                 │
                           ├─────────────────────────────────────────────────────────────────────────────────┤
                           │                              SERVICE LAYER                                      │
                           ├─────────────────────────────────────────────────────────────────────────────────┤
                           │                                                                                 │
                           │    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
                           │    │    User     │  │    Menu     │  │   Rebate    │  │     Analytics       │   │
                           │    │  Service    │  │  Service    │  │  Service    │  │      Engine         │   │
                           │    │             │  │             │  │             │  │  ┌───────────────┐  │   │
                           │    │ • Auth      │  │ • CRUD      │  │ • Opt-out   │  │  │ ML Pipeline   │  │   │
                           │    │ • Profile   │  │ • Schedule  │  │ • Calculate │  │  │ • Forecasting │  │   │
                           │    │ • QR Gen    │  │ • Nutrition │  │ • History   │  │  │ • Sentiment   │  │   │
                           │    └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  │  │ • Clustering  │  │   │
                           │           │                │                │         │  └───────────────┘  │   │
                           │           │                │                │         └──────────┬──────────┘   │
                           │           └────────────────┴────────────────┴────────────────────┘              │
                           │                                        │                                        │
                           ├────────────────────────────────────────┼────────────────────────────────────────┤
                           │                              DATA ACCESS LAYER                                  │
                           ├────────────────────────────────────────┼────────────────────────────────────────┤
                           │                                        │                                        │
                           │    ┌───────────────────────────────────┼───────────────────────────────────┐    │
                           │    │                         SQLModel ORM                                  │    │
                           │    │  ┌─────────────┐  ┌─────────────┐│┌─────────────┐  ┌─────────────┐    │    │
                           │    │  │   Models    │  │   Schemas   │││  Repository │  │  Migrations │    │    │
                           │    │  │             │  │  (Pydantic) │││   Pattern   │  │   (Alembic) │    │    │
                           │    │  └─────────────┘  └─────────────┘│└─────────────┘  └─────────────┘    │    │
                           │    └───────────────────────────────────┼───────────────────────────────────┘    │
                           │                                        │                                        │
                           │                                        ▼                                        │
                           │                          ┌─────────────────────────┐                            │
                           │                          │      PostgreSQL         │                            │
                           │                          │    ┌───────────────┐    │                            │
                           │                          │    │    Tables     │    │                            │
                           │                          │    │  • users      │    │                            │
                           │                          │    │  • menus      │    │                            │
                           │                          │    │  • feedback   │    │                            │
                           │                          │    │  • attendance │    │                            │
                           │                          │    │  • rebates    │    │                            │
                           │                          │    │  • waste_logs │    │                            │
                           │                          │    └───────────────┘    │                            │
                           │                          └─────────────────────────┘                            │
                           │                                                                                 │
                           └─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 💻 Tech Stack

<div align="center">

### Core Technologies

| Layer | Technology | Purpose |
|:-----:|:----------:|:--------|
| **Frontend** | ![React](https://img.shields.io/badge/React-171717?style=flat-square&logo=react&logoColor=06b6d4) | Component-based UI with hooks |
| | ![Three.js](https://img.shields.io/badge/Three.js-171717?style=flat-square&logo=three.js&logoColor=06b6d4) | 3D visualizations & animations |
| | ![TailwindCSS](https://img.shields.io/badge/Tailwind-171717?style=flat-square&logo=tailwindcss&logoColor=06b6d4) | Utility-first styling |
| **Backend** | ![FastAPI](https://img.shields.io/badge/FastAPI-171717?style=flat-square&logo=fastapi&logoColor=06b6d4) | Async REST API framework |
| | ![Pydantic](https://img.shields.io/badge/Pydantic-171717?style=flat-square&logo=pydantic&logoColor=06b6d4) | Data validation & serialization |
| **Database** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-171717?style=flat-square&logo=postgresql&logoColor=06b6d4) | ACID-compliant relational DB |
| | ![SQLModel](https://img.shields.io/badge/SQLModel-171717?style=flat-square&logo=python&logoColor=06b6d4) | ORM with type hints |
| **ML/AI** | ![Pandas](https://img.shields.io/badge/Pandas-171717?style=flat-square&logo=pandas&logoColor=06b6d4) | Data manipulation & analysis |
| | ![Scikit-learn](https://img.shields.io/badge/ScikitLearn-171717?style=flat-square&logo=scikitlearn&logoColor=06b6d4) | ML models for forecasting |
| | ![TextBlob](https://img.shields.io/badge/TextBlob-171717?style=flat-square&logo=python&logoColor=06b6d4) | NLP sentiment analysis |
| **Security** | ![JWT](https://img.shields.io/badge/JWT-171717?style=flat-square&logo=jsonwebtokens&logoColor=06b6d4) | Stateless authentication |
| | ![Bcrypt](https://img.shields.io/badge/Bcrypt-171717?style=flat-square&logo=letsencrypt&logoColor=06b6d4) | Password hashing (cost=12) |
| **DevOps** | ![Docker](https://img.shields.io/badge/Docker-171717?style=flat-square&logo=docker&logoColor=06b6d4) | Containerization |
| | ![Render](https://img.shields.io/badge/Render-171717?style=flat-square&logo=render&logoColor=06b6d4) | Cloud deployment |

</div>

---

## ✨ Features

### Authentication Module
| Feature | Description |
|---------|-------------|
| Secure Login/Signup | JWT-based authentication with Bcrypt password hashing |
| Role-based Access | Separate flows for students and administrators |


<h2> Feature Matrix </h2>
```
                          ┌─────────────────────────────────────────────────────────────────────┐
                          │                           FEATURE OVERVIEW                          │
                          ├──────────────────────────────┬──────────────────────────────────────┤
                          │         STUDENT PANEL        │              ADMIN PANEL             │
                          ├──────────────────────────────┼──────────────────────────────────────┤
                          │                              │                                      │
                          │  ┌─────────────────────┐     │     ┌─────────────────────┐          │
                          │  │   📱 Digital Menu   │     │     │  📷 QR Scanner     │          │
                          │  │   View daily menus  │     │     │  Real-time tracking │          │
                          │  │   with nutrition    │     │     │  attendance         │          │
                          │  └─────────────────────┘     │     └─────────────────────┘          │
                          │                              │                                      │
                          │  ┌─────────────────────┐     │     ┌─────────────────────┐          │
                          │  │   🥗 Nutrition AI   │     │     │  📊 Sentiment      │          │
                          │  │   Personalized      │     │     │  Dashboard          │          │
                          │  │   recommendations   │     │     │  NLP-powered        │          │
                          │  └─────────────────────┘     │     │  feedback analysis  │          │
                          │                              │     └─────────────────────┘          │
                          │  ┌─────────────────────┐     │                                      │
                          │  │   ⏭️ Meal Opt-Out   │     │     ┌─────────────────────┐          │
                          │  │   Skip meals &      │     │     │  📈 Predictive      │          │
                          │  │   auto rebates      │     │     │  Analytics          │          │
                          │  └─────────────────────┘     │     │  Demand forecasting │          │
                          │                              │     │  waste reduction    │          │
                          │  ┌─────────────────────┐     │     └─────────────────────┘          │
                          │  │   💬 Feedback       │     │                                      │
                          │  │   Rate meals &      │     │     ┌─────────────────────┐          │
                          │  │   submit reviews    │     │     │  🍽️ Menu Manager    │          │
                          │  └─────────────────────┘     │     │  CRUD operations    │          │
                          │                              │     │  nutrition data     │          │
                          │  ┌─────────────────────┐     │     └─────────────────────┘          │
                          │  │   🎫 QR Identity    │     │                                      │
                          │  │   Unique QR code    │     │     ┌─────────────────────┐          │
                          │  │   for verification  │     │     │  ♻️ Waste Tracking  │          │
                          │  └─────────────────────┘     │     │  Log & analyze      │          │
                          │                              │     │  food waste         │          │
                          │                              │     └─────────────────────┘          │
                          │                              │                                      │
                          └──────────────────────────────┴──────────────────────────────────────┘
```

---

## Technical Implementation Highlights

### Cold Start Fix
A specialized /health endpoint was engineered to accept HEAD requests from UptimeRobot, preventing the server from sleeping.
```python
@app.head("/health")
def health_check(): return {"status": "active"}
```

## Getting started
### Prerequisites

- Python 3.9+
- Node.js 18+
- PostgreSQL 14+
- Docker (optional)
### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/SujalAgrawal08/MessMate.git
   cd messmate
   ```
2. **Backend** 
   ```bash
   python -m venv venv
   source venv/bin/activate 
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

3. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. **Access the Application**
   * Frontend: http://localhost:5173
   * Backend API: http://localhost:8000
   * API Docs: http://localhost:8000/docs


## ☁️ Deployment
| Service | Platform | Purpose |
|---------|---------|-----------|
| Backend | Render | Containerized Python service |
| Frontend | Vercel | Static site hosting |
| Database | Render / Supabase | Managed PostgreSQL |
| Monitoring | UptimeRobot | 24/7 health checks |
  

<div align="center">

Made with ❤️ by Sujal Agrawal

</div>
