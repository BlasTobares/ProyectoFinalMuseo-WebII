const express = require('express');
const translate  = require("node-google-translate-skidz");
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());


/*app.get('/', (req, res) => {
    res.send('Hello World!');
});
*/

app.get('/translate', (req, res) => {
    const { title, culture, dynasty } = req.query;

    // Validar que 'title' y 'culture' existen. 'dynasty' podría ser opcional
    if (!title || !culture) {
        return res.status(400).send('Missing required parameters');
    }

    // Si 'dynasty' está vacío, envía una cadena vacía para evitar problemas
    const validDynasty = dynasty || '';

    // Traducir los campos usando el paquete de traducción
    const promises = [
        translate({ text: title, source: 'en', target: 'es' }),
        translate({ text: culture, source: 'en', target: 'es' }),
        translate({ text: validDynasty, source: 'en', target: 'es' }),
    ];

    Promise.all(promises)
        .then(results => {
            res.json({
                translatedTitle: results[0].translation,
                translatedCulture: results[1].translation,
                translatedDynasty: results[2].translation
            });
        })
        .catch(error => {
            console.error('Translation error:', error);
            res.status(500).json({ error: 'Error translating fields' });
        });
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});