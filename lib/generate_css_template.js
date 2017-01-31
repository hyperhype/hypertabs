var fs = require('fs')
var path = require('path')
var mcss = require('micro-css') 

var template = fs.readFileSync(path.join(__dirname, '../template.mcss'), 'utf8')

template = template.replace(/{/g, '{\ndisplay: flex\n') // add some dummy style to force compile

css = mcss(template)
css = css.replace(/display: flex;/g, '')

fs.writeFile(path.join(__dirname, '../template.css'), css)

