from typing import List, Dict, Any
import os
from models import Finding

def generate_insights(text: str, findings: List[Finding]) -> Dict[str, Any]:
    # Placeholder for actual OpenAI call
    # In reality, we would use openai.ChatCompletion.create()
    api_key = os.getenv("OPENAI_API_KEY")
    
    insights = []
    
    has_critical = any(f.risk == "critical" for f in findings)
    has_high = any(f.risk == "high" for f in findings)
    
    if has_critical or has_high:
        insights.append("Sensitive credentials exposed in logs")
        
    if any(f.type == "stack_trace" for f in findings):
        insights.append("Stack trace reveals internal system details")
        
    summary = "Log contains sensitive credentials and system errors" if insights else "Log activity appears normal"
    
    if not api_key:
        insights.append("[Mock] Provide OPENAI_API_KEY for real AI insights.")
        
    return {
        "summary": summary,
        "insights": insights
    }
