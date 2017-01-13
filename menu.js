var h = require('hyperscript')
var u = require('./util')
  each = u.each,
  find = u.find,
  isVisible = u.isVisible,
  setVisible = u.setVisible,
  setInvisible = u.setInvisible

function toggle_focus(el) {
  isVisible(el)
    ? blur(el)
    : focus(el)
}

function focus(el) {
  if (isVisible(el)) return

  setVisible(el)
  el.dispatchEvent(new CustomEvent('focus', {target: el}))
}

function blur (el) {
  if (!isVisible(el)) return

  setInvisible(el)
  el.dispatchEvent(new CustomEvent('blur', {target: el}))
}

function moveTo(el, list, i) {
  if(!list.children.length || i >= list.children.length)
    list.appendChild(el)
  else
    list.insertBefore(el, list.children[i])
}

module.exports = function (list, onSelect) {
  var menu = h('div.row.shrink.hypertabs__tabs')
  var selection

  function tab_button (el, onclick) {
    var link = h('a.shrink.hypertabs__button', {href: '#', onclick: function (ev) {
      if(ev.shiftKey) toggle_focus(el)
      else {
        each(list.children, function (tab) {
          if(tab == el) focus(tab)
          else blur(tab)
        })
      }
      ev.preventDefault()
      ev.stopPropagation()
    }}, el.title || el.id || el.tagName)
    var rm = h('a.hypertabs__x', {href: '#', onclick: function (ev) {
      el.parentNode.removeChild(el)
      menu.removeChild(wrap)
    }}, 'x')

    var wrap = h('div.hypertabs__tab.row.shrink', link, rm)

    function isSelected () {
      if(isVisible(el))
        wrap.classList.add('hypertabs--selected')
      else
        wrap.classList.remove('hypertabs--selected')

      if(el.classList.contains('hypertabs--notify')) {
        wrap.classList.add('hypertabs--notify')
      } else
        wrap.classList.remove('hypertabs--notify')
    }

    new MutationObserver(function (changes) {
      if(el.title !== link.innerText)
        link.innerText = el.title || el.id || el.tagName
      isSelected()
      onSelect && onSelect()
    }).observe(el, {attributes: true, attributeFilter: ['title', 'style', 'class']})

    isSelected()
    wrap.follows = el
    return wrap
  }

  new MutationObserver(function (changes) {
    //iterate over the list, and check that menu is in same order,
    //add any which do not exist, remove any which no longer exist.

    //check if a tab represented by a menu item has been removed.
    each(menu.children, function (btn) {
      if(btn.follows.parentNode != list) menu.removeChild(btn)
    })

    //check if each thing in the list has a tab.
    each(list.children, function (tab, i) {
      var j
      if(menu.children[i] && menu.children[i].follows === tab) {
        //already set, and in correct place. do nothing
      } else if(~(j = find(menu, function (btn) { return btn.follows === tab }))) {
        moveTo(menu[j], list, i)
      } else {
        menu.appendChild(tab_button(tab))      }
    })

    //check if a tab represented by a menu item has been removed.
    each(menu.children, function (btn) {
      if(btn.follows.parentNode != list) menu.removeChild(btn)
    })

  }).observe(list, {childList: true})
  return menu
}


