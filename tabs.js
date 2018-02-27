var h = require('hyperscript')
var u = require('./lib/util')
  each = u.each,
  find = u.find,
  isVisible = u.isVisible,
  setVisible = u.setVisible,
  setInvisible = u.setInvisible

function toggle_focus(page) {
  isVisible(page)
    ? blur(page)
    : focus(page)
}

function focus(page) {
  if (isVisible(page)) return

  setVisible(page)
  var el = page.firstChild
  el.dispatchEvent(new CustomEvent('focus', {target: el}))
}

function blur (page) {
  if (!isVisible(page)) return

  setInvisible(page)
  var el = page.firstChild
  el.dispatchEvent(new CustomEvent('blur', {target: el}))
}

function moveTo(page, content, i) {
  if(!content.children.length || i >= content.children.length)
    content.appendChild(page)
  else
    content.insertBefore(page, content.children[i])
}

module.exports = function (content, onSelect, onClose) {
  var tabs = h('section.tabs')
  var selection

  function build_tab (page) {
    function close () {
      page.parentNode.removeChild(page)
      tabs.removeChild(tab)
      onClose && onClose(page.firstChild)
    }

    var link = h('a.link', {
      href: '#',
      onclick: function (ev) {
        ev.preventDefault()
        ev.stopPropagation()

        if(ev.shiftKey) toggle_focus(page)
        else {
          each(content.children, function (_page) {
            if(_page == page) focus(_page)
            else blur(_page)
          })
        }
      },
      onauxclick: function (ev) {
        if(ev.which && ev.which === 2) {
          ev.preventDefault()
          ev.stopPropagation()
          close()
        }
      }},
      getTitle(page)
    )
    var rm = h('a.close', {
      href: '#',
      onclick: function (ev) {
        ev.preventDefault()
        ev.stopPropagation()
        close()
      }},
      'x'
    )

    var tab = h('div.tab', [
      link, rm
    ])

    function updateTabClasses () {
      if(isVisible(page))
        tab.classList.add('-selected')
      else
        tab.classList.remove('-selected')

      if(page.classList.contains('-notify'))
        tab.classList.add('-notify')
      else
        tab.classList.remove('-notify')
    }

    function getTitle(page) {
      var el = page.firstChild
      return el.title || el.id || el.tagName
    }

    new MutationObserver(function (changes) {
      if(page.title !== link.innerText)
        link.innerText = getTitle(page)
      updateTabClasses()
      onSelect && onSelect()
    }).observe(page, {attributes: true, attributeFilter: ['title', 'style', 'class']})

    updateTabClasses()
    tab.page = page
    return tab
  }

  new MutationObserver(function (changes) {
    //iterate over the content, and check that tabs is in same order,
    //add any which do not exist, remove any which no longer exist.

    //check if a page represented by a tab has been removed.
    each(tabs.children, function (tab) {
      if(tab.page.parentNode != content) tabs.removeChild(tab)
    })

    //check if each page in the content has a tab.
    each(content.children, function (page, i) {
      var j
      if(tabs.children[i] && tabs.children[i].page === page) {
        //already set, and in correct place. do nothing
      } else if(~(j = find(tabs, function (tab) { return tab.page === page }))) {
        moveTo(tabs[j], content, i)
      } else {
        tabs.appendChild(build_tab(page))
      }
    })
  }).observe(content, {childList: true})
  return tabs
}




