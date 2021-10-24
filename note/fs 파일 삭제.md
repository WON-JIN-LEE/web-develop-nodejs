# fs.unlink (파일 삭제)

## fs.unlink(path, callback)
파일이나 심볼릭 링크를 비동기적으로 제거합니다. 완료 콜백에 가능한 예외 이외의 인수는 제공되지 않습니다.

- path < string > | < Buffer > | < URL >
  - callback < Function >
  - err < Error >

```js
var fs = require('fs');

fs.unlink("filepath", function (err) {
    
        response.writeHead(302, {Location: `/`});
        response.end();
});
```