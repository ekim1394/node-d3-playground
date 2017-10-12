var query = require('./query');
var fs = require('fs');
var JSON = require('JSON');
var db = require('../config');
var http = require('http');
var options = {
	host: "192.168.99.100",
	port: "32769",
	headers: {
		'Content-type': 'application/json'
	},
	path: "/customers/external?pretty",
	method: "POST"
}

module.exports = function (app) {

	// server routes ===========================================================
	app.get('/test', function (req, res) {
		res.status(200).send('Test works');
	});

	app.get('/ping', function (req, res) {
		conn.ping({
			requestTimeout: 30000,
		}, function (error) {
			if (error) {
				res.status(500).send('elasticsearch cluster is down!');
			} else {
				res.status(200).send('All is well');
			}
		})
	});

	app.get('/data', function (req, res) {
		conn.search({
			index: 'customers',
			type: 'external',
			body: {
				query: {
					match_all: {}
				}
			}
		}).then(function (resp) {
			var hits = resp.hits.hits;
		}, function (err) {
			res.send('Unable to receive data');
			console.trace(err.message);
		});
	});

	app.post('/load', function (req, res) {
		try {
			var data = JSON.stringify(req.body);
			var request = http.request(options, function (res) {
					console.log(res.statusCode);
					res.on('data', function (chunk) {
						console.log('BODY: ' + chunk);
					});
				});
			request.on('error', function (e) {
				console.log(e.message)
			});
			request.write(data);
			request.end();

			res.send('Successfully loaded data');
		} catch (e) {
			res.send('could not parse json');
			console.log(e);
		}
	});
}
