const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js"); 

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String
  },
  price: Number,
  location: String,
  country: String,
   reviews:[
    {
    type: Schema.Types.ObjectId,
    ref:"Review",
   }
  
  ],
  owner:{
     type:Schema.Types.ObjectId,
     ref:"User",
   }
});

listingSchema.post("findOneAndDelete" , async(listing)=>{
  if(listing){
     await Review.deleteMany({_id: {$in: listing.reviews}} )
  }
 
})
module.exports  = mongoose.model("Listing", listingSchema);






