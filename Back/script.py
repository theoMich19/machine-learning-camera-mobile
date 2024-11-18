import os
import sys
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from nltk.corpus import stopwords
import nltk

# Vérifier si les données nécessaires sont déjà téléchargées
nltk_data_path = os.path.expanduser('~/nltk_data')
if not os.path.exists(nltk_data_path):
    nltk.download('stopwords', quiet=True)
else:
    try:
        stopwords.words('english')  # Essayer d'accéder aux stopwords
    except LookupError:
        nltk.download('stopwords', quiet=True)


def load_data(file_path):
    """Charger le dataset."""
    data = pd.read_csv(file_path)
    return data


def preprocess_data(data):
    """Préparer les données pour l'entraînement."""
    stop_words = stopwords.words('french')
    vectorizer = TfidfVectorizer(stop_words=stop_words, ngram_range=(1, 2), max_df=0.85)
    X = vectorizer.fit_transform(data['Comment'])
    return X, vectorizer


def train_kmeans(X, n_clusters=3):
    """Former le modèle K-means."""
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    kmeans.fit(X)
    return kmeans


def classify_comment(comment, vectorizer, kmeans):
    """Classifier un commentaire passé en entrée."""
    X_new = vectorizer.transform([comment])  # Transformer le commentaire
    cluster = kmeans.predict(X_new)  # Prédire le cluster
    return cluster[0]  # Retourner le numéro du cluster


if __name__ == "__main__":
    # Chemin du dataset
    file_path = "comments.csv"
    
    # Charger et traiter les données
    data = load_data(file_path)
    X, vectorizer = preprocess_data(data)
    
    # Former K-means
    kmeans = train_kmeans(X, n_clusters=3)
    
    # Lire le commentaire passé en argument
    comment_to_classify = sys.argv[1]
    
    # Classifier le commentaire
    cluster = classify_comment(comment_to_classify, vectorizer, kmeans)
    print(cluster)  # Retourner le cluster en sortie
