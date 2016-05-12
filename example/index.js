
var h = require('hyperscript')


var tabs = require('../')()

document.body.appendChild(tabs)

tabs.add('foo', h('h1', 'foo bar baz'))
tabs.add('bar',
  h('ul',
    h('li', 'foo'),
    h('li', 'bar'),
    h('li', 'baz')
  )
)

tabs.add('baz',
  h('form',
    h('input', {value: 'foo bar baz'}),
    h('submit')
  )
)


