const express = require('express');
const app = express();
const Joi = require('joi');

app.use(express.json());

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

const courses = [
    { id: 1, name: "course1" },
    { id: 2, name: "course2" },
    { id: 3, name: "course3" },
];


// ********* GET Request handlers *********
app.get('/', (req, res) => {
    res.send('Hello World')
});


app.get('/api/courses', (req, res) => {
    res.send(courses)
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('Course id not found');
    res.send(course)
});

// ********* POST Request handlers *********
app.post('/api/courses', (req, res) => {

    const { error } = validateCourse(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name

    };

    courses.push(course);
    res.send(course);
})

// ********* PUT Request handlers *********
app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('Course id not found');

    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    course.name = req.body.name;
    res.send(course);
});

// ********* Delete Request handlers *********
app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('Course id not found');

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});


// ********* Functions *********
function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(course)
}

