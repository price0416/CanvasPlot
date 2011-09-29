var Client = require('mysql').Client;
var client = new Client();
client.user = 'aprice67';
client.password = '';
var fs = require('fs');
var url = require('url');

/* Several of these functions are necessary to serve files that must be included in files 
 * but are blocked due to cross domain calling security measures implemented in browsers.
 * 
 * Basically because nodeJS is is running on a certain port only requests for include files 
 * served from the same port can be included for security reasons. This is a workaround.
 */ 
function getImg(response, request){
    if (request.method == 'GET') {
        var url_parts = url.parse(request.url, true);
        var requestedFile = url_parts.query.include;
        
        var relativeAddress = "../lib/flot/images/" + requestedFile;
        console.log("Serving " + relativeAddress);
        
        fs.readFile(relativeAddress, function(error, content){
            if (error) {
                response.writeHead(500);
                response.end();
            }
            else {
                response.writeHead(200, {
                    'Content-Type': 'image/png'
                });
                response.end(content);
            }
        });
        
        //console.log(url_parts.query);
        //console.log(url_parts.query.include);
    }
}

function getJSON(response, request){
	if (request.method == 'GET') {
		var url_parts = url.parse(request.url, true);
		var requestedFile = url_parts.query.file;
		var relativeAddress = "data/" + requestedFile;
		console.log("Serving " + relativeAddress);
		
		fs.readFile(relativeAddress, function(error, content){
			if (error) {
				response.writeHead(500);
				response.end();
			}
			else {
				response.writeHead(200, {
					'Content-Type': 'application/json'
				});
				response.end(content);
			}
		});
	}
}

function flot(response, request){
    if (request.method == 'GET') {
        var url_parts = url.parse(request.url, true);
        var requestedFile = url_parts.query.include;
        
        var relativeAddress = "../lib/flot/" + requestedFile;
        console.log("Serving " + relativeAddress);
        
        fs.readFile(relativeAddress, function(error, content){
            if (error) {
                response.writeHead(500);
                response.end();
            }
            else {
                response.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                response.end(content, 'utf-8');
            }
        });
        
        //console.log(url_parts.query);
        //console.log(url_parts.query.include);
    }
}

function loadCSS(response){
	console.log("Serving ../layout.css");
	fs.readFile("../layout.css", function(error, content){
            if (error) {
                response.writeHead(500);
                response.end();
            }
            else {
                response.writeHead(200, {
                    'Content-Type': 'text/css'
                });
                response.end(content, 'utf-8');
            }
        });
}

function start(response){
    console.log("Request handler 'start' was called.");
    
    fs.readFile('../index.html', function(error, content){
        if (error) {
            response.writeHead(500);
            response.end();
        }
        else {
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            response.end(content, 'utf-8');
        }
    });
}

//Helper function for fetchData.
function getQueryResults(queryString, filename, callback)
{
	console.log("Running getQueryResults...");
	client.query('USE brucella');
	client.query(queryString, function selectCb(err, results, fields){
		if (err) {
			throw err;
		}
			
			//Format data.
				resultString = "{" + "\"label\": " + "\"" + results[0].refName + "\",";
				resultString += "\"data\": [";
				for (var i in results) {
					resultString += "[" + results[i].queryMin + "," + results[i].subjectMin + "]";
					if (i != results.length - 1) {
						resultString += ",";
					}
				}
				resultString += "]}";
				
				writeData(resultString,filename,function(fileWritten){
					console.log("writeData method completed successfully.");
				});
			
		callback("Query results written successfully.");
	});
}

function writeData(data, filename, callback)
{
	console.log("Writing data for " + filename + ".json");
	//Write data to file.
	fs.writeFile("data/" + filename + ".json", data, function(err){
		if (err) {
			throw err;
		}
		else {
			console.log("Plot data for " + filename + " stored to data/" + filename + ".json");
		}
		callback(filename);
	});
	
}


function fetchData(response, request){
	if (request.method == 'GET') {
		var url_parts = url.parse(request.url, true);
		var querySeq = url_parts.query.qry;
		var refSeq = url_parts.query.reference;
		var query = "";
		var resultString = "";
		
		
		//console.log("Query: " + querySeq);
		//console.log("Reference: " + refSeq);
		for (var x in querySeq) {
			query = "SELECT location.MinPosition AS queryMin, location.MaxPosition AS queryMax, location_1.MinPosition AS subjectMin, ";
			query += "location_1.MaxPosition AS subjectMax, fact_location_ortho_fact.Organism AS queryOrgId, fact_location_ortho_fact_1.Organism AS subjectOrgId, organism.Strain AS refName ";
			query += "FROM fact_location_ortho_fact ";
			query += "INNER JOIN fact_location_ortho_fact fact_location_ortho_fact_1 ON fact_location_ortho_fact.FeatureCluster = fact_location_ortho_fact_1.FeatureCluster ";
			query += "INNER JOIN location ON fact_location_ortho_fact.Location = location.LoctionId ";
			query += "INNER JOIN location location_1 ON fact_location_ortho_fact_1.Location = location_1.LoctionId ";
			query += "INNER JOIN organism on organism.OrganismId = fact_location_ortho_fact_1.Organism ";
			query += "WHERE fact_location_ortho_fact.Organism = " + refSeq + " AND fact_location_ortho_fact_1.Organism = " + querySeq[x];
			//console.log(query);
		
			var curItem = querySeq[x];
			getQueryResults(query, curItem, function(results){
				console.log(results);
			});		
		}
		
		var resultSet = [];
		for(var y in querySeq)
		{
			resultSet[y] = querySeq[y] + ".json";
		}
		
		response.writeHead(200, {
			'Content-Type': 'text/plain'
		});
		response.end('_callback(\'' + resultSet + '\')');
		//response.end('_callback(\'{"message": "Hello world!"}\')');
	}
}

function query(response){
    console.log("Request handler 'query' was called.");
    
    //Connect to MySQL
    client.query('USE test');
    client.query('SELECT * FROM test', function selectCb(err, results, fields){
        if (err) {
            throw err;
        }
        
        response.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        
		//console.log('_callback(\'{"message": "Hello world!"}\')');
        response.end('_callback(\'' + JSON.stringify(results) + '\')');
        //        response.end('_callback(\'{"message": "Hello world!"}\')');
    });
}

function getOrg(response){
    console.log("Request handler 'getOrganismNames' was called.");
    
    //Connect to MySQL
    client.query('USE brucella');
    client.query('SELECT OrganismId, Strain FROM organism', function selectCb(err, results, fields){
        if (err) {
            throw err;
        }
        
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });
        
		var str = "";
		for(var x = 0; x < results.length; x++)
		{
			str = str + '<option value = \'' + results[x].OrganismId + '\'>' + results[x].Strain + '</option>';
		}
		
		//console.log(str);
		//console.log(results);
		//console.log('_callback(\'{"message": "Hello world!"}\')');
        //response.end('_callback(\'' + results + '\')');
		response.end(str);
        //        response.end('_callback(\'{"message": "Hello world!"}\')');
    });
}

exports.start = start;
exports.query = query;
exports.flot = flot;
exports.loadCSS = loadCSS;
exports.getImg = getImg;
exports.getOrg = getOrg;
exports.fetchData = fetchData;
exports.getJSON = getJSON;
