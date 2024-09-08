require("dotenv").config(); // Load environment variables
const axios = require("axios"); //Used to send async req to REST Endpoints
const Dish = require("../Models/dish.js");
const GEMINI_KEY = process.env.GOOGLE_GEMINI_API;
const apiKey = process.env.GOOGLE_API_KEY;

const addDishForUser = async (userId, dishData) => {
  try {
    const { userDishName, dbDishName, category, type } = dishData;

    const existingDish = await Dish.findOne({ dbDishName });

    if (existingDish) {
      return { message: "Dish Already Exists", existingDish };
    } else {
      // Create a new dish instance
      const newDish = new Dish({
        userDishName,
        dbDishName,
        category,
        type,
        userId,
      });
      await newDish.save();
      return { message: "Dish Added To DB" };
    }
    // Save the dish to the database
  } catch (error) {
    console.log("Error adding dish:", error);
    throw new Error("Unable to add dish");
  }
};

//userId will come from the JWT Token
const getDishesByUserId = async (userId) => {
  try {
    const dishes = await Dish.find({ userId });
    return dishes;
  } catch (error) {
    console.error("Error retrieving dishes:", error);
    throw new Error("Error retrieving dishes");
  }
};

const getRandomDishByUserId = async (userId) => {
  console.log("In service for getting random dish");
  try {
    const totalDishes = await Dish.countDocuments({ userId });
    console.log(totalDishes);
    if (totalDishes === 0) {
      console.log("No dishes found for this user.");
      throw new Error("No dishes found for this user.");
    }
    const randomDishNumber = Math.floor(Math.random() * totalDishes);
    console.log(randomDishNumber);
    console.log(`Random dish index: ${randomDishNumber}`);

    const randomDish = await Dish.findOne({ userId })
      .skip(randomDishNumber)
      .limit(1);

    console.log("Random Dish:", randomDish);

    return randomDish;
  } catch (error) {
    console.error("Error generating random dish:", error);
    throw new Error("Unable to generate random dish");
  }
};

const deleteDishForUser = async (userId, dishId) => {
  console.log(userId, "User Id");
  console.log(dishId, "Dish Id");
  try {
    const result = await Dish.findOneAndDelete({ _id: dishId, userId });
    if (!result) {
      throw new Error("Dish not found");
    }
    return { message: "Dish Deleted" };
  } catch (error) {
    console.error("Error deleting dish:", error);
    throw new Error("Unable to delete dish");
  }
};

const generateDishForUser = async (prompt) => {
  // console.log(question, "Service");
  console.log(
    "Request recieved for generating random dish from the user.",
    "Inside Service"
  );
  const sendReqToGemini = await axios({
    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,
    method: "post",
    data: {
      contents: [{ parts: [{ text: prompt }] }],
    },
  });
  const generatedDishTextFromGemini =
    sendReqToGemini.data.candidates[0].content;

  console.log(generatedDishTextFromGemini);

  return generatedDishTextFromGemini;
};

const searchNearbyRestaurantsService = async (lat, lng, radius) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          location: `${lat},${lng}`,
          radius: radius,
          type: "restaurant",
          key: apiKey,
        },
        withCredentials: true,
      }
    );
    console.log("API Response:", response.data);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw new Error("Failed to fetch restaurants");
  }
};

module.exports = {
  addDishForUser,
  getDishesByUserId,
  getRandomDishByUserId,
  deleteDishForUser,
  generateDishForUser,
  searchNearbyRestaurantsService,
};
