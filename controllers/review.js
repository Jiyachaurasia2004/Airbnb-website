const { model } = require("mongoose");
const User = require("../modules/user.js");

module.exports.renderNewFrom = (req, res) => {
  res.render("users/signup");
};

module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const Newuser = new User({ email, username });
    const registeredUser = await User.register(Newuser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to wonderlust");
      let redirectUrl = res.locals.redirectUrl || "/listing";
      res.redirect(redirectUrl);
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/users/signup");
  }
};

module.exports.renderLoginFrom = (req, res) => {
  res.render("users/login");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to wonderlust");
  res.redirect("/listing");
};

module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logged out");
    res.redirect("listing");
    
  });
};
