jest.autoMockOff()

const { defineTest } = require('jscodeshift/dist/testUtils')

defineTest(__dirname, 'index', null, 'store')
defineTest(__dirname, 'index', null, 'vuex-dot-store')
defineTest(__dirname, 'index', null, 'import-alias')
