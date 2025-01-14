// const express = require('express');
// const app = express();
//
// app.use(express.static('public', {
//     setHeaders: (res, path) => {
//         if (path.endsWith('.js')) {
//             res.setHeader('Content-Type', 'application/javascript');
//         }
//     }
// }));
//
// app.listen(3000, () => console.log('Server running on http://localhost:3000'));
import express from 'express';
import { fileURLToPath } from 'url';  // Import the fileURLToPath function
import path from 'path'; // Import path module

// Get the directory name in an ES module-friendly way
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'src')));
app.use('/libs', express.static('./libs'));
// Default route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'src', 'index.html'));
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
