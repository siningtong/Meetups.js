import { Router } from "express";
import { Meetup } from "../models/meetup";
import { User } from "../models/user";
const router = Router();
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });

router.post("/", async (req, res) => {
  const { title, location, imageUrl, description, date, userId } =
    req.body.params;
  const geoData = await geocoder
    .forwardGeocode({
      query: location,
      limit: 1
    })
    .send();
  const geometry = geoData.body.features[0].geometry;
  console.log("geometry", geometry);
  let meetupData = {
    title,
    imageUrl,
    date,
    location,
    geometry,
    description,
    owner: userId
  };
  // // console.log("meetupData", meetupData);
  const newmeetup = new Meetup(meetupData);
  // const user = await User.find();
  // // console.log("user", user);
  // newmeetup.owner = user[0];
  let createdNewMeetup = await newmeetup.save();
  res.send(createdNewMeetup);
});
export default router;
