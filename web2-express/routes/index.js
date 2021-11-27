var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');


//route ,routing
router.get('/', (request, response) => {
                var title = 'Welcome';
                var description = "Hello, Node.js"
                var list = template.list(request.list);
                var html = template.HTML(title, list, `<h2>${title}</h2>
    <p>${description}</p>    <img src="/images/laptop.jpg" style="width:300px; height:400px;">`,`<a href="/topic/create">create</a>
    `);
                response.send(html);

});

module.exports = router;
