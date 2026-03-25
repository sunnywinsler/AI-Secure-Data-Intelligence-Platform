# AI Secure Data Intelligence Platform

🚀 **Live Frontend Demo:** [https://ai-secure-data-intelligence-platform.vercel.app](https://ai-secure-data-intelligence-platfor.vercel.app) 
⚙️ **Live Backend API:** [https://ai-secure-data-intelligence-platform-phze.onrender.com](https://ai-secure-data-intelligence-platform-phze.onrender.com)
An end-to-end platform acting as an AI Gateway, Data Scanner, Log Analyzer, and Risk Engine. The system analyzes ingested data (files, text, logs) for sensitive entities like PII and credentials, calculates a security risk score, and generates actionable AI insights.

## Project Structure
- **Backend**: Python / FastAPI (Handles parsing, detection, AI insights, and policy enforcement)
- **Frontend**: React / Next.js / TailwindCSS (Visualizes logs, entities, and analysis results)

## Getting Started

### 1. Backend Setup

Open a terminal in the `backend/` directory:

1. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # On Windows
   .\venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```
2. Install the requirements:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file in the `backend/` directory to enable remote insights (optional):
   ```
   OPENAI_API_KEY=your-api-key-here
   ```
4. Start the server:
   ```bash
   uvicorn main:app --reload
   ```
   *(The API will be available at `http://localhost:8000`)*

### 2. Frontend Setup

Open a terminal in the `frontend/` directory:

1. Install Node dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
   *(The web interface will be available at `http://localhost:3000`)*

## Features
- ✅ Automatic Document Parsing (Text, SQL, Logs, PDF)
- ✅ Regex-based Risk/PII Entity Detection (Passwords, APIs, Emails)
- ✅ Flexible Policy Engine configuration 
- ✅ Data Visualization UI
