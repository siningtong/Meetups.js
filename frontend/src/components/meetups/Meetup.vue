<template>
  <v-container>
    <v-layout>
      <v-flex xs12>
        <v-card>
          <v-card-title class="blue-grey--text">{{
            meetup.title
          }}</v-card-title>
          <v-img height="300px" :src="meetup.imageUrl"></v-img>
          <v-card-subtitle class="blue-grey--text">
            {{ meetup.date }}-{{ meetup.location }}
          </v-card-subtitle>
          <v-card-text>{{ meetup.description }}</v-card-text>
          <v-card-actions>
            <v-btn color="blue-grey lighten-2" @click="goToEdit" text>
              Edit
            </v-btn>
            <v-btn color="blue-grey lighten-2" @click="dialog = true" text>
              Delete
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="blue-grey lighten-2" text> Register </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="380">
        <v-card>
          <v-card-title class="headline">
            Delete {{ meetup.title }}?
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="deleteMeetup">
              Confirm
            </v-btn>
            <v-btn color="green darken-1" text @click="dialog = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  props: ["id"],
  data() {
    return {
      dialog: false
    };
  },
  computed: {
    meetup() {
      return this.$store.getters.loadedMeetups.find((meetup) => {
        return meetup._id === this.id;
      });
    }
  },
  methods: {
    goToEdit() {
      this.$router.push({ path: "/meetup/edit", query: { id: this.id } });
    },
    deleteMeetup() {
      // console.log("this.$route.query.id", this.$route.query.id);
      axios
        .delete("http://localhost:3000/meetups/delete/" + this.id)
        .then((response) => {
          this.$router.push("/");
          console.log("delete response", response);
        });
    }
  }
};
</script>
