"use strict";
console.log("This is my first Typescript file");
// A noter, on précise les types par : [string|number|boolean|any ou autres]
const prenom = "Kevin";
const nom = "Glass";
const age = 40;
const etudiant = false;
// A noter, on précise le type des paramètres aussi
function greet(person, date) {
    console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
greet(prenom, new Date());
const req = {
    type: 'POST',
    orderBy: 'title',
    page: 1
};
const state = 'done';
const SendRequest = (cb) => {
    const req = cb('pending');
    // ... envoyez la requête
};
SendRequest((state) => {
    return {
        type: (state === 'pending' ? 'POST' : 'GET'),
        page: 1
    };
});
