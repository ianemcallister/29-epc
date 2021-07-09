/*
*   29 Kettle: EPC Service Server
*/

//  DEFINE DEPENDENCIES
//  DEFINE DEPENDENCIES
const bodyParser	= require('body-parser');
const express 		= require('express');
const EPC           = require('./epc');
const qa			= require('./qa.js');
const htmlBuilder	= require('./htmlBuilder/app.js');

//return the express object
var serverApp = express();

//environment variables
var port = process.env.PORT || 3000;

//get the URL encoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

/*
*	USE Declarations
*
*/
//define our body parsers
serverApp.use(jsonParser); // for parsing application/json
serverApp.use(urlencodedParser); // for parsing application/x-www-form-urlencoded

//serve up a static asset
serverApp.use(express.static('dist'));

//track URL requests
serverApp.use('/', function(req, res, next) {
	//log the url to the console
	console.log('Request Url: ' + req.url);

	next();
});

//	ROUTING
/*
*	
*/
/*serverApp.get('/', async function(req, res) {
	//  DEFINE LOCAL VARIABLES

	//  NOTIFY PROGRESS
	console.log(req.query);

	//res.sendStatus(200);
	res.redirect('/#/');
});*/

serverApp.get('/:epcHex', async function(req, res) {
	//	DEFINE LOCAL VARIABLES
	var isEPC = qa.isEPC(req.params.epcHex);
	
	//	only process actual EPCs
	if(isEPC) {
		//	DEFINE LOCAL VARIABLES
		var responsePage = await htmlBuilder.productPage(EPC.unpack(req.params.epcHex));

		console.log('EPC: ', req.params.epcHex, EPC.unpack(req.params.epcHex));
		//	SEND AFFIRMATIVE RESPONSE
		//res.sendStatus(200)
		res.status(200).send(responsePage);

	} else {
		res.sendStatus(404);
	}
    
});

/*
*	Opening Up the server
*/
//open the port for local development
serverApp.listen(port,function() {
	//display the port
	console.log('Express server is up and running on port ' + port);
	//identify the environment
	if(process.env.IS_PROUDCTION == 'true') {
		console.log('is production');
		//console.log('got these codes:', JSON.parse(process.env.PROMO_CODES));
	} else {
		console.log('is development');
		//console.log(JSON.parse(process.env.PROMO_CODES));
	}
});