var fs = require('fs');

// readFileSync
console.log("a");
let result = fs.readFileSync("syntax/sample.txt", 'utf8');
console.log(result);
console.log("c");


// readFile
console.log("a");
fs.readFile("syntax/sample.txt", 'utf8', function (err, result) {
console.log(result);
});
console.log("c");

