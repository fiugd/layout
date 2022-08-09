# @fiug/layout

[![NPM version](https://img.shields.io/npm/v/@fiug/layout)](https://www.npmjs.com/package/@fiug/layout)
[![License](https://img.shields.io/github/license/fiugd/layout)](https://github.com/fiugd/layout/blob/main/LICENSE)

page layout for browser applications


## Usage

in browser
```javascript
import Layout from "https://unpkg.com/@fiug/layout";

const layoutConfig = {
  parent: document.body
};
new Layout(layoutConfig);
```
see <a href="./test/index.html">test/index.html</a> for a more involved example

## Summary
This layout system uses css grid to position elements.   
It is written from scratch to be simple, flexible, and dependency-free.   

## TODO

### iframes
- [ ] **report events to parent
- [ ] **use this reporting in:
	- terminal.html
	- editor.html
	- maybe even status and action bars

### tree
- [ ] **support drag and drop

### tabs
- [X] tab bar menu
- [ ] **tab select should result in config change
- [ ] **tab scroll into view on activate
- [ ] tab re-order
- [ ] tab drag to another frame
- [ ] tab bar as drop target (possibly do not do)
- [ ] option to customize look/feel of tabs
- [ ] double-click tab bar to start new file

### misc 
- [ ] **wire up events in test/index.html
- [ ] [TS type declarations](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html#including-declarations-in-your-npm-package)
- [ ] react wrapper

### layout
- [X] move tab-related code out of editor.html and into module
- [X] root-level column or rows layout
- [X] nested layout
- [X] maximize / minimize for panes (settled on fullscreen for now)
- [ ] min/max height/width for panes
- [ ] snapping for panes

### events
- [X] onDrop for pane split (versus add pane)
- [X] drag listener allows only one pane hover target at a time
- [X] dynamically created/modified nested layouts
- [X] tabs, dragover and drop as part of library vs part of hosted page
- [X] listen to resize event (or other events) in page
- [ ] global onDrop for panes (mouseenter, mouseleave, mouseup)
- [ ] listen to resize/drop event (or other events) in each pane
- [ ] global state as medium for drag meta info

## reference
[iframe reports clicks to parent](https://itecnote.com/tecnote/javascript-how-to-get-iframe-to-listen-to-same-events-as-parent-and-fire-the-same-handlers/)   
[iframe reports clicks to parent](https://stackoverflow.com/questions/10226448/detecting-click-inside-iframe-using-invisible-div)   
[css-system-colors](https://blog.jim-nielsen.com/2021/css-system-colors/)   
[complete-guide-grid](https://css-tricks.com/snippets/css/complete-guide-grid/)   

### frame communication
[comlink](https://github.com/GoogleChromeLabs/comlink)   
[comlink experiment](https://github.com/fiugd/incubator/tree/d44c82640df1a2175c236a0c7dc55a0f082059f1/xterm-tui/comlink)   
[postmate](https://github.com/dollarshaveclub/postmate)   
[zoid](https://github.com/krakenjs/zoid)   
[post-me](https://github.com/alesgenova/post-me)   
[broadcast-channel](https://github.com/pubkey/broadcast-channel)   
[Broadcast Channel Browser API](https://caniuse.com/broadcastchannel)   
