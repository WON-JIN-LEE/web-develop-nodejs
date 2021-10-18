var http = require('http');
var fs = require('fs');
var url = require('url');
const querystring= require('querystring');

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
          ${list}
        <a href="/create">create</a>
        ${body}
        </body>
        </html>
        `;
}
function templateList(filelist) {
  let list = `<ul>`;
    let i = 0;
    while (i < filelist.length) {
        list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
        i = i + 1;
  }
  return list + `</ul>`;
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
        var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);

        response.writeHead(200);
        response.end(template);
    
      });
  
    } else {

      fs.readdir('./data', function (error, filelist) {

        fs.readFile(`data/${queryData.id}`, 'utf8', function (err, data) {
          let title = queryData.id
          let description = data;
          const list = templateList(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);

          response.writeHead(200);
          response.end(template);

        });
      });
    }
    
  } else if (pathname === '/create') {
    fs.readdir('./data', function (error, filelist) {
      const title = "WEB - create";
      const list = templateList(filelist);
      var template = templateHTML(title, list, `
            <form action="https://localhost:3000/create_process" method='post'>
              <p><input type="text" name="title" placeholder="title"></p>
              <p>
                  <textarea name="description" placeholder="description"></textarea>
              </p>
              <p><input type='submit'></p>
              </form>
          `);

      response.writeHead(200);
      response.end(template);
    
    });
  
  } else if (pathname === '/create_process') {
    var body = '';
  
    //브라우저에서 보낸 post방식 data 서버에서 받기
    request.on('data', function (data) {
      body = body + data;


      // Too much POST data, kill the connection! : 일정량 이상의 방대한 data가 들어오며 요청을 도중에 끝낸다.
      if (body.length > 1e6) request.destroy(); 
    });
    request.on('end', function () {

      var post = querystring.parse(body);
      var title = post.title;
      var description = post.description

      console.log(title);
      console.log(description);

      fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
      
      
        response.writeHead(200);
        response.end("success");
      });
        response.writeHead(200);
        response.end("success");
    });
    
  }else{
      response.writeHead(404);
      response.end('Not found');
  }

});
app.listen(3000);