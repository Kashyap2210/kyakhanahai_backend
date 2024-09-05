const mongoose = require("mongoose");

/* MODEL FOR THE USER STARTS*/
const DishSchema = new mongoose.Schema({
  userDishName: {
    type: String,
    required: true,
  },
  dbDishName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Dish = mongoose.model("Dish", DishSchema);

module.exports = Dish;
