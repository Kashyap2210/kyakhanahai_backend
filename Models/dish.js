const mongoose = require("mongoose");

/* MODEL FOR THE DISH START */
const userFoodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },

  //It stores users data so that each dish can be associated to a user
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Dish = mongoose.model("Dish", userFoodSchema);

module.exports = Dish;
