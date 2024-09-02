require("dotenv").config(); // Load environment variables

const express = require("express");
const app = express();
const cors = require("cors"); // Mechanism to send req from frontend to backend
const PORT = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./db.js");
const authenticationRoutes = require("./Routes/authenticationRoutes.js");
const dishRoutes = require("./Routes/dishRoutes.js");
const path = require("path");

// Connection To MongoDB Start
const dbUrl = process.env.ATLAS_DB_URL;

async function connectToDB() {
  console.log("Connect To DB Called");
  await connectDB();
  console.log("After connection");
}

connectToDB();
// Connection To MongoDB End

const allowedOrigins = process.env.ALLOWED_URLS.split(",");

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);
app.options("*", cors()); // Enable pre-flight requests for all routes

app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("asdfghjkl"));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60,
});

store.on("error", (error) => {
  console.log("Error in the MONGO SESSION STORE.", error);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // To Prevent Cross_Scripting Attacks
    secure: process.env.NODE_ENV === "production", // Use true if in production
    sameSite: "strict", // Helps prevent CSRF attacks
  },
};

app.use(session(sessionOptions));

// Routing Middlewares Start
app.use("/api/authenticate", authenticationRoutes);
app.use("/api/dish", dishRoutes); // Uncomment when ready
// Routing Middlewares End

console.log(
  "Serving static files from:",
  path.join(__dirname, "../Frontend/dist")
);
console.log(
  "Serving index.html from:",
  path.join(__dirname, "../Frontend/dist/index.html")
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
