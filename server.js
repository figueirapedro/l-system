/*
var connect = require('connect');
var serveStatic = require('serve-static');
var staticFile = require('connect-static-file');


connect()
    .use(serveStatic(__dirname), '/grammar.txt', staticFile("grammar.txt", {}))
    .listen(3000, () => console.log('Server running on 3000...'));

*/
var indexFile;

const http = require("http");
const fs = require('fs').promises;
const fileSystem = require('fs');
const path = require('path');


const host = 'localhost';
const port = 3000;

var script = fs.readFile(__dirname + "/sketch.js").catch(err => {
    console.error(`Could not read sketch.js file: ${err}`);
    process.exit(1);
});

var readStream = fileSystem.createReadStream(__dirname + '/grammar.txt', 'utf8');
let data = ''
readStream.on('data', function(chunk) {
    data += chunk;
}).on('end', function() {
    console.log(data);
});

const requestListener = function(req, res) {

    switch (req.url) {
        case "/sketch":
            res.setHeader("Content-Type", "text/javascript");
            res.writeHead(200);
            res.end(script);
            break
        default:
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(indexFile);
    }
};

const server = http.createServer(requestListener);

fs.readFile(__dirname + "/index.html")
    .then(contents => {
        indexFile = contents;
        server.listen(port, host, () => {
            console.log(`Server is running on http://${host}:${port}`);
        });
    })
    .catch(err => {
        console.error(`Could not read index.html file: ${err}`);
        process.exit(1);
    });
/*

var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
    res.sendFile(__dirname + '/sketch.js');
    res.send()
});

app.listen(3000)
*/