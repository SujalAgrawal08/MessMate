<div align="center">

# MessMate

### A Data-Driven Hostel Mess Management Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

[Live Demo](https://your-demo-link.com)

</div>

## Tech Stack

**Frontend:** React.js + Tailwind CSS (Responsive UI)

**Backend:** FastAPI (Python)

**Database:** PostgreSQL (Managed via SQLModel ORM)

**Data Science:** Pandas, NumPy, Scikit-Learn (Regression/Forecasting)

**NLP:** TextBlob (Sentiment Analysis)

**Authentication:** JWT (JSON Web Tokens) with Bcrypt hashing

**DevOps:** Docker, UptimeRobot (Heartbeat Monitoring)


## System Modules & Functionalities

### A. Authentication Module

* Login & Signup 
### B. Student Panel

* Digital Menu & Nutrition Analysis
* Opt-Out & Rebate System
* Feedback Submission
* QR Attendance Identity

### C. Admin Panel
* Smart QR Attendance Scanner
* Sentiment Analysis Dashboard
* Waste Log & Predictive Analytics
* Waste Log manual form
* Digital Menu

## Technical Implementation Highlights

### Cold Start Fix
A specialized /health endpoint was engineered to accept HEAD requests from UptimeRobot, preventing the server from sleeping.
```python
@app.head("/health")
def health_check(): return {"status": "active"}
```
## Deployment
* Backend: Deployed on Render (Containerized Python Service).
* Frontend: Deployed on Vercel.
* Monitoring: UptimeRobot ensures 24/7 availability.

## How to Run Locally
* Backend: 
```
pip install -r requirements.txt
uvicorn main:app --reload
```

* Frontend:
```
cd frontend
npm install
npm run dev
```

