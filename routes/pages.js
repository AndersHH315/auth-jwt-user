const express = require('express');
const router = express.Router(); // Här skapar vi en instans av Router
const path = require('path'); // Inbyggd core module.

router.get('/batcave', (req, res) => { // Endpoint för batcave.
    res.sendFile(path.resolve('public/batcave.html')); // Skickar vi batcave.html till frontend.
});

module.exports = router;