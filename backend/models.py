
# pyre-ignore-all-errors
from pydantic import BaseModel, Field
from typing import List, Optional, Literal

class AnalysisOptions(BaseModel):
    mask: bool = False
    block_high_risk: bool = False
    log_analysis: bool = False

class AnalysisRequest(BaseModel):
    input_type: Literal["text", "file", "sql", "chat", "log"]
    content: str
    options: AnalysisOptions = Field(default_factory=AnalysisOptions)

class Finding(BaseModel):
    type: str # e.g., "api_key", "password"
    risk: Literal["critical", "high", "medium", "low"]
    line: Optional[int] = None
    value: Optional[str] = None

class AnalysisResponse(BaseModel):
    summary: str
    content_type: str
    findings: List[Finding]
    risk_score: int
    risk_level: Literal["critical", "high", "medium", "low"]
    action: Literal["allowed", "masked", "blocked", "none"]
    insights: List[str]
    extracted_text: Optional[str] = None
