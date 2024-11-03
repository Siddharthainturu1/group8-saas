const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();
const vision = require('@google-cloud/vision');

// Specify the path to the key file explicitly
const client = new vision.ImageAnnotatorClient({
  keyFilename: 'C:/Users/Hp/Downloads/g8-saas-eae4345eb45b.json'
});


// Enable file upload handling
app.use(fileUpload());

// Serve the HTML form at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle image upload and label detection
app.post('/upload', async (req, res) => {
  if (!req.files || !req.files.image) {
    return res.status(400).send('No image uploaded');
  }

  try {
    const imageBuffer = req.files.image.data;
    const [result] = await client.labelDetection(imageBuffer);
    const labels = result.labelAnnotations.map(label => label.description);

    res.send(`<h3>Detected Labels:</h3><ul>${labels.map(label => `<li>${label}</li>`).join('')}</ul>`);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
