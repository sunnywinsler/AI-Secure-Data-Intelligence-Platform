from models import AnalysisResponse, AnalysisOptions

def apply_policy(response: AnalysisResponse, options: AnalysisOptions) -> AnalysisResponse:
    action = "allowed"
    
    if options.block_high_risk and response.risk_level in ["high", "critical"]:
        action = "blocked"
        
    elif options.mask and response.findings:
        action = "masked"
        
    response.action = action
    return response
