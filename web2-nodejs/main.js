var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
const sanitizeHtml = require('sanitize-html');
var mysql = require('mysql');

var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '111111',
  database : 'opentutorials'
});
db.connect();

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url
        .parse(_url, true)
        .query;
    var pathname = url
        .parse(_url, true)
        .pathname;
    if (pathname === '/') {
        if (queryData.id === undefined) {
            db.query(`SELECT * FROM topic`, function (error, topics) {
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                var list = template.list(topics);
                 var html = template.HTML(
                    title,
                    list,
                    `<h2>${title}</h2>${description}`,
                    `<a href="/create">create</a>`
                );
                response.writeHead(200);
                response.end(html);
            });

    //          fs.readdir('./data', function (err, filelist) {
    //             var title = 'Welcome';
    //             var description = "Hello, Node.js"
             
    //             var list = template.list(filelist);
    //             var html = template.HTML(title, list, `<h2>${title}</h2>
    // <p>${description}</p>`,`<a href="/create">create</a>
    // `);

    //             response.writeHead(200);
    //             response.end(html);
    //          });
            
        } else {
            db.query(`SELECT * FROM topic`, function (error, topics) {
                if (error) {
                    throw error;
                }
                db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,[queryData.id], function (error, topic) {
                   if (error) {
                    throw error;
                    }
                    
                    var title = topic[0].title;
                var description = topic[0].description;
                var list = template.list(topics);
                    var html = template.HTML(title, list,
                        `<h2>${title}</h2>
            ${description}
            <p>by ${(topic[0].name).toUpperCase()}</p>`
            ,
            ` <a href="/create">create</a>
                <a href="/update?id=${queryData.id}">update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${queryData.id}">
                  <input type="submit" value="delete">
                </form>`
          );
                response.writeHead(200);
                response.end(html);
                });
            });
            
    //          fs.readdir('./data', function (err, filelist) {
    //             var filteredId = path.parse(queryData.id).base;
    //             fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
    //                  var title = queryData.id;
    //                 var sanitizedTitle = sanitizeHtml(title);
    //                 var sanitizedDescription = sanitizeHtml(description);
                    
    //                 var list = template.list(filelist);
    //                 var html = template.HTML(title, list, `<h2>${sanitizedTitle}</h2>
    // <p>${sanitizedDescription}</p>`,`<a href="/create">create</a>
    // <a href="/update?id=${sanitizedTitle}">update</a>
    // <form action="delete_process" method="post">
    //                     <input type="hidden" name="id" value="${sanitizedTitle}">
    //                     <input type="submit" value="delete">
    //                     </form>`);

    //                 response.writeHead(200);
    //                 response.end(html);
    //             });
    //         });
        }
    } else if (pathname === '/create') {
        db.query(`SELECT * FROM topic`, function (error, topics) {
               db.query('SELECT * FROM author', function(error2, authors){
              
                   var title = 'create';
                var list = template.list(topics);
                 var html = template.HTML(
                    title,
                    list,
                     `
                <form action="/create_process" method='post'>
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p>
                    <textarea name="description"
                    placeholder="description"></textarea>
                    </p>
                    <p>${template.authorSelect(authors)}</p>
                    <p>
                    <input type="submit">
                    </p>
                </form>
                `,
                    `<a href="/create">create</a>`
                );
                response.writeHead(200);
                response.end(html);
        });
        });
        
        //    fs.readdir('./data', function (err, filelist) {
        //         var title = 'WEB - create';
        //     var list = template.list(filelist);
        //         var html = template.HTML(title, list, `<form action="/create_process" method='post'>
        //             <p><input type="text" name="title" placeholder="title"></p>
        //             <p>
        //             <textarea name="description" placeholder="description"></textarea>
        //             </p>
        //             <p>
        //             <input type="submit">
        //             </p>
        //         </form>`,``);

        //             response.writeHead(200);
        //             response.end(html);
        //     });
        
    } else if (pathname === '/create_process') {
        var body = '';
        request.on('data', function (data) {
            body = body + data;

            // Too much POST data, kill the connection! : 일정량 이상의 방대한 data가 들어오며 요청을 도중에
            // 끝낸다.
            if (body.length > 1e6) 
                request.destroy();
            }
        );
        request.on('end', function () {
            var post = qs.parse(body);
            db.query(`INSERT INTO topic (title, description, created, author_id) VALUES(?,? ,NOW() ,?)`, [post.title, post.description, post.author], function (error, result) {
                  if (error) {
                    throw error;
                }
                response.writeHead(302, {location: encodeURI(`/?id=${result.insertId}`)});
                response.end();
            });

            // fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
            // //redirection, 한글url 인코딩 방식
            //     response.writeHead(302, { location: encodeURI(`/?id=${title}`)});
            //     response.end();
            // });

        });
        

    } else if (pathname === '/update') {
        db.query(`SELECT * FROM topic`, function (error, topics) {
              if (error) {
                    throw error;
                }
            db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function (error2, topic) {
                      if (error2) {
                    throw error2;
                }
               db.query('SELECT * FROM author', function(error2, authors){
                var list = template.list(topics);
                var html = template.HTML(
                    topic[0].title,
                    list,
                    `<form action="/update_process" method='post'>
                    <input type="hidden" name="id" value="${topic[0].id}">
                    <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
            <p>
              <textarea name="description" placeholder="description">${topic[0].description}</textarea>
            </p>
            <p>${template.authorSelect(authors,topic[0].author_id)}</p>
            <p>
              <input type="submit">
            </p>
          </form>`,
                    `<a href="/create">create</a>
    <a href="/update?id=${topic[0].id}">update</a> `
                );
                response.writeHead(200);
                response.end(html);
         });
         });
         });
    
    //fs모듈 
    //      fs.readdir('./data', function (err, filelist) {
    //             var filteredId = path.parse(queryData.id).base;
    //         fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
    //             var title = queryData.id;
    //             var sanitizedTitle = sanitizeHtml(title);
    //                 var sanitizedDescription = sanitizeHtml(description);
    //         var list = template.list(filelist);
    //          var html = template.HTML(title, list, ` <form action="/update_process" method='post'>
    //              <input type="hidden" name="id" value="${sanitizedTitle}">
    //                 <p><input type="text" name="title" placeholder="title" value="${sanitizedTitle}"></p>
    //                 <p>
    //                 <textarea name="description" placeholder="description">${sanitizedDescription}</textarea>
    //                 </p>
    //                 <p>
    //                 <input type="submit">
    //                 </p>
    //             </form>`,
    //             `<a href="/create">create</a>
    // <a href="/update?id=${sanitizedTitle}">update</a>`);

    //                 response.writeHead(200);
    //             response.end(html);
    //              });
    //         });
    } else if (pathname === '/update_process') {
        var body = '';
        request.on('data', function (data) {
            body = body + data;

            // Too much POST data, kill the connection! : 일정량 이상의 방대한 data가 들어오며 요청을 도중에
            // 끝낸다.
            if (body.length > 1e6) 
                request.destroy();
            }
        );
        request.on('end', function () {
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;

            db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`, [post.title, post.description,post.author, post.id], function (error, result) {
                    response.writeHead(302, {location: encodeURI(`/?id=${post.id}`)});
                    response.end();
            });
            // fs.rename(`data/${id}`, `data/${title}`, function (err) {
            //     //파일 Create
            //     fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
            //         //redirection, 한글url 인코딩 방식
            //         response.writeHead(302, {location: encodeURI(`/?id=${title}`)});
            //         response.end();
            //     });
            // });

        });

    } else if (pathname === '/delete_process') {
        var body = '';
        request.on('data', function (data) {
            body = body + data;

            // Too much POST data, kill the connection! : 일정량 이상의 방대한 data가 들어오며 요청을 도중에
            // 끝낸다.
            if (body.length > 1e6)
                request.destroy();
        }
        );
        request.on('end', function () {
            var post = qs.parse(body);
            db.query('DELETE FROM topic WHERE id=?', [post.id], function (error,result) {
                if (error) {
                    throw error;
                }
                  response.writeHead(302, {Location: `/`});
                    response.end();
            });
        

        });
    } else {
        response.writeHead(404);
        response.end('Not found');
    }
});
app.listen(4000);