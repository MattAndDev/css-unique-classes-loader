const csstree = require('css-tree')
const crypto = require('crypto')

const cache = {}
const createUniqueClassNames = async (css) => {
  const ast = csstree.parse(css)
  const map = {}
  csstree.walk(ast, function (node) {
    const id = 'flix-' + crypto.randomBytes(3).toString('hex')
    if (node.type === 'ClassSelector') {
      const name = node.name
      if (cache[name]) {
        node.name = cache[name]
        map[name] = cache[name]
      }
      if (!map[name] && !cache[name]) {
        map[name] = id
        cache[name] = id
        node.name = id
      }
    }
  })
  const raw = await csstree.generate(ast)
  return { map, raw }
}

module.exports = async function (source) {
  const { raw, map } = await createUniqueClassNames(source)
  return 'export default {\nraw: ' + JSON.stringify(raw) + ',\nmap:' + JSON.stringify(map) + '}'
}
