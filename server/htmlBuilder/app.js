/*
*   HTML BUILDER
*
*/

//  DEFINE DEPENDENCIES
var fs 		        = require('fs');
var path 	        = require('path');
const Handlebars    = require("handlebars");

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
function productPage(epcObj) {
    //  DEFINE LOCAL VARIABLES
    var HTMLPage = "";
    var htmlSource = _loadTemplate('htmlBuilder/templates/landing.htm');
    var landingTemplate = Handlebars.compile(htmlSource);

    //  RETURN
    return landingTemplate(epcObj);
};

//  EXPORT MODULE
module.exports = builder;