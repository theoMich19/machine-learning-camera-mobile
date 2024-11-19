import os
import cv2
import numpy as np
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.applications.resnet50 import preprocess_input
from tensorflow.keras.preprocessing.image import img_to_array
from sklearn.metrics.pairwise import cosine_similarity

# Désactiver la barre de progression
model = ResNet50(weights="imagenet", include_top=False, pooling='avg', progress_bar=False)



def load_and_preprocess_image(image_path):
    """Charge et prétraite une image pour le modèle."""
    img = cv2.imread(image_path)
    img = cv2.resize(img, (224, 224))  # Dimension standard pour ResNet
    img = img_to_array(img)
    img = np.expand_dims(img, axis=0)
    img = preprocess_input(img)
    return img

def extract_features(image_path):
    """Extrait les caractéristiques de l'image en utilisant ResNet50."""
    img = load_and_preprocess_image(image_path)
    features = model.predict(img)
    return features

def find_images_in_subfolders(folder):
    """Parcourt un dossier et ses sous-dossiers pour trouver toutes les images."""
    image_paths = []
    for root, _, files in os.walk(folder):
        for file in files:
            if file.lower().endswith(('png', 'jpg', 'jpeg')):
                image_paths.append(os.path.join(root, file))
    return image_paths

def find_most_similar(upload_image, data_folder):
    """Trouve l'image la plus similaire dans le dossier data et ses sous-dossiers."""
    # Extraire les caractéristiques de l'image uploadée
    upload_features = extract_features(upload_image)
    
    similarities = {}
    # Parcourir toutes les images dans les sous-dossiers
    data_images = find_images_in_subfolders(data_folder)
    for data_image_path in data_images:
        data_features = extract_features(data_image_path)
        
        # Calcul de la similarité cosinus
        similarity = cosine_similarity(upload_features, data_features)[0][0]
        similarities[data_image_path] = similarity
    
    # Trouver l'image avec la similarité la plus élevée
    most_similar_image = max(similarities, key=similarities.get)
    return most_similar_image, similarities[most_similar_image]

def main():
    upload_folder = "./upload"
    data_folder = "./data"
    
    # Vérifier qu'il y a bien une image dans le dossier upload
    upload_images = [f for f in os.listdir(upload_folder) if f.lower().endswith(('png', 'jpg', 'jpeg'))]
    if not upload_images:
        print("Aucune image trouvée dans le dossier upload.")
        return

    upload_image = os.path.join(upload_folder, upload_images[0])  # On prend la première image
    most_similar_image, similarity_score = find_most_similar(upload_image, data_folder)

    print(f"L'image la plus similaire est : {most_similar_image} avec un score de similarité de {similarity_score:.2f}")

if __name__ == "__main__":
    main()
