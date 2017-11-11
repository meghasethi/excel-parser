var express = require('express');
global.app = express();

var path = require('path'),
bodyParser = require('body-parser'),
errorHandler = require('errorhandler'),
multer = require('multer');
global.app = express();

var router = express.Router();

app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
		extended: true
	}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(multer({
		dest: './uploads/',
		rename: function (fieldname, filename) {
			return filename + Date.now();
		},
		onFileUploadStart: function (file) {
			console.log(file.originalname + ' is starting ...');
		},
		onFileUploadComplete: function (file) {
			console.log(file.fieldname + ' uploaded to  ' + file.path);
		}
	}));

function init() {
	global.http = require('http');

	app.get('/index', function (req, res) {
		res.render('index', {
			title: 'Excel parser'
		});
	});

	app.post('/upload', function (req, res) {
		console.log(req);
		var file = req.files.file;
		var XLSX = require('xlsx');
		var workbook = XLSX.readFile(file.path);
		var sheet_name_list = workbook.SheetNames;
		var data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

		console.log("___________________________");
		console.log(data);
		console.log("___________________________");

		res.send(data);
	});

	var server = http.createServer(app);

	server.listen(app.get('port'), function (req, res) {
		console.log('Express server listening on port ' + app.get('port'));
	});

}

init();
