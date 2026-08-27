# Peek context window(*.c))

This is a Visual Studio Code extension that shows definitions on a side editor group
instead of using the inline peek window.

这是一个类似source insight context 功能的窗口插件，使用分屏-窗口2作为context window，

依赖c/c++ 默认插件的查看定义、peek等类似功能，但是将变量、函数的定义内容转到窗口2显示。

打开插件后默认关闭，需要使用 `Ctrl+shift+d` 启用功能。

打开后会默认拆分一个窗口2，作为context window，如果继续拆分，在窗口3单击符号，也会在窗口2显示定义。


## Usage

1. Open a *.c file
2. Move to a symbol and click
3. Trigger the command `Ctrl+shift+d`

## Release Notes
编译和安装依赖node
compile：
npm.cmd run compile
package：
vsce.cmd package

https://github.com/ichlibe/PeekContextWindow

### 0.0.1

- Initial release
