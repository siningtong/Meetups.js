const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MeetupSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    date: {
      type: Date,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    toJSON: {
      virtuals: true
    }
  }
);
MeetupSchema.virtual("properties.popUpMarkup").get(function () {
  return `
    <strong><a href="/meetups/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`;
});
export const Meetup = mongoose.model("Meetup", MeetupSchema);
// module.exports = mongoose.model("Meetup", MeetupSchema);

var PersonSchema = new Schema(
  {
    name: {
      first: String,
      last: String
    }
  },
  {
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  }
);
