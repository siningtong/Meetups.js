<template>
  <v-container>
    <v-row>
      <v-col>
        <div style="width: 100%; height: 400px" id="map"></div>
      </v-col>
    </v-row>
    <v-row wrap class="mb-2 mt-4">
      <v-col>
        <v-carousel style="cursor: pointer" cycle>
          <v-carousel-item
            v-for="meetup in meetups"
            :key="meetup._id"
            :src="meetup.imageUrl"
            hide-delimiter-background
            show-arrows-on-hover
            @click="onLoadMeetup(meetup._id)"
          >
            <div class="title">{{ meetup.title }}</div>
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
    <v-row>
      <v-col xs12 class="d-flex justify-center mb-6">
        <p>Join Our Awesome Meetups!</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import mapboxgl from "mapbox-gl";

// import axios from "axios";
export default {
  data() {
    return {
      model: 0,
      accessToken: process.env.VUE_APP_MAPBOX_TOKEN
    };
  },
  computed: {
    meetups() {
      return this.$store.getters.featuredMeetups;
    }
  },
  methods: {
    onLoadMeetup(id) {
      this.$store.getters.isAuthenticated
        ? this.$router.push("/meetups/" + id)
        : this.$router.push("/login");
    }
  },
  mounted() {
    this.$store.dispatch("loadMeetups").then(() => {
      let locationData = { features: this.$store.getters.featuredMeetups };
      console.log("locationData", locationData);
      mapboxgl.accessToken = this.accessToken;
      let map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/dark-v10",
        center: [-103.59179687498357, 40.66995747013945],
        zoom: 3
      });
      if (locationData.features) {
        map.on("load", function () {
          map.addSource("meetups", {
            type: "geojson",
            data: locationData,
            cluster: true,
            clusterMaxZoom: 14, // Max zoom to cluster points on
            clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
          });

          map.addLayer({
            id: "clusters",
            type: "circle",
            source: "meetups",
            filter: ["has", "point_count"],
            paint: {
              "circle-color": [
                "step",
                ["get", "point_count"],
                "#51bbd6",
                10,
                "#f1f075",
                30,
                "#f28cb1"
              ],
              "circle-radius": [
                "step",
                ["get", "point_count"],
                20,
                100,
                30,
                750,
                40
              ]
            }
          });

          map.addLayer({
            id: "cluster-count",
            type: "symbol",
            source: "meetups",
            filter: ["has", "point_count"],
            layout: {
              "text-field": "{point_count_abbreviated}",
              "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
              "text-size": 12
            }
          });

          map.addLayer({
            id: "unclustered-point",
            type: "circle",
            source: "meetups",
            filter: ["!", ["has", "point_count"]],
            paint: {
              "circle-color": "#11b4da",
              "circle-radius": 4,
              "circle-stroke-width": 1,
              "circle-stroke-color": "#fff"
            }
          });

          // inspect a cluster on click
          map.on("click", "clusters", function (e) {
            let features = map.queryRenderedFeatures(e.point, {
              layers: ["clusters"]
            });
            let clusterId = features[0].properties.cluster_id;
            map
              .getSource("meetups")
              .getClusterExpansionZoom(clusterId, function (err, zoom) {
                if (err) return;

                map.easeTo({
                  center: features[0].geometry.coordinates,
                  zoom: zoom
                });
              });
          });

          // When a click event occurs on a feature in
          // the unclustered-point layer, open a popup at
          // the location of the feature, with
          // description HTML from its properties.
          map.on("click", "unclustered-point", function (e) {
            let coordinates = e.features[0].geometry.coordinates.slice();
            let { popUpMarkup } = e.features[0].properties;
            // Ensure that if the map is zoomed out such that
            // multiple copies of the feature are visible, the
            // popup appears over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
              .setLngLat(coordinates)
              .setHTML(popUpMarkup)
              .addTo(map);
          });

          map.on("mouseenter", "clusters", function () {
            map.getCanvas().style.cursor = "pointer";
          });
          map.on("mouseleave", "clusters", function () {
            map.getCanvas().style.cursor = "";
          });
        });
      }
    });
  }
};
</script>

<style scoped>
.title {
  position: absolute;
  bottom: 50px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 2em;
  padding: 10px;
}
</style>
