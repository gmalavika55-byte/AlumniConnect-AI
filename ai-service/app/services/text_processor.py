import re

def normalize_text(text: str) -> str:
    """
    Lowercase, trim whitespace, and clean punctuation from string.
    Handles null/None safely.
    """
    if not text:
        return ""
    # Lowercase
    s = str(text).lower().trim() if hasattr(str(text).lower(), 'trim') else str(text).lower().strip()
    # Remove non-alphanumeric except spaces, commas, pluses, dots (for C++, .NET, React.js)
    cleaned = re.sub(r'[^a-z0-9\s,\+\.#]', ' ', s)
    # Collapse multiple spaces
    return re.sub(r'\s+', ' ', cleaned).strip()

def extract_skill_set(skills_str: str) -> set:
    """
    Extract set of normalized skill tokens from comma-separated string.
    """
    if not skills_str:
        return set()
    raw_tokens = skills_str.split(',')
    result = set()
    for token in raw_tokens:
        cleaned = normalize_text(token)
        if cleaned:
            result.add(cleaned)
    return result
