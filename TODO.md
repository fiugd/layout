# TODO

## tabs
- [ ] status indicators
- [ ] double-click tab bar to start new tab (file)
- [ ] scrolled indicators
- [ ] tab re-order
- [ ] tab drag to another frame
- [ ] tab bar as drop target (possibly defer or reject this)
- [X] option to customize look/feel of tabs
	- [X] file icons

## layout
- [ ] min/max height/width for panes
- [ ] snapping for panes
- [ ] media query functionality for responsiveness across mobile/desktop

## misc
- [ ] add [TS type declarations](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html#including-declarations-in-your-npm-package)
- [ ] coupled to fiug (versus being useable elsewhere)
	- [ ] layout should not have a concept of "editor" or "tree"
- [ ] react wrapper
- [ ] popularity, quality, maintenance scores [on npmjs.com](https://stackoverflow.com/questions/49866588/how-npmjs-com-calculates-the-code-quality)

## fiug v0.4.6 (@fiug/layout) versus fiug v0.4.5

### missing in @fiug/layout
- changed status indicator for tabs
- explorer snap behavior

### missing from fiug v0.4.6
- action bar
- status bar
- wired up to service worker
- menus
- responds to fileDelete/fileClose
- reponsds to (acks) terminal's fileOpen event
