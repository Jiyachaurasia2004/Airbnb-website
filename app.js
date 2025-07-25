if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}



const express = require("express");
const mongoose = require("mongoose");
const port = 8081;
const app = express();
const path = require("path");
const ejsMate = require('ejs-mate');
const methodOverride = require("method-override");
const ExpressError = require("./utils/Expresserror.js");
const session = require("express-session")
const MongoStore = require('connect-mongo');
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./modules/user.js")



const listingRouter = require("./Router/listing.js")
const reviewsRouter = require("./Router/reviews.js");
const userRouter = require("./Router/user.js");

const dburl = process.env.ALTASDB_URL;

main()
  .then((res) => {
    console.log("mongose server succesfully connected");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dburl);
  
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl:dburl,
       crypto: {
        secret: process.env.SECRET,
     },

     touchAfter: 24 * 3600
})

store.on("error",()=>{
  console.log("ERROR IN MONGO STORE DATA",err)
})

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true, 
  cookie:{
     expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
     maxAge: 7 * 24 * 60 * 60 * 1000,
     httpOnly: true,
  },
};



app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  res.locals.curruser = req.user;
  next();
})


app.use("/listing",listingRouter);
app.use("/listing/:id/reviews",reviewsRouter);
app.use("/",userRouter);

// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found"));
// });

app.use((err, req, res, next) => {
  let { statusCode=500 , message="something went wrong"  } = err;
  res.status(statusCode).render("error", { message });
});

app.listen(port, () => {
  console.log(`sever the start ${port} `);
});


app.get("/", (req, res) => {
  res.redirect("/users/signup");
});










