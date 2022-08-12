# TODO

## tree
- [ ] **wire up drag and drop
- [X] fileSelect event

## tabs
- [ ] **tab close results in config change << #1
- [ ] option to customize look/feel of tabs
- [X] tab scroll into view on activate
- [X] tab bar menu
- [X] tab select should result in config change
- [ ] double-click tab bar to start new file
- [ ] scrolled indicators
- [ ] tab re-order
- [ ] tab drag to another frame
- [ ] tab bar as drop target (possibly do not do)

## layout
- [ ] **wire up events in test/index.html
- [X] move tab-related code out of editor.html and into module
- [X] root-level column or rows layout
- [X] nested layout
- [X] maximize / minimize for panes (settled on fullscreen for now)
- [ ] min/max height/width for panes
- [ ] snapping for panes

## events
- [X] onDrop for pane split (versus add pane)
- [X] drag listener allows only one pane hover target at a time
- [X] dynamically created/modified nested layouts
- [X] tabs, dragover and drop as part of library vs part of hosted page
- [X] listen to resize event (or other events) in page
- [ ] global onDrop for panes (mouseenter, mouseleave, mouseup)
- [ ] listen to resize/drop event (or other events) in each pane
- [ ] global state as medium for drag meta info

## iframes
- [X] report events to parent
- [X] use this reporting in:
	- [X] terminal.html
	- [X] editor.html
	- [X] maybe even status and action bars

## misc 
- [ ] [TS type declarations](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html#including-declarations-in-your-npm-package)
- [ ] react wrapper


## fiug v0.4.6 (@fiug/layout) versus fiug v0.4.5
(layout)
- file icons for tabs
- changed status indicator for tabs
- explorer snap behavior
- responds to fileDelete/fileClose
(other)
- action bar
- status bar
- wired up to service worker
- menus
