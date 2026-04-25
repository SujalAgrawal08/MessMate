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
| 📈 **Demand Forecasting** | Offline ML pipeline engineering temporal features for precise attendance forecasting |
| ♻️ **Waste Reduction** | Linear Regression pipeline reducing baseline waste prediction error (MAE) by 27%+ |
| 💬 **Sentiment Analysis** | NLP-driven feedback processing for quality insights |

> **Impact Metrics:** Designed to serve 500+ students with <100ms API response times

---

## 🏗 System Architecture

```mermaid
graph TD
    %% Theme Styling
    classDef baseNode fill:#000000,stroke:#00ffff,stroke-width:2px,color:#ffffff;
    classDef highlightNode fill:#00ffff,stroke:#000000,stroke-width:2px,color:#000000;
    classDef whiteNode fill:#ffffff,stroke:#000000,stroke-width:2px,color:#000000;
    linkStyle default stroke:#00ffff,stroke-width:2px;

    subgraph Client_Side [Client Side]
        direction TB
        Student[Student Panel]:::baseNode
        Admin[Admin Panel]:::baseNode
    end

    subgraph Backend_Infrastructure [Backend Infrastructure]
        LB[Render Load Balancer]:::whiteNode
        API[FastAPI Backend]:::baseNode
        ML[ML Engine & Analytics]:::baseNode
    end

    subgraph Data_Persistence [Data Layer]
        DB[(PostgreSQL Database)]:::highlightNode
    end

    subgraph External_Services [External]
        Uptime[UptimeRobot Monitor]:::whiteNode
    end

    Student -->|HTTP Request| LB
    Admin -->|HTTP Request| LB
    LB --> API
    API -->|Read/Write| DB
    API -->|Data Processing| ML
    
    Uptime -->|HEAD Request /health| API
    
    %% Subgraph Styling
    style Client_Side fill:#1a1a1a,stroke:#ffffff,color:#ffffff
    style Backend_Infrastructure fill:#1a1a1a,stroke:#ffffff,color:#ffffff
    style Data_Persistence fill:#1a1a1a,stroke:#ffffff,color:#ffffff
    style External_Services fill:#1a1a1a,stroke:#ffffff,color:#ffffff
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

<div align="center">

<table>
<tr>
<td width="50%" valign="top">

### 🎓 Student Panel

| | Feature | Description |
|:-:|:--------|:------------|
| 📱 | **Digital Menu** | Browse daily/weekly menus with nutritional breakdown |
| 🥗 | **Nutrition AI** | AI-powered dietary insights and recommendations |
| ⏭️ | **Meal Opt-Out** | Skip meals & automatically receive rebates |
| 💬 | **Feedback** | Rate meals and submit detailed reviews |
| 🎫 | **QR Identity** | Unique QR code for attendance verification |
| 📊 | **Dashboard** | Personal stats and spending analytics |

</td>
<td width="50%" valign="top">

### 🔐 Admin Panel

| | Feature | Description |
|:-:|:--------|:------------|
| 📷 | **QR Scanner** | Real-time meal attendance tracking |
| 📊 | **Sentiment Dashboard** | NLP-powered feedback analysis |
| 📈 | **Predictive Analytics** | ML-driven demand forecasting |
| 🍽️ | **Menu Manager** | Full CRUD with nutrition data |
| ♻️ | **Waste Tracking** | Log and analyze food waste |
| 👥 | **User Management** | Student accounts & bulk ops |

</td>
</tr>
</table>

</div>

## 🏗 Workflow

### Smart QR Attendance Workflow

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#000000',
    'primaryTextColor': '#ffffff',
    'primaryBorderColor': '#00ffff',
    'lineColor': '#00ffff',
    'textColor': '#ffffff',
    'noteBkgColor': '#00ffff',
    'noteTextColor': '#000000',
    'noteBorderColor': '#ffffff',
    'actorBkg': '#000000',
    'actorBorder': '#00ffff',
    'actorTextColor': '#ffffff'
  }
}}%%
sequenceDiagram
    participant Student as Student App (Static QR)
    participant Admin as Admin Scanner
    participant API as Backend API
    participant DB as Database

    Student->>Admin: Shows Static QR Code
    Admin->>API: POST /scan (Student ID)
    
    activate API
    API->>DB: Check "Opt-Out" Status
    
    alt Student has Opted Out
        DB-->>API: Status: Opted-Out
        API-->>Admin: ❌ REJECT: "Rebate Applied"
    else Student is Active
        API->>DB: Check "Already Eaten" Log
        
        alt Already Eaten
            DB-->>API: Found entry for today
            API-->>Admin: ❌ REJECT: "Already Redeemed"
        else First Time
            API->>DB: Create Attendance Record
            DB-->>API: Success
            API-->>Admin: ✅ ALLOW: "Attendance Marked"
        end
    end
    deactivate API
```
### ML & Analytics Pipeline

