/* even if the server won't serve any HTML content, use this file to make
it listen for incoming connections and make the /server.js file cleaner
*/
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send({ response: 'Server app is alive' }).status(200);
});

module.exports = router;
