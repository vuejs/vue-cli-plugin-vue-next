import { Store as TheStore } from 'vuex';

const store = new TheStore({
  state () {
    return {
      count: 1
    }
  }
});

export default store;
