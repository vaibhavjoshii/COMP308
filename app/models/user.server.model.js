const mongoose = require("mongoose");
const crypto = require("crypto");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstname: String,
  lastname: String,
  username: {
    type: String,
    unique: true,
    required: "Username is required",
  },
  password: {
    type: String,
    required: "Password is required",
  },
  role: {
    type: String,
    required: "Role is required",
  },
 
  salt: {
    type: String,
  },

  created: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", function (next) {
  if (this.password) {
    this.salt = new Buffer(crypto.randomBytes(16).toString("base64"), "base64");
    this.password = this.hashPassword(this.password);
  }
  next();
});

UserSchema.methods.hashPassword = function (password) {
  return crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha1")
    .toString("hex");
};

UserSchema.methods.authenticate = function (password) {
  return this.password === this.hashPassword(password);
};

UserSchema.set("toJSON", {
  getters: true,
  virtuals: true,
});

mongoose.model("User", UserSchema);
