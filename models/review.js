const mongoose =require ("mongoose");
const Schema = mongoose.Schema;

let reviewsSchema = new Schema({
  comment: String,

  rating: {
    type: Number,
    min: 1,
    max: 5,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.export = mongoose.model("Review", reviewsSchema);

