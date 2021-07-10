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
async function productPage(epcData, epcHex) {
    //  DEFINE LOCAL VARIABLES
    console.log('epcHex: ', epcHex)
    var htmlSource = _loadTemplate('htmlBuilder/templates/landing.htm');
    var landingTemplate = Handlebars.compile(htmlSource);
    
    try {

        //  LOAD DB DATA
        var dbRecord = await Firebase.getUpc(epcData.upc);
        var data = dbRecord;
        data.upc = epcData.upc;
        data.location = epcData.location;
        data.instance = epcData.instance;
        data.epcHex = epcHex;

        console.log('data: ', data);

        //  CHECK FOR VIDEOS
        if(data.videos != undefined) {
            
            //  ITERATE OVER VIDEOS
            Object.keys(data.videos.content).forEach(function(key) {
                
                if(data.videos.content[key].type == 'packing') {
                    Handlebars.registerHelper("packingVideo", function() {
                        console.log('runing, video helper');
                        var url = Handlebars.escapeExpression(data.videos.content[key].url),
                            text = Handlebars.escapeExpression(data.videos.content[key].description)
                            
                       return new Handlebars.SafeString("<iframe id='cleaningVideoFrame' style='display: block; margin-left: auto; margin-right: auto; width:100%; height:300px; ' src='" + url + "'></iframe> <br></br>" + text);
                    });
                }

            });
        }
        //  BUILD HELPERS


        //  RETURN
        return landingTemplate(data);

    } catch (error) {
        console.log('productPage Error: ', error);
    }
    
};

//  EXPORT MODULE
module.exports = builder;