const express = require('express');
const cors = require('cors');

const porta = 3000;

const app = express();
app.use(express.json());
app.use(express.static(__dirname));
app.use(cors());

//rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(porta, () => console.log(`Servidor rodando em http://localhost:${porta}`));