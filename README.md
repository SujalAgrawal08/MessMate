
# MessMate 

A Data-Driven Hostel Mess Management Platform. Beyond basic management, the system employs an AI-driven Analytics Engine to provide nutritional insights, forecast food demand, and reduce wastage using regression analysis.


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

