const express = require('express');
const app = express();
const Joi = require('joi');

app.use(express.json());

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

const genres = [
    { id: 1, name: "action" },
    { id: 2, name: "thriller" },
    { id: 3, name: "fantasy" },
    { id: 4, name: "sci-Fi" },
]

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(genre)
}

// ******* GET Request handler *******
app.get('/api/genres', (req, res) => {
    res.status(200).send(genres)
})

app.get('/api/genres/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('genre id not found')
    res.status(200).send(genre)
})

app.get('/api/genre/:name', (req, res) => {
    const genre = genres.find(g => g.name === req.params.name);
    if (!genre) return res.status(404).send('genre name not found')
    res.status(200).send(genre)
})

// ******* Post Request handler *******
app.post('/api/genres', (req, res) => {
    const { error } = validateGenre(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    const genre = {
        id: genres.length + 1,
        name: req.body.name
    }

    genres.push(genre)
    res.send(genre)
})

// ******* Update Request handler *******

app.put('/api/genres/:id', (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = genres.find(g => g.id === parseInt(req.params.id));

    genre.name = req.body.name;
    res.send(genre)
})

// ******* Delete Request handler *******
app.delete('/api/genres/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id))
    if (!genre) return res.status(404).send('genre name not found')

    const index = genres.indexOf(genre);
    genres.splice(index, 1)

    res.send(genre)

})