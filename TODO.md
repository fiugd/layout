# TODO

## layout
- [ ] close pane
- [ ] min/max height/width for panes
- [ ] snapping for panes
- [ ] media query functionality for responsiveness across mobile/desktop
- [X] move tab-related code out of editor.html and into module
- [X] root-level column or rows layout
- [X] nested layout
- [X] maximize / minimize for panes (settled on fullscreen for now)

## misc 
- [ ] [TS type declarations](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html#including-declarations-in-your-npm-package)
- [ ] coupled to fiug (versus being useable elsewhere)
	- [ ] layout should not have a concept of "editor" or "tree"
- [ ] react wrapper

## tabs
- [ ] option to customize look/feel of tabs
- [ ] double-click tab bar to start new tab (file)
- [ ] scrolled indicators
- [ ] tab re-order
- [ ] tab drag to another frame
- [ ] tab bar as drop target (possibly defer or reject this)
- [X] tab close results in config change
- [X] tab scroll into view on activate
- [X] tab bar menu
- [X] tab select should result in config change

## fiug-specific
- [ ] wire up events in test/index.html (for fiug example)
	- [ ] respond to terminal's fileOpen event

## events
- [X] global onDrop for panes (mouseenter, mouseleave, mouseup)
- [X] listen to resize/drop event (or other events) in each pane
- [X] global state as medium for drag meta info
- [X] onDrop for pane split (versus add pane)
- [X] drag listener allows only one pane hover target at a time
- [X] dynamically created/modified nested layouts
- [X] tabs, dragover and drop as part of library vs part of hosted page
- [X] listen to resize event (or other events) in page

## iframes
- [X] report events to parent
- [X] use this reporting in:
	- [X] terminal.html
	- [X] editor.html
	- [X] maybe even status and action bars

## tree
- [X] wire up drag and drop
- [X] fileSelect event


## fiug v0.4.6 (@fiug/layout) versus fiug v0.4.5

### missing in @fiug/layout
- file icons for tabs
- changed status indicator for tabs
- explorer snap behavior
- responds to fileDelete/fileClose

### missing from fiug v0.4.6
- action bar
- status bar
- wired up to service worker
- menus
