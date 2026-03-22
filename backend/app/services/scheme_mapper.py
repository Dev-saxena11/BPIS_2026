def get_schemes_for_district(d):
    schemes = []

    # Education-based rules
    if d["literacy_rate"] < 60:
        schemes.append("Samagra Shiksha Abhiyan")
        schemes.append("Mid-Day Meal Scheme")

    if d["literacy_rate"] < 50:
        schemes.append("Digital Literacy Mission")

    # Population-based rules
    if d["population"] > 1_000_000:
        schemes.append("School Infrastructure Expansion Program")

    # High priority intervention
    if d["priority_score"] > 90:
        schemes.append("High Priority Intervention Package")

    return schemes