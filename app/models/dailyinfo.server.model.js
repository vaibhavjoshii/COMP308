const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DailyInfoSchema = new Schema({
  pulserate: Number,
  bloodpressure: String,
  weight: Number,
  temperature: Number,
  respiratoryrate: Number,
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

DailyInfoSchema.set("toJSON", {
  getters: true,
  virtuals: true,
});

mongoose.model("DailyInfo", DailyInfoSchema);
