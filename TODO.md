# TODO

## iframes
- [X] report events to parent
- [ ] **use this reporting in:
	- [ ] terminal.html
	- [X] editor.html
	- [ ] maybe even status and action bars

## tree
- [ ] **support drag and drop

## tabs
- [ ] **tab close results in config change
- [ ] **tab scroll into view on activate
- [X] tab bar menu
- [X] tab select should result in config change
- [ ] tab re-order
- [ ] tab drag to another frame
- [ ] tab bar as drop target (possibly do not do)
- [ ] option to customize look/feel of tabs
- [ ] double-click tab bar to start new file

## misc 
- [ ] **wire up events in test/index.html
- [ ] [TS type declarations](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html#including-declarations-in-your-npm-package)
- [ ] react wrapper

## layout
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
