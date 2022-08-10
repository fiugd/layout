# TODO

## tree
- [ ] **support drag and drop
- [X] fileSelect event

## tabs
- [ ] **tab close results in config change
- [X] tab scroll into view on activate
- [X] tab bar menu
- [X] tab select should result in config change
- [ ] tab re-order
- [ ] tab drag to another frame
- [ ] tab bar as drop target (possibly do not do)
- [ ] option to customize look/feel of tabs
- [ ] double-click tab bar to start new file

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
