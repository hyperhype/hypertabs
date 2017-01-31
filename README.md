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

## Styling

Hypertabs classes take inspiration from [micro-css](https://github.com/mmckegg/micro-css) where styling is super tightly specified using `>` - direct child only to ensure your styling don't leak.

In nesting, the box schema looks like this :

```
div.Hypertabs {
  nav {
    section.tabs {  // this is deliberatly nested to enable injection of other content
      div.tab {     // may also have .-selected or .-notify
        a.link {}
        a.close {}
      }
    }
  }
  section.content {
    div.page {

    }
  }
}
``

So in tight css : 
```
div.Hypertabs { }

div.Hypertabs > nav { }

div.Hypertabs > nav > section.tabs { }

div.Hypertabs > nav > section.tabs > div.tab { }
div.Hypertabs > nav > section.tabs > div.tab.-selected { }
div.Hypertabs > nav > section.tabs > div.tab.-notify { }

div.Hypertabs > nav > section.tabs > div.tab > a.link {}
div.Hypertabs > nav > section.tabs > div.tab > a.close {}


div.Hypertabs > section.content { }
div.Hypertabs > section.content > div.page { }
```


## License

MIT

