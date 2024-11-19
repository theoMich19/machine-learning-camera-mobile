const express = require("express");
const multer = require("multer");
const { spawn } = require("child_process");
const path = require("path");
const app = express();

// Configuration de multer pour la gestion des uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Les images seront sauvegardées dans le dossier 'uploads/'
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nomme le fichier avec timestamp + extension
  },
});

const upload = multer({ storage: storage });

// Route pour recevoir l'image
app.post("/process-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucune image n'a été envoyée" });
  }

  const imagePath = req.file.path;

  // Appel du script Python avec le chemin de l'image comme paramètre
  const pythonProcess = spawn("python", ["script.py", imagePath]);

  let pythonData = "";

  // Récupération de la sortie du script Python
  pythonProcess.stdout.on("data", (data) => {
    pythonData += data.toString();
  });

  // Gestion des erreurs du script Python
  pythonProcess.stderr.on("data", (data) => {
    console.error(`Erreur du script Python: ${data}`);
  });

  // Lorsque le script Python se termine
  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      return res
        .status(500)
        .json({ error: "Erreur lors de l'exécution du script Python" });
    }
    res.json({
      result: pythonData,
      imagePath: imagePath,
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
