const dishServices = require("../Services/dishServices.js");

module.exports.addDish = async (req, res) => {
  const { userDishName, dbDishName, category, type, userId } = req.body;
  console.log(userId);

  // Basic validation
  if (!userDishName || !dbDishName || !category || !type || !userId) {
    return res.status(400).send({ message: "Improper Data" });
  }

  try {
    const response = await dishServices.addDishForUser(userId, {
      userDishName,
      dbDishName,
      category,
      type,
    });
    console.log("New dish added!", response);
    if (response.existingDish) {
      res.status(409).json({ message: response.message });
    }
    return res.status(201).json({ message: "Dish Added To DB" });
  } catch (error) {
    console.error("Error in addDish controller:", error);
    res.status(500).send({ message: "Unable to add dish" });
  }
};

module.exports.showDish = async (req, res) => {
  // const { userId } = req.body; //Get this id from JWT Token
  // console.log(userId);
  console.log("Inside /showdish route");
  console.log("User in /showdish:", req.user); // Check if user is available
  const dbUserId = req.user.userId;
  console.log(dbUserId);
  try {
    const dishes = await dishServices.getDishesByUserId(dbUserId);
    console.log(dishes);
    if (!res.headersSent) {
      res.status(200).json(dishes);
    }
  } catch (e) {
    console.error("Error in showDish controller:", e);
    if (!res.headersSent) {
      res.status(500).send("Server Error");
    }
  }
};

module.exports.getDish = async (req, res) => {
  console.log("Request received for generating a random dish");
  const userId = req.user.userId; // Get userId from the req.user object set by the isLoggedIn middleware
  console.log(userId);
  try {
    const randomDish = await dishServices.getRandomDishByUserId(userId);
    console.log("Random Dish In Controller:", randomDish);
    res.status(200).json(randomDish);
    console.log("Response sent");
  } catch (error) {
    console.error("Error in getDish controller:", error);
    res.status(400).json({ message: "Unable to Generate Random Dish" });
  }
};

module.exports.deleteDish = async (req, res) => {
  console.log("Request received for deleteDish");
  console.log(req.body, "This is the request body");
  const { id: dishId, userId } = req.query; // Read query parameters
  console.log(userId); // Get userId from authenticated user

  try {
    const response = await dishServices.deleteDishForUser(userId, dishId);
    res.status(200).send(response);
  } catch (error) {
    console.error("Error in deleteDish controller:", error);
    res.status(400).send({ message: error.message || "Unable to delete dish" });
  }
};

module.exports.generateDish = async (req, res) => {
  console.log("Request received for generatingDish");
  const { question } = req.body; // Dish ID from request body
  console.log(question, "Controller");
  const prompt = `Give Me All The Food Items I Can Prepare With Following Ingredients ${question}. Items Should Be In A List Form 
  & I Only Want The Names Of The Items Nothing Else. Give "*" As A Bullet Point To Each List Item`;
  try {
    const generatedDishes = await dishServices.generateDishForUser(prompt);
    console.log(generatedDishes, "generatedDishes in Controller");
    res.status(200).json({ text: generatedDishes });
  } catch (error) {
    console.log(error);
  }
};

module.exports.searchNearbyRestaurants = async (req, res) => {
  console.log("Request received for knowing all the restaurants.");
  const { lat, lng, radius } = req.query;

  try {
    const restaurants = await dishServices.searchNearbyRestaurantsService(
      lat,
      lng,
      radius
    );
    res.json(restaurants);
    console.log("Restaurant data sent from endpoint to checkplaces");
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ error: "Failed to fetch restaurants" });
  }
};
