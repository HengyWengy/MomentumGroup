const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT) || 3000;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml"
};

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const requestedPath = decodeURIComponent(requestUrl.pathname);
  const safePath = requestedPath === "/" ? "/index.html" : requestedPath;
  const filePath = path.normalize(path.join(root, safePath));

  if (!filePath.startsWith(root)) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    const contentType = mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": contentType });
    response.end(data);
  });
});

server.listen(port, () => {
  console.log(`Momentum Group website running at http://localhost:${port}`);
});
