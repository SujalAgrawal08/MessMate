<div align="center">

# MessMate

### A Data-Driven Hostel Mess Management Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

<br/>

[![Live Demo](https://img.shields.io/badge/✨_LIVE_DEMO-TRY_IT_NOW-ff6b6b?style=for-the-badge)](https://messmate-iiitu.vercel.app)
[![Report Bug](https://img.shields.io/badge/🐛_Report_Bug-Issues-DC3545?style=for-the-badge)](../../issues)
[![Request Feature](https://img.shields.io/badge/💡_Request_Feature-Ideas-28A745?style=for-the-badge)](../../issues)

---

<img src="https://drive.google.com/file/d/19X16aslFWfeYC9uiwih1eOpolpogYqsr" alt="Homepage" width="80%"/>

<br/><br/>

<img src="https://drive.google.com/file/d/1qf6PZKKGJi-6ZiHjONMn2fzbGxq-ZS1a" alt="Login Page" width="80%"/>
</div>

## About

**MessMate** transforms traditional hostel mess management through intelligent automation and data analytics. Beyond basic management, the platform employs an **AI-driven Analytics Engine** that provides:

- 🥗 **Nutritional insights** for balanced meal planning
- 📈 **Demand forecasting** using regression analysis
- ♻️ **Waste reduction** through predictive analytics

> Built to streamline operations, enhance student experience, and promote sustainable food management.


## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React.js, Three.js, Tailwind CSS |
| **Backend** | FastAPI (Python) |
| **Database** | PostgreSQL + SQLModel ORM |
| **Data Science** | Pandas, NumPy, Scikit-Learn |
| **NLP** | TextBlob (Sentiment Analysis) |
| **Auth** | JWT + Bcrypt |
| **DevOps** | Docker, UptimeRobot |

---

## ✨ Features

### Authentication Module
| Feature | Description |
|---------|-------------|
| Secure Login/Signup | JWT-based authentication with Bcrypt password hashing |
| Role-based Access | Separate flows for students and administrators |

### Student Panel
| Feature | Description |
|---------|-------------|
| Digital Menu | Browse daily/weekly menus with nutritional breakdown |
| Nutrition Analysis | AI-powered dietary insights and recommendations |
| Opt-Out & Rebate | Skip meals and automatically receive rebates |
| Feedback System | Submit and track meal feedback |
| QR Identity | Unique QR code for attendance verification |

### Admin Panel
| Feature | Description |
|---------|-------------|
| QR Attendance Scanner | Real-time meal attendance tracking |
| Sentiment Dashboard | NLP-powered feedback analysis with trends |
| Predictive Analytics | ML-driven waste forecasting and demand prediction |
| Waste Logging | Manual and automated waste tracking |
| Menu Management | Create and update digital menus |

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
