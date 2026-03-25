import asyncio
from models import AnalysisRequest, AnalysisOptions
from main import analyze_data

async def run_test():
    log_content = """2026-03-10 10:00:01 INFO User login  
email=admin@company.com  
password=admin123  
api_key=sk-prod-xyz-123  
ERROR stack trace: NullPointerException at service.java:45"""
    req = AnalysisRequest(
        input_type="log",
        content=log_content,
        options=AnalysisOptions(mask=True, block_high_risk=False, log_analysis=True)
    )
    res = await analyze_data(req)
    print("Risk Level:", res.risk_level)
    print("Risk Score:", res.risk_score)
    print("Action:", res.action)
    print("Summary:", res.summary)
    
    for f in res.findings:
        print(f"Detected: {f.type} at line {f.line} [Risk: {f.risk}]")

if __name__ == "__main__":
    asyncio.run(run_test())
