const fs = require("fs");
const path = require("path");

const FILEPATH = path.join(__dirname, '..', 'media', 'grunter.JPG');

// console.time("load sync");
// const buffer = fs.readFileSync(FILEPATH);
// console.timeEnd("load sync");

// console.log(buffer);   

const imgReady = (err, buf) => {
    console.log(buf);
};

console.time("load sync");
const buffer2 = fs.readFile(FILEPATH, imgReady);
console.timeEnd("load sync");

console.log("end.");
