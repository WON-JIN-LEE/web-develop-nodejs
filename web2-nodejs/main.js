var http = require('http');
var fs = require('fs');
var url = require('url');

function templateHTML(title, list,body) {
  return `
            <!doctype html>
        <html>
        <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
        <ul>
          ${list}
        </ul>
        ${body}
        </body>
        </html>
        `;
}
function templateList(filelist) {
  let list = ``;
    let i = 0;
    while (i < filelist.length) {
        list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
        i = i + 1;
  }
  return list;
}

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  if (pathname === '/') {
    if (queryData.id === undefined) {
      fs.readdir('./data', function (error, filelist) {
        const title = "Welcome";
        const description = "Hello, Node.js";
        const list = templateList(filelist);
        var template =templateHTML(title, list,`<h2>${title}</h2>${description}`);

        response.writeHead(200);
        response.end(template);
    
      });
  
    } else {

    fs.readdir('./data', function (error, filelist) {

    fs.readFile(`data/${queryData.id}`, 'utf8', function (err, data) {
        let title = queryData.id
        let description = data;
        const list = templateList(filelist);
        var template =templateHTML(title, list,`<h2>${title}</h2>${description}`);

        response.writeHead(200);
        response.end(template);

    });
});
}
    
  } else {
      response.writeHead(404);
      response.end('Not found');
  }

});
app.listen(3000);