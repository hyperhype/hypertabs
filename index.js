var h = require('hyperscript')

/*
element classes are set with BEM convention.
https://css-tricks.com/bem-101/

B = block. module name, on the top level of the component.
E = element. a specific part of the component
M = modifier. something that changes an element (or block)
*/

var u = require('./util')
var Menu = require('./menu')

var each = u.each
module.exports = function (onSelect) {

  var d
  var content = h('div.row.hypertabs__content')

  function getSelection () {
    var sel = []
    each(content.children, function (tab, i) {
      if(tab.style.display !== 'none')
        sel.push(i)
    })
    if(''+sel === ''+selection) return
    d.selected = selection = sel
    if(onSelect) onSelect(selection)
    return sel
  }

  var menu = Menu(content, function () {
    getSelection()
  })
  var d = h('div.hypertabs.column',  menu, h('div.column', content))

  var selection = d.selected = []

  d.add = function (tab, change, split) {
    if(!split) tab.style.display = 'none'
    var index = content.children.length
    content.appendChild(tab)
    if(change !== false && !split) d.select(index)
    getSelection()
  }

  function find(name) {
    if(Number.isInteger(name)) return name // content.children[name]

    for(var i = 0; i < content.children.length; i++)
      if(content.children[i].id == name) return i

    return -1
  }

  d.has = function (name) {
    return ~find(name)
  }

  d.get = function (name) {
    return content.children[find(name)]
  }

  d.select = function (index, change, split) {
    if('string' === typeof index) index = find(index)

    var max = content.children.length - 1
    if(index > max) index = 0
    if(index < 0) index = max

    if(split)
      content.children[index].style.display = 'flex'
    else
      [].forEach.call(content.children, function (tab, i) {
        tab.style.display = i == index ? 'flex' : 'none'
      })
    getSelection()
  }

  d.selectRelative = function (n) {
    getSelection()
    d.select(selection[0] + n)
  }

  d.remove = function (i) {
    if(Array.isArray(i)) return i.reverse().forEach(d.remove)
    var el = d.get(i)
    if(el) content.removeChild(d.get(i))
  }

  var _display
  d.fullscreen = function (full) {
    menu.style.display = full ? 'none' : null
    return full
  }

  d.isFullscreen = function () {
    return menu.style.display === 'none'
  }

  return d
}






