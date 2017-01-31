var h = require('hyperscript')

var u = require('./lib/util'),
  each = u.each,
  isVisible = u.isVisible,
  setVisible = u.setVisible,
  setInvisible = u.setInvisible

var Tabs = require('./tabs')

module.exports = function (onSelect) {

  var content = h('section', { className: '.content' })
  var tabs = Tabs(content, function () { getSelection() })
  var d = h('div.Hypertabs', [
    h('nav', tabs),
    content
  ])

  function getSelection () {
    var sel = []
    each(content.children, function (page, i) {
      if(isVisible(page))
        sel.push(i)
    })
    if(''+sel === ''+selection) return
    d.selected = selection = sel
    if(onSelect) onSelect(selection)
    return sel
  }

  var selection = d.selected = []

  d.add = function (el, change, split) {
    var page = h('div', { className: '.page' },  el)

    if(!split) setInvisible(page)
    var index = content.children.length
    content.appendChild(page)
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
      [].forEach.call(content.children, function (page, i) {
        i == index ? setVisible(page) : setInvisible(page)
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
    tabs.style.display = full ? 'none' : null
    return full
  }

  d.isFullscreen = function () {
    return tabs.style.display === 'none'
  }

  return d
}

