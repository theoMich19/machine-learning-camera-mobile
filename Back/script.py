import os
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense
from tensorflow.keras.preprocessing import image
import numpy as np
import matplotlib.pyplot as plt
import argparse  # Importation de argparse pour gérer les arguments

# Configuration des chemins
base_dir = "data"  # Remplacez par le chemin de votre dossier
model_path = 'cosplay_classifier.h5'

# Création d'un parseur d'arguments
parser = argparse.ArgumentParser(description='Classifie une image avec le modèle de cosplays.')
parser.add_argument('image_to_predict', type=str, help='Chemin de l\'image à classifier')

# Récupération des arguments passés en ligne de commande
args = parser.parse_args()
image_to_predict = args.image_to_predict

# Vérification des données
print(f"Chargement des dossiers depuis : {base_dir}")
class_names = [f.name for f in os.scandir(base_dir) if f.is_dir()]
print(f"Personnages trouvés : {class_names}")

# Paramètres d'image par défaut
img_height, img_width = 224, 224  # Taille par défaut

def get_model_input_shape(model):
    """
    Obtient la taille d'entrée du modèle de manière sécurisée
    """
    try:
        # Essayer différentes méthodes pour obtenir la forme d'entrée
        if hasattr(model, 'get_config'):
            config = model.get_config()
            if 'layers' in config and len(config['layers']) > 0:
                first_layer = config['layers'][0]
                if 'config' in first_layer and 'batch_input_shape' in first_layer['config']:
                    input_shape = first_layer['config']['batch_input_shape']
                    if input_shape and len(input_shape) == 4:
                        return input_shape[1], input_shape[2]
    except Exception as e:
        print(f"Erreur lors de la détection de la taille d'entrée : {str(e)}")
    
    # Si on ne peut pas obtenir la taille, retourner la taille par défaut
    return 224, 224

# Vérification si le modèle existe déjà
if os.path.exists(model_path):
    print("Chargement du modèle existant...")
    model = load_model(model_path)
    print("Modèle chargé avec succès!")
    
    # Obtenir la taille d'entrée attendue par le modèle
    img_height, img_width = get_model_input_shape(model)
    print(f"Taille d'image attendue par le modèle : {img_height}x{img_width}")
else:
    print("Création et entraînement d'un nouveau modèle...")
    
    # Préparation des données
    datagen = ImageDataGenerator(
        rescale=1.0 / 255,
        validation_split=0.2
    )

    train_data = datagen.flow_from_directory(
        base_dir,
        target_size=(img_height, img_width),
        batch_size=32,
        class_mode='categorical',
        subset='training'
    )

    val_data = datagen.flow_from_directory(
        base_dir,
        target_size=(img_height, img_width),
        batch_size=32,
        class_mode='categorical',
        subset='validation'
    )

    # Construction du modèle
    model = Sequential([
        Conv2D(32, (3, 3), activation='relu', input_shape=(img_height, img_width, 3)),
        MaxPooling2D((2, 2)),
        Conv2D(64, (3, 3), activation='relu'),
        MaxPooling2D((2, 2)),
        Flatten(),
        Dense(128, activation='relu'),
        Dense(len(class_names), activation='softmax')
    ])

    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

    # Entraînement
    epochs = 10
    model.fit(train_data, validation_data=val_data, epochs=epochs)

    # Sauvegarder le modèle
    model.save(model_path)
    print(f"Nouveau modèle entraîné et sauvegardé dans {model_path}")

# Prédiction sur une nouvelle image
print(f"\nPrédiction sur l'image : {image_to_predict}")
try:
    # Chargement et redimensionnement de l'image selon la taille attendue par le modèle
    img = image.load_img(image_to_predict, target_size=(img_height, img_width))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Prédiction
    predictions = model.predict(img_array)
    predicted_class = class_names[np.argmax(predictions)]
    confidence = np.max(predictions) * 100

    print(f"L'image correspond probablement au personnage : {predicted_class}")
    print(f"Confiance : {confidence:.2f}%")

    # Afficher l'image prédite
    plt.figure(figsize=(8, 8))
    plt.imshow(img)
    plt.title(f"Prédiction : {predicted_class}\nConfiance : {confidence:.2f}%")
    plt.axis('off')
    plt.show()

except Exception as e:
    print(f"Erreur lors de la prédiction : {str(e)}")
    print("Détails supplémentaires :")
    if 'img_array' in locals():
        print(f"Shape de l'image en entrée : {img_array.shape}")
    print(f"Taille d'image utilisée : {img_height}x{img_width}")
    
    # Afficher un résumé du modèle pour le débogage
    print("\nStructure du modèle :")
    model.summary()
