const csstree = require('css-tree')
const crypto = require('crypto')
const { getOptions } = require('loader-utils')
const validateOptions = require('schema-utils')
const { name } = require('./package.json')

const schema = {
  type: 'object',
  properties: {
    generateUniqueName: {
      instanceof: 'Function'
    }
  }
}

const defaultIdGenerator = (classname) => {
  return crypto.randomBytes(7).toString('hex')
}

const cache = {}
const createUniqueClassNames = async function (css, uniqueFunction) {
  const ast = csstree.parse(css)
  const map = {}
  csstree.walk(ast, function (node) {
    if (node.type === 'ClassSelector') {
      const id = uniqueFunction(node.name)
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
  const options = getOptions(this)
  validateOptions(schema, options, name)
  const uniqueFn = options.generateUniqueName || defaultIdGenerator
  const { raw, map } = await createUniqueClassNames(source, uniqueFn)
  return 'export default {\nraw: ' + JSON.stringify(raw) + ',\nmap:' + JSON.stringify(map) + '}'
}
