export default {
    emits: ["increment", "decrement"],
    props: ['text'],

    methods: {
        input: function(){
            this.$emit('increment');
            this.$emit('decrement');
        }
    }
};
