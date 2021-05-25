export default {
    destroyed: function () {
        console.log('foo')
    },
    beforeDestroy: function () {
        console.log('bar')
    }
}
