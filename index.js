const express = require("express");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");

const app = express();
app.use(cookieParser());
app.use(express.urlencoded());
const csrfProtection = csrf({ cookie: true });

app.set("view engine", "pug");

const port = process.env.PORT || 3000;

const users = [
  {
    id: 1,
    firstName: "Jill",
    lastName: "Jack",
    email: "jill.jack@gmail.com"
  }
];

app.get("/", (req, res) => {
  res.render('index', {
    users
  });
});


app.get("/create", csrfProtection, (req, res) => {
  res.render('create', {
    users,
    csrfToken: req.csrfToken()
  });
});



const validateForm = (req, res, next) => {
  const errors = [];
  const {
    firstName,
    lastName,
    email,
    password,
    confirmedPassword
  } = req.body;

  if (!firstName) {
    errors.push("Please provide a first name.");
  }

  if (!lastName) {
    errors.push("Please provide a last name.");
  }

  if (!email) {
    errors.push("Please provide an email.");
  }

  if (!password) {
    errors.push("Please provide a password.");
  }

  if (password !== confirmedPassword) {
    errors.push("The provided values for the password and password confirmation fields did not match.");
  }

  // console.log("errors:", errors);
  req.errors = errors;
  next();
}

app.post("/create", csrfProtection, validateForm, (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password
  } = req.body;

  if (req.errors.length) {
    res.render("create", {
      csrfToken: req.csrfToken(),
      errors: req.errors,
      firstName,
      lastName,
      email,
      password
    });
    return;
  }

  const user = {
    id: users.length + 1,
    firstName,
    lastName,
    email,
    password
  }

  users.push(user);
  res.statusCode = 302;
  res.redirect("/");
});


app.get("/create-interesting", csrfProtection, (req, res) => {
  res.render("create-interesting", {
    users,
    csrfToken: req.csrfToken()
  });
});


app.post("/create-interesting", csrfProtection, validateForm, (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmedPassword,
    age,
    favoriteBeatle,
    iceCream
  } = req.body;

  if (req.errors.length) {
    res.render("create", {
      csrfToken: req.csrfToken(),
      errors: req.errors,
      firstName,
      lastName,
      email,
      password,
      confirmedPassword,
      age,
      favoriteBeatle,
      iceCream
    });
    return;
  }

  const user = {
    id: users.length + 1,
    firstName,
    lastName,
    email,
    password,
    age,
    favoriteBeatle,
    iceCream
  }

  users.push(user);
  res.statusCode = 302;
  res.redirect("/");
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
