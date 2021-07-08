/*
*   EPC
*/

//  NOTIFY PROGESS
console.log("EPC module loaded");

// DEFINE DEPENDENCIES
const { convert }   = require('any-to-any');

//  DEFINE MODULE
var epcMod = {
    _hexToBin: _hexToBin,
    _hexToDec: _hexToDec,
    unpack: unpack
};

function _hexToBin(epcHex) {
    //  define local variables
    var binary = "";

    //  iterate over string
    for(var i = 0; i < epcHex.length; i++) {
        //  NOTIFY PROGRESS
        //console.log(epcHex[i], " ", convert(epcHex[i], 16, 2).padStart(4,"0"));

        //  CALCULATE CONVERSIONS
        var conversion = convert(epcHex[i], 16, 2);
        var halfByte = conversion.padStart(4, "0");
        binary += halfByte;
        
    }
    
    return binary;
}

/*
*
*   HEXIDICIMAL TO DECIMAL CONVERSTION
*
*   header = 8 bits
*   filter = 3 bits
*   partition = 3 bits
*   EPC Manager = 24 bits
*   Package Item Refernce = 20 bits
*   serial Location = 13 bits
*   serial Instance = 25 bits
*   96 bits total
*/
function _hexToDec(epcHex) {
    //  define local variables
    var binary = _hexToBin(epcHex);
    
    //  NOTIFY PROGRESS
    //console.log(binary);

    //  RETURN
    return {
        EPCMngr:    convert(binary.slice(14,38), 2, 10),
        packItRef:  convert(binary.slice(39,58), 2, 10),
        location:   convert(binary.slice(59,71), 2, 10),
        instance:   convert(binary.slice(72,96), 2, 10),
        upc:        ""
    }
};

function _calcCheckDigit(EPCMngr, packItRef) {
    //  define local variables
    var sansCDString = EPCMngr.toString() + packItRef.toString();
    var isOdd = true;
    var sum = 0;
    
    // iterate over string
    for (var i = 0; i < sansCDString.length; i++) {
        if(isOdd) {
            sum += (parseInt(sansCDString[i]) * 3)
        } else {
            sum += (parseInt(sansCDString[i]) * 1)
        }
        //  flip the sign
        isOdd = !isOdd;
    };
    var mod = sum % 10;
    var checkDigit = 10 - mod;

    //  NOTIFY PROGRESS
    //console.log('sum: ', sum, " mod: ", mod, " checkDigit: ", checkDigit);

    //  RETURN VALUES
    return sansCDString + checkDigit.toString();
}

function unpack(epcHex) {
    var epcSegments     = _hexToDec(epcHex);
    epcSegments.upc     = _calcCheckDigit(epcSegments.EPCMngr, epcSegments.packItRef)
    return epcSegments
}

//  EXPORT MODULE
module.exports = epcMod;