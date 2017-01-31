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

function moveTo(el, content, i) {
  if(!content.children.length || i >= content.children.length)
    content.appendChild(el)
  else
    content.insertBefore(el, content.children[i])
}

module.exports = function (content, onSelect) {
  var menu = h('section.tabs')
  var selection

  function build_tab (el, onclick) {
    var link = h('a.link', {
      href: '#',
      onclick: function (ev) {
        if(ev.shiftKey) toggle_focus(el)
        else {
          each(content.children, function (tab) {
            if(tab == el) focus(tab)
            else blur(tab)
          })
        }
        ev.preventDefault()
        ev.stopPropagation()
      }},
      el.title || el.id || el.tagName
    )
    var rm = h('a.close', {
      href: '#',
      onclick: function (ev) {
        el.parentNode.removeChild(el)
        menu.removeChild(tab)
      }},
      'x'
    )

    var tab = h('div.tab', link, rm)

    function isSelected () {
      if(isVisible(el))
        tab.classList.add('-selected')
      else
        tab.classList.remove('-selected')

      if(el.classList.contains('-notify'))
        tab.classList.add('-notify')
      else
        tab.classList.remove('-notify')
    }

    new MutationObserver(function (changes) {
      if(el.title !== link.innerText)
        link.innerText = el.title || el.id || el.tagName
      isSelected()
      onSelect && onSelect()
    }).observe(el, {attributes: true, attributeFilter: ['title', 'style', 'class']})

    isSelected()
    tab.follows = el
    return tab
  }

  new MutationObserver(function (changes) {
    //iterate over the content, and check that menu is in same order,
    //add any which do not exist, remove any which no longer exist.

    //check if a tab represented by a menu item has been removed.
    each(menu.children, function (btn) {
      if(btn.follows.parentNode != content) menu.removeChild(btn)
    })

    //check if each thing in the content has a tab.
    each(content.children, function (tab, i) {
      var j
      if(menu.children[i] && menu.children[i].follows === tab) {
        //already set, and in correct place. do nothing
      } else if(~(j = find(menu, function (btn) { return btn.follows === tab }))) {
        moveTo(menu[j], content, i)
      } else {
        menu.appendChild(build_tab(tab))      }
    })

    //check if a tab represented by a menu item has been removed.
    each(menu.children, function (btn) {
      if(btn.follows.parentNode != content) menu.removeChild(btn)
    })

  }).observe(content, {childList: true})
  return menu
}


