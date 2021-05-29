<template>
  <v-container>
    <v-row>
      <v-col xs12>
        <v-card max-width="400px">
          <v-card-title class="justify-center blue-grey--text">
            <h3>{{ meetup.title }}</h3>
          </v-card-title>
          <v-img max-width="400" height="300px" :src="meetup.imageUrl"></v-img>
          <v-card-subtitle class="blue-grey--text">
            {{ meetup.date }}-{{ meetup.location }}
          </v-card-subtitle>
          <v-card-text>{{ meetup.description }}</v-card-text>
          <v-card-actions>
            <v-btn
              v-if="isOwnThisMeetup()"
              color="blue-grey lighten-2"
              @click="goToEdit"
              text
            >
              Edit
            </v-btn>
            <v-btn
              v-if="isOwnThisMeetup()"
              color="blue-grey lighten-2"
              @click="dialog = true"
              text
            >
              Delete
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="blue-grey lighten-2" text> Register </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col>
        <v-card max-width="400px">
          <div style="width: 400px; height: 400px" id="map"></div>
        </v-card>
        <!-- <MglMap
          :accessToken="accessToken"
          :mapStyle="mapStyle"
          :center="coordinates"
          :minZoom="minZoom"
        >
          <MglMarker :coordinates="coordinates" color="blue">
            <MglPopup :coordinates="coordinates" anchor="top">
              <div>{{ meetup.title }}</div>
            </MglPopup>
          </MglMarker>
          <mapbox-cluster data="/earthquakes.json" />
        </MglMap> -->
      </v-col>
    </v-row>
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
import mapboxgl from "mapbox-gl";
// import Mapbox from "mapbox-gl";
// import { MglMap, MglMarker, MglPopup } from "vue-mapbox";
export default {
  // components: {
  //   MglMap,
  //   MglMarker,
  //   MglPopup
  // },
  props: ["id"],
  data() {
    return {
      dialog: false,
      accessToken: process.env.VUE_APP_MAPBOX_TOKEN
      // mapStyle: "mapbox://styles/mapbox/streets-v11"
      // coordinates: [],
      // minZoom: 8
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
      axios
        .delete("http://localhost:3000/meetups/delete/" + this.id)
        .then((response) => {
          this.$router.push("/");
          console.log("delete response", response);
        });
    },
    isOwnThisMeetup() {
      return this.meetup.owner === this.$store.state.userId;
    }
  },
  mounted() {
    mapboxgl.accessToken = this.accessToken;
    // init the map
    this.map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [
        this.meetup.geometry.coordinates[0],
        this.meetup.geometry.coordinates[1]
      ],
      zoom: 5
    });
    new mapboxgl.Marker()
      .setLngLat([
        this.meetup.geometry.coordinates[0],
        this.meetup.geometry.coordinates[1]
      ])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<h3>${this.meetup.title}</h3>`
        )
      )
      .addTo(this.map);

    // this.addControls();
    // this.map.on("load", () => {
    //   this.addMarkers();
    // });
    // this.map.addControl(new mapboxgl.NavigationControl());
    // this.mapbox = Mapbox;
    // if (this.meetup) {
    //   this.coordinates = [
    //     this.meetup.geometry.coordinates[0],
    //     this.meetup.geometry.coordinates[1]
    //   ];
    // }
  }
};
</script>
