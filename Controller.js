const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const loggedoutheader = fs.readFileSync('./statics/loggedoutheader.html', 'utf8');
const loggedinheader = fs.readFileSync('./statics/loggedinheader.html', 'utf8');
const footer = fs.readFileSync('./statics/footer.html', 'utf8');

exports.getBasic = (req, res) => {
  customrender('/Basic.html');
  res.send(output);

}
exports.getLogin = (req, res) => {
  customrender('/Login.html');
  res.send(output);

}
exports.getSignup = (req, res) => {
  customrender('/Signup.html');
  res.send(output);

}
exports.getDashboard = (req, res) => {
  // Check if user is authenticated
  if (req.session.email) {
      // If authenticated, render the dashboard page
      customrender1('/dashboard.html')
      res.send(output)
  } else {
      // If not authenticated, redirect to the login page
      res.redirect('/login')
  }
}
exports.getProfile = (req, res) => {
  const emailuser = req.session.email;// requests the email of the session using bodyparser middleware
  console.log(emailuser);
  let username = '';
  const credentials = fs.readFileSync('./credentials.txt', 'utf8'); // reads the file with the user's details
  const lines = credentials.split('\n'); //splits said files to multiple lines ofr indexing
  lines.forEach((line, index) => { // code for finding the emailuser and the line for which the firstname and lastname exist to create a username
      if (line.includes(emailuser)) {
          const lineArray = line.split(',');
          username = lineArray[0] + ' ' + lineArray[1];
      }
  });
  const userFile = './userinfo/user_address_num/' + emailuser + '.txt';//file that stores the users address and phone number
  const infoUploaded = fs.existsSync(userFile); // checks for existence of said user
  const picPath = "./userinfo/userpfp/" + emailuser + '.png';// checks for picture
  let output = '';
  if (infoUploaded) {
      // If both files exist, read the address and phone number and render the profile page
      const userFileContents = fs.readFileSync(userFile, 'utf8');
      const [address, phone] = userFileContents.split('\n');
      const pic = fs.readFileSync(picPath).toString('base64');//converts file to base64 to be displayed on the website
      output = customrenderprofile('/abcd.html');
      output += ` 
      <div class="profile-info">
    <h1>Welcome ${username}</h1>
    <p>Address: ${address}</p>
    <p>Phone Number: ${phone}</p>
    <p>${emailuser}</p>
    <img src="data:image/png;base64,${pic}"  alt="User Profile Picture size" width="100px" height="100px">
    </div>

  `;

  } else {
      // If either file does not exist, render the profile page with a message
      output = customrenderprofile('/Profile.html');
      output += `
    <h1>Welcome ${username}</h1>
    <p>You have not uploaded your address and phone number yet.</p>
  `;
  }
  output = customrenderfooter(output);
  res.send(output);
};
exports.postUserinfo = (req, res) => {
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

              // Write the address and number to the files and redirect to the profile page
              fs.writeFileSync(userFile, address + '\n' + number, 'utf8');
              if (!req.files || !req.files.file) {
                  return res.status(400).send('No file uploaded.');
                }
              
                const file = req.files.file;
                const fileExtension = path.extname(file.name);
                const uniqueFilename = req.session.email + fileExtension;
                const filePath = './userinfo/userpfp/' + uniqueFilename;

                // Save the file to disk
                file.mv(filePath, (error) => {
                  if (error) {
                    console.error(error);
                    return res.status(500).send('Failed to save the file.');
                  }
              

                });
              res.redirect('/Profile');
      };
  };
  exports.postsignup = (req, res) => {
    // requests data from farm and stores in a text file called credetnails.txt
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
             const writeStream = fs.createWriteStream('credentials.txt', { flags: 'a' });
             writeStream.write(`${fname},${lname},${email},${password}\n`, (err) => {
                 if (err) throw err;
                 console.log('You signed up');
                 res.redirect('/login');
             });
         }
     });
 };
exports.postlogin = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  fs.readFile('./credentials.txt', 'utf8', (err, data) => {
      if (err) throw err;
      const lines = data.split('\n'); // split the data into an array of lines
      lines.forEach((line, index) => {
          if (line.includes(email)) {
              const lineArray = line.split(',');
              storedPassword = lineArray[3];
          }
      });
      if (storedPassword === password) {
          req.session.email = email;
          emailuser = email;
          res.redirect('/dashboard')
          console.log('You logged in');

      } else {
          res.send('Invalid credentials');
      }
  });
};



function customrender(input) {
  str = fs.readFileSync( './statics/' + input, 'utf8')
  output = loggedoutheader + str + footer
  return (output)
}
function customrender1(input) {
  str = fs.readFileSync( './statics/' + input, 'utf8')
  output = loggedinheader + str + footer
  return (output)
}
function customrenderprofile(input) {
  str = fs.readFileSync( './statics/' + input, 'utf8')
  output = loggedinheader + str ;
  return (output)
}
function customrenderfooter(input) {
  str = input;
  output = str + footer ;
  return (output)
}