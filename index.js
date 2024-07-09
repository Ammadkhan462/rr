const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

// Replace with the path to your service account key
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.post('/send-notification', (req, res) => {
  const { tokens, title, body } = req.body;

  const message = {
    notification: {
      title: title,
      body: body,
    },
    tokens: tokens,
  };

  admin.messaging().sendMulticast(message)
    .then((response) => {
      res.status(200).send('Notification sent successfully: ' + response.successCount + ' messages were sent successfully');
    })
    .catch((error) => {
      res.status(500).send('Error sending notification: ' + error);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
