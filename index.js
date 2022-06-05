const debug = require('debug')('app:startup');
require('dotenv').config()
const config = require('config');
const express = require('express');
const app = express();
const Joi = require('joi');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./logger')
const authenticator = require('./authenticator')


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());


//Configuration
console.log('Application Name: ' + config.get('name'))
console.log('Mail Server: ' + config.get('mail.host'))
console.log('Mail password: ' + config.get('mail.password'))
console.log('DEBUG: ' + config.get('DEBUG'))


if (config.get('NODE_ENV') === 'development') {
    app.use(morgan('tiny'));
    debug('Morgan enabled...');
    console.log('wiggle')
};


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(logger);

app.use(authenticator);


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
});

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
};