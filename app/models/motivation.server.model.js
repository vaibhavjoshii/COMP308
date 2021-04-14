const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MotivationSchema = new Schema({
    message: {
      type: String,
      required: "Message is required!!"
    },
    unread: Boolean,
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    created: {
      type: Date,
      default: Date.now
    }
  });
  
  MotivationSchema.set("toJSON", {
    getters: true,
    virtuals: true
  });
  
  mongoose.model("Motivation", MotivationSchema);