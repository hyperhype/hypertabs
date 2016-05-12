# tabs

create a simple tabbed interface

## Example

``` js

var Tabs = require('hypertabs')

var tabs = Tabs()

tabs.add('foo', h('h1', 'foofoo'))
tabs.add('bar', h('h1', 'baz'))


tabs.select('bar') //change to the "bar" tab.

document.body.appendChild(tabs)

```


## License

MIT

