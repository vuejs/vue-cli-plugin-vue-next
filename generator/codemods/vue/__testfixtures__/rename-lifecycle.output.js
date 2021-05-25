export default {
    unmounted: function () {
        console.log('foo')
    },
    beforeUnmount: function () {
        console.log('bar')
    }
}
