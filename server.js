const express = require('express')
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');

/* create the server */
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* host public/ directory to serve: images, css, js, etc. */
app.use(express.static('public'));


app.use(bodyParser.json());


app.use(bodyParser.urlencoded({ extended: true }));


app.use(fileUpload())

/* path routing and endpoints */
app.use('/', require('./path_router'));


app.get('*', (req, res) => {
    res.status(404);
    res.render('404-page'); 
});

/* start the server */
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});