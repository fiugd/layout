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
- move tab-related things out of editor.html and into module
- drag listener should use global state for drag meta-data (not event data)
- drag listener should only allow one hover target to exist at a time (one pane at a time)
