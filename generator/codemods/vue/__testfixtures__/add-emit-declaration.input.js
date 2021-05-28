export default {
    props: ['text'],
    methods: {
        input: function(){
            this.$emit('increment');
            this.$emit('decrement');
        }
    }
}
