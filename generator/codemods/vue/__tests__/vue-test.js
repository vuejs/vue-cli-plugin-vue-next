jest.autoMockOff()

const { defineTest } = require('jscodeshift/dist/testUtils')

defineTest(__dirname, 'index', null, 'add-emit-declaration')
defineTest(__dirname, 'index', null, 'rename-lifecycle')
