import { Router } from "express";
import { Meetup } from "../models/meetup";
const router = Router();

router.get("/", async (req, res) => {
  const meetups = await Meetup.find();
  res.send(meetups);
});
router.patch("/edit/:id", async (req, res) => {
  const { title, location, imageUrl, description, date } = req.body.params;
  const id = req.params.id;
  const newMeetupData = { title, location, imageUrl, description, date };

  try {
    const meetup = await Meetup.findByIdAndUpdate(id, newMeetupData, {
      new: true
    });
    res.send(meetup);
  } catch (error) {
    console.log("update error", error);
  }
});
router.delete("/delete/:id", async (req, res) => {
  console.log("req.params.id", req.params.id);
  const id = req.params.id;
  try {
    // const meetup = await Meetup.findById(id);
    const deleteMeetup = await Meetup.findByIdAndDelete(id);
    res.status(200).send(deleteMeetup);
  } catch (error) {
    console.log("delete error", error);
  }
});
export default router;
