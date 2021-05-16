import { Router } from "express";
import { Meetup } from "../models/meetup";
import { User } from "../models/user";
const router = Router();

router.post("/", async (req, res) => {
  const { title, location, imageUrl, description, date } = req.body.params;
  let meetupData = {
    title,
    imageUrl,
    date,
    location,
    description
  };
  // console.log("meetupData", meetupData);
  const newmeetup = new Meetup(meetupData);
  const user = await User.find();
  // console.log("user", user);
  newmeetup.owner = user[0];
  let createdNewMeetup = await newmeetup.save();
  res.send(createdNewMeetup);
});
export default router;
