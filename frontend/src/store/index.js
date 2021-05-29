import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import router from "../router";
import jwt from "jsonwebtoken";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    token: null,
    userId: null,
    loadedMeetups: []
  },
  mutations: {
    authUser(state, userData) {
      state.token = userData.token;
      state.userId = userData.userId;
    },
    createMeetup(state, payload) {
      state.loadedMeetups.push(payload);
    },
    loadMeetups(state, payload) {
      state.loadedMeetups = payload;
    },
    logout(state) {
      state.token = null;
      state.userId = null;
      router.push("/");
    }
  },
  actions: {
    setLogoutTimer({ commit }, expiration) {
      setTimeout(() => {
        commit("logout");
      }, expiration);
    },
    signUp({ commit }, params) {
      console.log("commit", commit);
      axios
        .post("http://localhost:3000/user/register", {
          params
        })
        .then(() => {
          router.push("/login");
        })
        .catch((error) => {
          console.log("error", error.response);
        });
    },
    signIn({ commit, dispatch }, playload) {
      axios
        .post("http://localhost:3000/user/login", {
          userName: playload.userName,
          password: playload.password
        })
        .then((response) => {
          const user = response.data;

          if (user) {
            commit("authUser", {
              token: user,
              userId: jwt.decode(user).user._id
            });
            const now = new Date().getTime();
            const exp =
              jwt.decode(response.data).exp - jwt.decode(response.data).iat;
            const expirationDate = new Date(now + exp * 1000);
            localStorage.setItem("token", user);
            localStorage.setItem("userId", jwt.decode(user).user._id);
            localStorage.setItem("expirationDate", expirationDate);

            dispatch("setLogoutTimer", exp * 1000);
          }
        })
        .then(() => {
          router.push("/");
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
    tryAutoLogin({ commit }) {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      const expirationDate = localStorage.getItem("expirationDate");
      const now = new Date();
      if (now >= expirationDate) {
        return;
      }
      const userId = localStorage.getItem("userId");
      commit("authUser", { token, userId });
    },
    createMeetup({ commit }, payload) {
      const meetup = {
        title: payload.title,
        location: payload.location,
        imageUrl: payload.imageUrl,
        description: payload.description,
        date: payload.date,
        id: Math.random() * 10
      };
      //reach to database and store it and get id
      commit("createMeetup", meetup);
    },
    loadMeetups({ commit }) {
      axios.get("http://localhost:3000/meetups").then((response) => {
        commit("loadMeetups", response.data);
      });
    },
    logout({ commit }) {
      localStorage.clear();
      commit("logout");
    }
  },
  modules: {},
  getters: {
    loadedMeetups(state) {
      return state.loadedMeetups.sort((meetupA, meetupB) => {
        return meetupA.date > meetupB.date;
      });
    },
    featuredMeetups(state, getters) {
      return getters.loadedMeetups.slice(0, 5);
    },
    isAuthenticated(state) {
      return state.token !== null;
    }
    // loadedMeetup(state) {
    //   return (meetupId) => {
    //     return state.loadedMeetups.find((meetup) => {
    //       return Number(meetup.id) === meetupId;
    //     });
    //   };
    // }
  }
});
