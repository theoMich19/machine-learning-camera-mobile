const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");

const app = express();
app.use(bodyParser.json());

app.post("/classify", (req, res) => {
  const { comment } = req.body;

  if (!comment) {
    return res.status(400).send({ error: "Commentaire requis" });
  }

  // Appeler le script Python avec le commentaire
  exec(`python3 script.py "${comment}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erreur : ${error.message}`);
      return res
        .status(500)
        .send({ error: "Erreur d'exécution du script Python" });
    }
    if (stderr) {
      console.error(`Stderr : ${stderr}`);
      return res.status(500).send({ error: "Erreur dans le script Python" });
    }

    // Retourner le cluster au client
    const cluster = parseInt(stdout.trim(), 10);
    res.send({ cluster });
  });
});

// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});
