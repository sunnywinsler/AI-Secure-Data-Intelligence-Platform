import re
from typing import List
from models import Finding

def detect_and_classify(text: str) -> List[Finding]:
    findings = []
    lines = text.split('\n')
    
    # Simple regex for MVP
    email_regex = r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+"
    password_regex = r"password\s*=\s*([^\s]{6,})"
    api_key_regex = r"api_key\s*=\s*(sk-[a-zA-Z0-9\-]+)"
    
    for i, line in enumerate(lines, 1):
        # Detect Emails (Low)
        for match in re.finditer(email_regex, line):
            findings.append(Finding(type="email", risk="low", line=i, value=match.group(0)))
            
        # Detect API Keys (High)
        for match in re.finditer(api_key_regex, line):
            findings.append(Finding(type="api_key", risk="high", line=i, value=None))  # Don't store value for high risk
            
        # Detect Passwords (Critical)
        for match in re.finditer(password_regex, line):
            findings.append(Finding(type="password", risk="critical", line=i, value=None))
            
        # Detect Stack Trace (Medium) - naive check
        if "Exception" in line or "Traceback" in line or "at " in line and ".java:" in line:
            findings.append(Finding(type="stack_trace", risk="medium", line=i, value=None))
            
    return findings
