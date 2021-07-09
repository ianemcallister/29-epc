/*
*   HTML BUILDER
*
*/

//  DEFINE DEPENDENCIES
var fs 		        = require('fs');
var path 	        = require('path');
const Handlebars    = require("handlebars");
const Firebase      = require('../firebase/firebase.js');

//  DEFINE MODULE
var builder = {
    _loadTemplate: _loadTemplate,
    productPage: productPage
};

//  PRIVATE METHODS
function _loadTemplate(filepath) {
    //  DEFINE LOCAL VARIABLES
    var readpath = path.join(__dirname, '..', filepath);
    var file = fs.readFileSync(readpath, 'utf8');
    return file;
};

//  DEFINE PUBLIC METHODS

/*
*   PRODUCT PAGE
*/
async function productPage(epcData) {
    //  DEFINE LOCAL VARIABLES
    var htmlSource = _loadTemplate('htmlBuilder/templates/landing.htm');
    var landingTemplate = Handlebars.compile(htmlSource);
    
    try {

        var dbRecord = await Firebase.getUpc(epcData.upc);
        var data = dbRecord;
        data.upc = epcData.upc;
        data.location = epcData.location;
        data.instance = epcData.instance;

        //  RETURN
        return landingTemplate(data);

    } catch (error) {
        console.log('productPage Error: ', error);
    }
    
};

//  EXPORT MODULE
module.exports = builder;