const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const { listingSchema } = require("./schema.js");
const Review = require("./models/review.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};


//Index Route
app.get("/listings", wrapAsync(async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/index.ejs", { listings });
}));
//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});
//Show Route
//app.get("/listings/:id", wrapAsync(async (req, res) => {
 // let { id } = req.params;
 // const listing = await Listing.findById(id);
//  res.render("listings/show.ejs", { listing });
//}));
app.get('/listings/:id', async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render('listings/show', { listing, currUser: req.user });  // ✅
});


//Create Route
app.post("/listings",
  validateListing,
   wrapAsync
   (async (req, res,next) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}))
;

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

//Update Route
app.put("/listings/:id",validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
}));

//Reviews
//Post Review Route
app.post("/listings/:id/reviews", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  const review = new Review(req.body.review); // ✅ Constructor used here
  listing.reviews.push(review);
  await review.save();
  await listing.save();
  res.redirect(`/listings/${id}`);
});

// Define the Listing schema and mode


app.use((err,req,res,next)=>{
  let {statusCode = 500, message = "Something Went Wrong"} = err;
 res.status(statusCode).send(message);
});



//

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
