
# pyre-ignore-all-errors
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import AnalysisRequest, AnalysisResponse
from services.parser import parse_input
from services.detector import detect_and_classify
from services.ai_analyzer import generate_insights
from services.policy import apply_policy

app = FastAPI(title="AI Secure Data Intelligence Platform")

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "AI Secure Data Intelligence Platform API"}

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_data(request: AnalysisRequest):
    try:
        # Step 1: Parse the input
        extracted_text = parse_input(request.input_type, request.content)

        # Step 2: Detect patterns and calculate risk
        findings = detect_and_classify(extracted_text)

        # Step 3: Optional AI Analysis
        ai_summary = ""
        ai_insights = []
        if request.options.log_analysis:
            ai_data = generate_insights(extracted_text, findings)
            ai_summary = ai_data.get("summary", "Analysis complete.")
            ai_insights = ai_data.get("insights", [])

        # Step 4: Combine into raw response
        # Default derived values
        max_risk_level = "low"
        max_score = 0
        risk_weights = {"critical": 10, "high": 5, "medium": 3, "low": 1}
        
        for f in findings:
            if risk_weights.get(f.risk, 0) > max_score:
                max_score = risk_weights.get(f.risk, 0)
                max_risk_level = f.risk

        raw_response = AnalysisResponse(
            summary=ai_summary if ai_summary else f"Analyzed {request.input_type} content.",
            content_type=request.input_type,
            findings=findings,
            risk_score=sum(risk_weights.get(f.risk, 0) for f in findings),
            risk_level=max_risk_level,
            action="none",
            insights=ai_insights,
            extracted_text=extracted_text
        )

        # Step 5: Policy Engine
        final_response = apply_policy(raw_response, request.options)

        return final_response
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
