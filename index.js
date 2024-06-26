const http = require('http');
const port = 3000;
const server = http.createServer();
const fs = require('fs');

server.on("request", connection_handler);
function connection_handler(req, res) {
    console.log(`New Request for ${req.url} from ${req.socket.remoteAddress}`);
    if (req.url === "/") {
        const main = fs.createReadStream("html/main.html");
        res.writeHead(200, { "Content-Type": "text/html" });
        //pipes the html file to our client in reesponse to the request
        // Pipe by default will close the response once the stream is finished so there is no need for res.end()
        main.pipe(res); //readable stream to writable stream
    }
    else if (req.url === "/favicon.ico") {
        const favicon = fs.createReadStream("images/favicon.ico");
        res.writeHead(200, { "Content-Type": "image/x-icon" });
        favicon.pipe(res);
    }
    else if (req.url === "/images/banner.png") {
        const banner = fs.createReadStream("images/banner.png");
        res.writeHead(200, { "Content-Type": "image/png" });
        banner.pipe(res);
    }
    else if (req.url.startsWith("/album-art/")) {
        const image_stream = fs.createReadStream(`.${req.url}`);
        image_stream.on('error', image_error_handler);
        function image_error_handler(err) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.write("404 Not Found", () => res.end());
        }
        image_stream.on('ready', deliver_image);
        function deliver_image() {
            res.writeHead(200, { "Content-Type": "image/jpeg" });
            image_stream.pipe(res);
        }
    }   
    else if (req.url.startsWith("/search")) {
            const url = new URL(req.url + "http://localhost:3000");
            const artist = url.searchParams.get("artist");
    }
        else {
            res.writeHead(404, { "Content-Type": "text/html" });
            res.write("404 Not Found", () => res.end());
        }
    }

    server.on("listening", listening_handler);
    server.listen(port);
    function listening_handler() {
        console.log(`Now Listening on Port ${port}`);
    }

/*
first request is for the root of our site --> /
New Request for / from ::1
second request is for the favicon.ico file which is the icon that appears in the browser tab
New Request for /favicon.ico from ::1
*/

//Routing allows us to handle different requests differently and segment our traffic

