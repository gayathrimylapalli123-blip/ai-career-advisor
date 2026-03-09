def predict_role(data):

    role = "Data Scientist"

    missing = []

    tools = data.get("q7","")
    ml = data.get("q4","")
    viz = data.get("q8","")

    if "statistics" not in tools.lower():
        missing.append("statistics")

    if ml == "None":
        missing.append("machine learning")

    if "matplotlib" not in viz.lower():
        missing.append("data visualization")

    return {
        "recommended_role": role,
        "missing_skills": missing
    }