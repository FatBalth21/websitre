const express = require('express')
const app = express()
const port = 4000
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const router = require("./routes.js");


app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'Nanoo ghar',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,  // set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    }
}));

app.use('/', router);
app.use('/Signup', router);
app.use('/Login', router);
app.use('/Profile',router);
app.use('/signup',router);
app.use('/login',router);

app.get('/Test.html', function (req, res) { // this is a page to test features
    customrender1('/Test.html'); 
    res.send(output);
});
app.post('/dashboard', (req, res) => {

})
app.post('/upload', (req, res) => {//test page for images

});




//allows express to use images from designated libraries
app.use(express.static('./userinfo/userpfp/'));
app.use(express.static('./static/images/'));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
