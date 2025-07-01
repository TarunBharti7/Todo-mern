const express = require("express");
require("dotenv").config();
require("./db.js");
const userRoute = require("./routes/user.routes.js");
const todoRoute = require("./routes/todo.routes.js");
const cookieParser = require("cookie-parser");
const { verifyToken } = require("./jwt.js");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const authRouter = require('./routes/auth.routes.js');

// Use CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend's URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    credentials: true, // Allow credentials (cookies, authorization headers)
  })
);

// oauth login with goggle
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.get("/", verifyToken, (req, res) => {
  console.log(req.user.email);

  res.status(200).send("hello todo");
});

app.get("/check", (req,res) => {
  res.send("hello from backend")
})

app.use("/user", userRoute);
app.use("/api", verifyToken, todoRoute);
app.use("/auth", authRouter);

app.listen(process.env.PORT, () => {
  console.log("server is running on port : ", process.env.PORT);
});
