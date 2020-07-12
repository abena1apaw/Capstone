const express = require("express");

const app = new express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const newPostController = require("./controllers/newPost");
const homeController = require("./controllers/home");
const storePostController = require("./controllers/storePost");
const getPostController = require("./controllers/getPost");
const newUserController = require("./controllers/newUser");
const storeUserController = require("./controllers/storeUser");
const loginController = require("./controllers/login");
const loginUserController = require("./controllers/loginUser");
const expressSession = require("express-session");
const logoutController = require("./controllers/logout");

const validateMiddleware = require("./middleware/validateMiddleware");
const authMiddleware = require("./middleware/authMiddleware");
const redirectIfAuthenticatedMiddleware = require("./middleware/redirectIfAuthenticatedMiddleware");
const flash = require("connect-flash");

app.use(fileUpload());

mongoose.connect("mongodb+srv://dbuser:AItZ29azEXpRQvvm@cluster0.rlg9x.mongodb.net/my_database", { useNewUrlParser: true });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(express.static("public"));

app.listen(4000, () => {
  console.log("App listening on port 4000 ...");
});

app.use("/posts/store", validateMiddleware);

app.use(
  expressSession({
    secret: "keyboard cat",
  })
);

global.loggedIn = null;

app.use("*", (req, res, next) => {
  loggedIn = req.session.userId;
  username = req.session.username;
  next();
});

app.use(flash());

app.get("/posts/new", authMiddleware, newPostController);
app.get("/", homeController);
app.post("/posts/store", authMiddleware, storePostController);
app.get("/post/:id", getPostController);
app.get("/auth/register", redirectIfAuthenticatedMiddleware, newUserController);
app.post(
  "/users/register",
  redirectIfAuthenticatedMiddleware,
  storeUserController
);
app.get("/auth/login", redirectIfAuthenticatedMiddleware, loginController);
app.post(
  "/users/login",
  redirectIfAuthenticatedMiddleware,
  loginUserController
);

app.get("/about", (req, res) => {
res.render("about");
});
 
app.get("/contact", (req, res) => {
res.render("contact");
});
 
app.get("/post", (req, res) => {
res.render("post");
});
app.get("/auth/logout", logoutController);
app.use((req, res) => res.render("notfound"));
