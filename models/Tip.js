const mongoose = require("mongoose");

const TipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    // default is public as our tips can be public or private
    default: "public",
    // enum is the list of possible values to choose
    enum: ["public", "private"],
  },
  // use is connected to tips to let us know who did what
  user: {
    type: mongoose.Schema.Types.ObjectId,
    // ref (reference to User)connects it to the User model as it is a special type  in the database
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Tip", TipSchema);
