import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    tagText: '',
    subreddit: '',
  },
  mutations: {
    setTagText: (state, tagText) => {
      state.tagText = tagText;
    },
    setSubreddit: (state, subreddit) => {
      state.subreddit = subreddit;
    },
  },
});
