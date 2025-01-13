const { relative } = require('path')
const { ESLint } = require('eslint')

module.exports = {
  '*': async files => {
    return ['pnpm format'] // wjdlz/TODO: need to add lint fix as well
  }
}
