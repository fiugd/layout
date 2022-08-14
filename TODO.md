# TODO

## layout
- [ ] close pane
- [ ] min/max height/width for panes
- [ ] snapping for panes
- [ ] media query functionality for responsiveness across mobile/desktop

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


## fiug-specific
- [ ] wire up events in test/index.html (for fiug example)
	- [ ] respond to terminal's fileOpen event

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
