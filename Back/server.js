const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware pour parser le JSON
app.use(bodyParser.json());

// Configurer multer pour gérer les fichiers uploadés
const upload = multer({
  dest: './upload', // Dossier où les fichiers seront stockés temporairement
  limits: { fileSize: 10 * 1024 * 1024 }, // Taille max : 10 MB
});

// Route POST pour analyser une image
app.post('/analyze', upload.single('image'), (req, res) => {
  // Vérification si un fichier a été uploadé
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier envoyé.' });
  }

  const uploadedImagePath = path.resolve(req.file.path);

  // Commande pour exécuter le script Python
  const pythonCommand = `python3 ./script.py`;

  console.log(`Exécution de la commande : ${pythonCommand}`);

  // Exécution du script Python
  exec(pythonCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erreur lors de l'exécution du script : ${error.message}`);
      return res.status(500).json({ error: 'Erreur interne du serveur' });
    }

    if (stderr) {
      console.error(`Erreur Python : ${stderr}`);
      return res.status(500).json({ error: 'Erreur dans le script Python', details: stderr });
    }

    // Retourner la réponse du script Python
    res.json({ message: 'Analyse terminée', result: stdout });
  });
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
