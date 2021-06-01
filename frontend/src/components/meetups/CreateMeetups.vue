<template>
  <v-container>
    <v-row>
      <v-col class="d-flex justify-center mb-6 mt-4">
        <h3 class="primary--text">Create A New Meetup</h3>
      </v-col>
    </v-row>
    <v-card class="d-flex justify-center mb-6 mt-4">
      <v-row>
        <v-col>
          <v-form @submit.prevent="createMeetup">
            <v-container>
              <v-text-field
                v-model="title"
                :counter="50"
                label="Title"
                required
              ></v-text-field>

              <v-text-field
                v-model="location"
                label="Location"
                required
              ></v-text-field>

              <v-text-field
                v-model="imageUrl"
                label="ImageUrl"
                required
              ></v-text-field>
              <v-row>
                <v-col>
                  <v-img
                    max-height="300px"
                    max-width="300px"
                    :src="imageUrl"
                  ></v-img> </v-col
              ></v-row>

              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-menu
                    v-model="menu1"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="date"
                        label="Picker without buttons"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="date"
                      @input="menu2 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <!-- <v-col cols="11" sm="5">
                  <v-menu
                    ref="menu"
                    v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="time"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="time"
                        label="Picker in menu"
                        prepend-icon="mdi-clock-time-four-outline"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-model="time"
                      full-width
                      @click:minute="$refs.menu.save(time)"
                    ></v-time-picker>
                  </v-menu>
                </v-col> -->
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="description"
                    label="Description"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <v-row>
              <v-col>
                <v-btn
                  :disabled="!valid"
                  color="blue-grey lighten-2"
                  type="submit"
                  >Create Meetup</v-btn
                ></v-col
              >
            </v-row>
          </v-form>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    meetup: null,
    title: "",
    location: "",
    imageUrl: "",
    description: "",
    date: new Date().toISOString().substr(0, 10),
    menu1: false
    // menu2: false,
    // time: null
  }),
  computed: {
    valid() {
      return (
        this.title !== "" &&
        this.location !== "" &&
        this.imageUrl !== "" &&
        this.description !== ""
      );
    }
  },
  methods: {
    createMeetup() {
      const params = {
        title: this.title,
        location: this.location,
        imageUrl: this.imageUrl,
        description: this.description,
        date: this.date,
        userId: this.$store.state.userId
      };
      axios.post("api/create", { params }).then((data) => {
        console.log("create new one", data);
        this.$router.push("/");
      });
      this.title = "";
      this.location = "";
      this.imageUrl = "";
      this.description = "";
    }
  }
};
</script>
