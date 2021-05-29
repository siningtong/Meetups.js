<template>
  <v-container>
    <v-row class="mt-4" v-for="meetup in meetups" :key="meetup.id">
      <v-col class="d-flex justify-center mb-6" xs12>
        <v-card class="teal accent-4" max-width="800">
          <v-container fluid>
            <v-row>
              <v-col xs5 sm4 md3>
                <v-img height="130px" :src="meetup.imageUrl"></v-img>
              </v-col>
              <v-col xs7 sm8 md9>
                <v-card-title>{{ meetup.title }}</v-card-title>
                <v-card-subtitle>
                  {{ meetup.date }}
                </v-card-subtitle>
                <v-card-actions>
                  <v-btn text :to="'/meetups/' + meetup._id">
                    View Meetup
                  </v-btn>
                </v-card-actions>
              </v-col>
            </v-row>
          </v-container>
          <v-spacer></v-spacer>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    meetups() {
      return this.$store.getters.loadedMeetups;
    }
  },
  methods: {},
  created() {
    this.$store.dispatch("loadMeetups");
  }
};
</script>