```mermaid
flowchart LR
    %% Theme Styling
    classDef input fill:#ffffff,stroke:#000000,stroke-width:2px,color:#000000;
    classDef process fill:#000000,stroke:#00ffff,stroke-width:2px,color:#ffffff;
    classDef output fill:#00ffff,stroke:#000000,stroke-width:2px,color:#000000;
    linkStyle default stroke:#ffffff,stroke-width:2px;

    subgraph Input_Sources [Data Sources]
        Feedback[Student Feedback]:::input
        Attendance[Daily Attendance]:::input
        WasteLog[Waste Logs kg]:::input
    end

    subgraph Processing_Engine [Processing Layer]
        NLP[TextBlob NLP]:::process
        Reg[Linear Regression Model]:::process
        MovAvg[Moving Average Algo]:::process
    end

    subgraph Output_Insights [Insights]
        Sentiment[Sentiment Score]:::output
        WastePred[Waste Prediction kg]:::output
        Demand[Next Day Demand]:::output
    end

    Feedback --> NLP
    NLP --> Sentiment
    
    Attendance --> Reg
    WasteLog --> Reg
    Reg --> WastePred
    
    Attendance --> MovAvg
    MovAvg --> Demand
    
    %% Subgraph Backgrounds
    style Input_Sources fill:#1a1a1a,stroke:#ffffff,color:#ffffff
    style Processing_Engine fill:#1a1a1a,stroke:#ffffff,color:#ffffff
    style Output_Insights fill:#1a1a1a,stroke:#ffffff,color:#ffffff
```
### Automated Keep-Alive Architecture

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#000000',
    'primaryTextColor': '#ffffff',
    'primaryBorderColor': '#00ffff',
    'lineColor': '#ffffff',
    'textColor': '#ffffff',
    'noteBkgColor': '#00ffff',
    'noteTextColor': '#000000',
    'signalColor': '#00ffff',
    'actorBkg': '#000000',
    'actorBorder': '#ffffff'
  }
}}%%
sequenceDiagram
    participant Cron as GitHub Actions
    participant API as FastAPI Backend
    participant DB as Supabase DB

    Note over Cron, API: Scheduled Ping (Every 10 mins)
    
    Cron->>API: GET /keep-alive
    
    alt Free Tier Sleep Avoidance
        API->>DB: Execute SELECT 1
        DB-->>API: Query Success
        API-->>Cron: 200 OK
        Note right of API: ✅ Backend & DB Awake ⚡
    end
```

## Technical Implementation Highlights

### 1. Production ML Pipeline
Decoupled offline training from real-time inference. The system automatically engineers temporal features (rolling averages, lag waste) and serializes a scikit-learn pipeline (`joblib`) for sub-100ms API inference, logging all requests for telemetry.

### 2. Zero-Maintenance Keep-Alive
Engineered an automated endpoint pinged via GitHub Actions every 10 minutes. It executes a lightweight database query to prevent both the Render FastAPI container and Supabase database from sleeping due to free-tier inactivity rules.
```python
@app.get("/keep-alive")
def keep_alive(session: Session = Depends(get_session)):
    session.exec(text("SELECT 1;")) # Keeps DB pool active
    return {"status": "alive"}
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
