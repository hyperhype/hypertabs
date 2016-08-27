var h = require('hyperscript')

/*
element classes are set with BEM convention.
https://css-tricks.com/bem-101/

B = block. module name, on the top level of the component.
E = element. a specific part of the component
M = modifier. something that changes an element (or block)
*/

var Menu = require('./menu')

module.exports = function (onSelect) {

  var names = []
  var tabs = h('div.row.hypertabs__tabs')
  var content = h('div.row.hypertabs__content')

  var d = h('div.hypertabs.column', Menu(content), h('div.column', content))

  d.add = function (tab, change, split) {
    console.log(tab, change, split)
    if(!split) tab.style.display = 'none'
    var index = content.children.length
    content.appendChild(tab)
    if(change !== false && !split) d.select(index)
  }

  function find(name) {
    if(Number.isInteger(name)) return content.children[name]

    for(var i = 0; i < content.children.length; i++)
      if(content.children[i].id == name) return i

    return -1
  }

  d.has = function (name) {
    return ~find(name)
  }

  d.select = function (index, change, split) {
    if('string' === typeof index) index = find(index)

    var max = content.children.length - 1
    if(index > max) index = 0
    if(index < 0) index = max

    if(!change) return

    var prev = d.selectedTab
    d.selected = selected = index

    if(split)
      content.children[index].style.display = 'flex'
    else
      ;[].forEach.call(content.children, function (tab, i) {
        tab.style.display = i == index ? 'flex' : 'none'
      })
    onSelect && onSelect(index)
  }

  d.selectRelative = function (n) {
    d.select(selected + n)
  }

  d.remove = function (i) {
    if(i < 0 || i > content.children.length) return
    content.removeChild(content.children[i])
    if(selected === i)
      d.select(i < content.children.length ? i : 0)
  }

  return d
}



