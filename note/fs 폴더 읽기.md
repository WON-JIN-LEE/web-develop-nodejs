# fs.readir (파일목록 가져오기)

## fs.readdir(path[, options], callback)
디렉토리의 내용을 읽습니다. 콜백은 두 개의 인수를 가져 옵니다. (err, files) 여기서 files는 '.'및 를 제외한 디렉토리에 있는 파일 이름의 배열입니다 '..'.

- path < string > | < Buffer > | < URL >
- options < string > | < Object >
  - encoding < string > Default: 'utf8'
  - withFileTypes < boolean > Default: false

- callback < Function >
  - err < Error >
  - files < string[] > | < Buffer[] > | < fs.Dirent[] >

```js
var fs = require('fs');   // file system 모듈 가져오기

var dir = './data';   // 파일 목록 읽어올 폴더

fs.readdir(dir, function(err, file){
// fs모듈의 readdir함수를 사용해
// 첫번째 인자로 파일 목록을 읽을 폴더(dir)를 가져오고
// 콜백함수의 두번째 인자로 폴더(dir)의 파일목록(file)을 가져옴

	console.log(file); // ['file1', 'file2', 'file3']

});
```