
# pyre-ignore-all-errors
import base64
import io
import PyPDF2

def parse_input(input_type: str, content: str) -> str:
    if input_type == "file" or input_type == "pdf":
        try:
            # Decode base64 payload from frontend
            pdf_data = base64.b64decode(content)
            pdf_stream = io.BytesIO(pdf_data)
            
            reader = PyPDF2.PdfReader(pdf_stream)
            extracted_text_parts = []
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    extracted_text_parts.append(str(text))
            return "\n".join(extracted_text_parts)
        except Exception as e:
            return f"[Parser Error] Failed to extract document: {str(e)}"
    
    # Text, logs, and SQL arrive as raw text strings
    return content
