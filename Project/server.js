import express from 'express';
const app = express();

app.use(express.static('src'));
app.use(express.static('src/libs'));
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
