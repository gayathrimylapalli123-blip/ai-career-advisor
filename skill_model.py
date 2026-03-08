from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

skill_clusters = {

    "AI Engineer": ["python","machine learning","deep learning","tensorflow","pytorch","nlp"],

    "Data Scientist": ["python","statistics","machine learning","pandas","data visualization"],

    "Data Engineer": ["python","sql","spark","hadoop","etl"],

    "Cloud Engineer": ["aws","docker","kubernetes","terraform","linux"],

    "Software Engineer": ["python","java","nodejs","rest api","git"]

}

def analyze_skills(user_skills):

    user_text = " ".join(user_skills)

    job_roles = list(skill_clusters.keys())
    job_skills = [" ".join(skill_clusters[r]) for r in job_roles]

    corpus = job_skills + [user_text]

    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(corpus)

    similarity = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1])

    scores = similarity.flatten()

    best_index = scores.argmax()

    best_role = job_roles[best_index]

    missing_skills = list(set(skill_clusters[best_role]) - set(user_skills))

    return {
        "recommended_role": best_role,
        "scores": scores.tolist(),
        "missing_skills": missing_skills
    }