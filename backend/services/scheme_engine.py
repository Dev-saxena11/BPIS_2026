# Government scheme mapping for detected issues

SCHEME_DATABASE = {

    "low_literacy": [
        "Samagra Shiksha Abhiyan",
        "Beti Bachao Beti Padhao",
        "PM Poshan Yojana"
    ],

    "high_population": [
        "National Health Mission",
        "Skill India Mission",
        "PM Jan Arogya Yojana"
    ],

    "very_low_literacy": [
        "Saakshar Bharat Mission",
        "Digital Literacy Mission"
    ]

}

def detect_issues(district_data):

    issues = []

    literacy = district_data["literacy_rate"]
    population = district_data["population"]

    # Rule 1
    if literacy < 55:
        issues.append("critical_literacy")

    # Rule 2
    elif literacy < 70:
        issues.append("low_literacy")

    # Rule 3
    if population > 1000000:
        issues.append("high_population")

    return issues

def recommend_schemes(district_data):

    issues = detect_issues(district_data)

    schemes = []

    for issue in issues:
        if issue in SCHEME_DATABASE:
            schemes.extend(SCHEME_DATABASE[issue])

    return {
        "district": district_data["district"],
        "issues": {f"{i.replace('_', ' ').title()}" for i in issues},
        "recommended_schemes": list(set(schemes))
    }