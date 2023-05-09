const fs = require('fs');

const header = fs.readFileSync('C:/Users/lenovo/Documents/Developer/First Project/header.html', 'utf8');
//console.log(header);

const footer = fs.readFileSync('C:/Users/lenovo/Documents/Developer/First Project/footer.html', 'utf8');
//console.log(footer);

const newString = header + footer

console.log(newString);