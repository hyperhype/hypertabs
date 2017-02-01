# hypertabs

create a simple tabbed interface

## Example

``` js

var Tabs = require('hypertabs')

var tabs = Tabs()

tabs.add(h('h1', 'foofoo'))
tabs.add(h('h1', 'baz'))

tabs.select(1) //change to the "baz" tab.

document.body.appendChild(tabs)

setTimeout(
  function () { tabs.select(0) },
  2000
)
```

## Notifications

Hypertabs wraps content you give it in a `div.page`.
It watches for whether there is a `-notify` class on this element, and keeps this class in sync with the appropriate tab.
In this way, you can signal updates to a page that is not currently selected.

```js
var welcomeTab = tabs.add(h('h1', 'Welcome!'))
var welcomePage = welcomeTab.page

welcomePage.classList.add('-notify')

welcomeTab.classList.constain('-notify')
// -> true
```

## Styling

Hypertabs follows a class pattern that is compatible with [micro-css](https://github.com/mmckegg/micro-css) where styling is super tightly specified using the direct child only `>` and non-standard class prefixes to stop you from writing bad styles.

Your style schema for mcss is like:

```css
Hypertabs {
  nav {
    section.tabs {
      div.tab {
        -selected {
        }

        -notify{
        }

        a.link {
        }

        a.close {
        }
      }
    }
  }

  section.content {
    div.page {
    }
  }
}
```

In classic css, use a the following schema as a template:
```css
.Hypertabs {  }

.Hypertabs > nav {  }
.Hypertabs > nav > section.\.tabs {  }
.Hypertabs > nav > section.\.tabs > div.\.tab {  }
.Hypertabs > nav > section.\.tabs > div.\.tab.-selected {  }
.Hypertabs > nav > section.\.tabs > div.\.tab.-notify {  }
.Hypertabs > nav > section.\.tabs > div.\.tab > a.\.link {  }
.Hypertabs > nav > section.\.tabs > div.\.tab > a.\.close {  }

.Hypertabs > section.\.content {  }
.Hypertabs > section.\.content > div.\.page {  }
```


## License

MIT

