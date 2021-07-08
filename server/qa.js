/*
*   QUALTIY ASSURANCE
*/

//  DEFINE DEPENDENICES
//  DEFINE MODULE
var qa = {
    isEPC: isEPC
};

//  DEFINE PUBLIC METHODS
function isEPC(aString) {
    return (aString.length == 24)
};

//  EXPORT MODULE
module.exports = qa;