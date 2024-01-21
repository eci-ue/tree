const shell = require("shelljs");
// 生成声明文件
shell.exec("vue-tsc --jsx preserve --declaration --noEmit false --emitDeclarationOnly --resolveJsonModule true --esModuleInterop --declarationDir ./types ./src/index", {
  silent: true
});