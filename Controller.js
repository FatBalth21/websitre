const fs = require('fs');

exports.getProfile = (req, res) => {
  const emailuser = req.session.email;
  console.log(emailuser);
  let username = '';

  const credentials = fs.readFileSync('./credentials.txt', 'utf8');
  const lines = credentials.split('\n');
  lines.forEach((line, index) => {
    if (line.includes(emailuser)) {
      const lineArray = line.split(',');
      username = lineArray[0] + ' ' + lineArray[1];
    }
  });

  const userFile = './userinfo/user_address_num/' + emailuser + '.txt';
  const infoUploaded = fs.existsSync(userFile);
  const picPath = "./userinfo/userpfp/" + emailuser + '.png';

  let output = '';
  output = customrenderprofile('/abcd.html');
  if (infoUploaded) {
    const userFileContents = fs.readFileSync(userFile, 'utf8');
    const [address, phone] = userFileContents.split('\n');
    const pic = fs.readFileSync(picPath).toString('base64');

    output = `
      <div class="profile-info">
        <h1>Welcome ${username}</h1>
        <p>Address: ${address}</p>
        <p>Phone Number: ${phone}</p>
        <p>${emailuser}</p>
        <img src="data:image/png;base64,${pic}" alt="User Profile Picture size" width="100px" height="100px">
      </div>
    `;
  } else {
    output = `
      <h1>Welcome ${username}</h1>
      <p>You have not uploaded your address and phone number yet.</p>
    `;
  }
  output = customrenderfooter(output);
  res.send(output);
};

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
    output = loggedinheader + str ;
    return (output)
}
function customrenderfooter(input) {
    str = input;
    output = str + footer ;
    return (output)
}