const express = require('express')
const app = express()
const port = 4000
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session');
const loggedoutheader = fs.readFileSync('./loggedoutheader.html', 'utf8');
const loggedinheader = fs.readFileSync('./loggedinheader.html', 'utf8');
const footer = fs.readFileSync('./footer.html', 'utf8');

let storedPassword = "";
let emailuser = "";
let str = ' '
let base = loggedoutheader + footer

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'Nanoo ghar',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false,  // set to true if using HTTPS
  maxAge: 24*60*60*1000 // 24 hours in milliseconds
  }
}));

app.get('/', (req, res) => { // specify endpoint(name)
  res.send(base)
})
app.get('/Signup.html', function (req, res) {
  customrender('/Signup.html')
  res.send(output)
});
app.get('/Login.html', function (req, res) {
  customrender('/Login.html')
  res.send(output)
});
app.get('/dashboard.html', (req, res) => {
  // Check if user is authenticated
  if (req.session.email) {
    // If authenticated, render the dashboard page
    customrender1('/dashboard.html')
    res.send(output)
  } else {
    // If not authenticated, redirect to the login page
    res.redirect('/login')
  }
})
app.get('/Profile', (req, res) => {
  const emailuser = req.session.email;
  console.log(emailuser);
  let username = '';
  const credentials = fs.readFileSync('./credentials.txt', 'utf8');
  const lines = credentials.split('\n');
  lines.forEach((line, index) => {
    if (line.includes(emailuser)) {
      const lineArray = line.split(',');
      username = lineArray[0] + lineArray[1];
    }
  });
  const userFile = './userinfo/user_address_num/' + emailuser + '.txt';
  const infoUploaded = fs.existsSync(userFile);
  let output = '';
  if (infoUploaded) {
    // If both files exist, read the address and phone number and render the profile page
    const userFileContents = fs.readFileSync(userFile, 'utf8');
    const [address, phone] = userFileContents.split('\n');
    output = customrenderprofile('/dashboard.html');
    output += `
      <h1>Welcome ${username}</h1>
      <p>Address: ${address}</p>
      <p>Phone Number: ${phone}</p>
    `;
    
  } else {
    // If either file does not exist, render the profile page with a message
    output = customrenderprofile('/Profile.html');
    output += `
      <h1>Welcome ${username}</h1>
      <p>You have not uploaded your address and phone number yet.</p>
    `;
  }
  res.send(output);
});


app.post('/dashboard', (req, res) => {

})
app.post('/userinfo', (req,res) => {
  const emailuser = req.session.email;
  const userFile = './userinfo/user_address_num/' + emailuser + '.txt';
  const infoUploaded = fs.existsSync(userFile);
  // Check if user has already uploaded information
  if (infoUploaded) {
    // If both files already exist, redirect to the profile page
    res.redirect('/Profile');
  } else {
    const address = req.body.address;
    const number = req.body.phone;
    // const pic = req.body.picture; // Not sure what this is for

    // Otherwise, write the address and number to the files and redirect to the profile page
    fs.writeFileSync(userFile, address + '\n' + number, 'utf8');
    //fs.writeFileSync('./userinfo/userpfp/' + emailuser + '.png', pic, 'binary')

    res.redirect('/Profile');
  }
});

app.post('/signup', (req, res) => {
  const fname = req.body.firstname;
  const lname = req.body.lastname;
  const email = req.body.email;
  const password = req.body.password;
  fs.readFile('./credentials.txt', 'utf8', (err, data) => {
    if (err) throw err;
    const lines = data.split('\n'); // split the data into an array of lines
    let emailFound = false;
    lines.forEach((line, index) => {
      if (line.includes(email)) {
        emailFound = true;
        res.send('Choose another email');
      }
    });
    if (!emailFound) {
      fs.appendFile('credentials.txt', `${fname},${lname},${email},${password}\n`, (err) => {
        if (err) throw err;
        console.log('You signed up');
        res.redirect('./Login.html');
      });
    }
  });
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log('You logged in');
  fs.readFile('./credentials.txt', 'utf8', (err, data) => {
    if (err) throw err;
    const lines = data.split('\n'); // split the data into an array of lines
    let storedPassword = '';
    lines.forEach((line, index) => {
      if (line.includes(email)) {
        const lineArray = line.split(',');
        storedPassword = lineArray[3];
      }
    });
    if (storedPassword === password) {
      req.session.email = email;
      emailuser = email;
      res.redirect('/dashboard.html')
    } else {
      res.send('Invalid credentials');
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function customrender(input) {
  str = fs.readFileSync(__dirname + input, 'utf8')
  output = loggedoutheader + str + footer
  return (output)
}
function customrender1(input) {
  str = fs.readFileSync(__dirname + input, 'utf8')
  output = loggedinheader + str + footer
  return (output)
}
function customrenderprofile(input) {
  str = fs.readFileSync(__dirname + input, 'utf8')
  output = loggedinheader + str + footer
  return (output)
}