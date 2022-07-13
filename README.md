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

refine visual layout
- [X] move tab-related code out of editor.html and into module
- [X] root-level column or rows layout
- [ ] nested layout
- [ ] min/max height/width for panes
- [ ] snapping for panes
- [ ] full screen / minimize for panes
- [ ] customize look/feel of tabs

refine layout events
- [ ] drag listener should only allow one hover target to exist at a time (one pane at a time)
- [ ] dynamically created/modified nested layouts
	- split right|left|up|down
- [ ] tabs, dragover and drop as part of library vs part of hosted page
- [ ] option to use drop event as part of hosted page
- [ ] listen to resize event (or other events) in hosted page
- [ ] listen to resize event (or other events) in host element
- [ ] global state as medium for dragStart information

misc 
- [ ] [TS type declarations](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html#including-declarations-in-your-npm-package)
