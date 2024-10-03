export default {
  name: 'Authentication',
  state: {
    user: null,
    isLoggedIn: false,
    token: null,
    user_id: null,
    role: 4
  },
  mutations: {
    SET_USER(state, username) {
      state.user = username;
    },
    SET_AUTH(state, auth) {
      state.isLoggedIn = auth;
    },
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_USER_ID(state, user_id) {
      state.user_id = user_id;
    },
    SET_ROLE(state, role) {
      state.role = role;
    },
    updateStore(state, data) {
      this.SET_USER(state, data.username);
      this.SET_AUTH(state, data.isLoggedIn);
      this.SET_TOKEN(state, data.token);
      this.SET_USER_ID(state, data.user_id);
      this.SET_ROLE(state, data.role);
    }
  },
  actions: {
    logout({ commit }) {
      commit('SET_USER', null);
      commit('SET_AUTH', false)
      commit('SET_TOKEN', null);
      commit('SET_USER_ID', null);
      commit('SET_ROLE', 4);
    },
    login({ commit }, data) {
      commit('SET_USER', data.username);
      commit('SET_USER_ID', data.user_id);
      commit('SET_AUTH', true);
      commit('SET_TOKEN', data.token);
      commit('SET_ROLE', data.role);
    },
  },
  getters: {
    isLoggedIn(state) {
      return state.isLoggedIn;
    },
    getUser(state) {
      return state.user;
    },
    getToken(state) {
      return state.token;
    },
    getUserID(state) {
      return state.user_id;
    },
    getRole(state) {
      return state.role;
    }
  }
};