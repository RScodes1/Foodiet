     
   const mongoose = require('mongoose');

   const RestaurantSchema = mongoose.Schema({
    name : {type: String,required: true },
    address : {
        type : Object,
        street : {
            type : String,
        },
        city : {
            type : String,
        },
        state : {
            type : String,
        },
        country : {
            type : String,
        },
        zip : {
            type : String,
        }
     }, menu : {
          type : Object,
         name: {type : String},
          description:{type : String},
         price: { type : Number},
         image: { type : String}
     }
   });

   const RestaurantModel = mongoose.model("restaurants",RestaurantSchema);

   module.exports  = {
    RestaurantModel
   }




// {
//     _id: ObjectId,
//     name: String,
//     address: {
//       street: String,
//       city: String,
//       state: String,
//       country: String,
//       zip: String
//     },
//     menu: [{
//       _id: ObjectId,
//       name: String,
//       description: String,
//       price: Number,
//       image: String
//     }]
//   }
  
  