# POST data 받아오기

request.on('data',콜백(){ ... }) : data가 들오면 콜백 함수 실행합니다.

request.on('end',콜백(){ ... }) : data가 모든 들온 다음 data처리가 끝났을 때 콜백 함수 실행합니다. 
```js
var http = require('http');
var app = http.createServer(function (request, response) {
var body = '';
request.on('data', function (data) {
            body = body + data;

            // Too much POST data, kill the connection! : 일정량 이상의 방대한 data가 들어오며 요청을 도중에 끝낸다.
            if (body.length > 1e6) 
                request.destroy();
            }
        );
        request.on('end', function () {

        });
});
app.listen(3000);
```