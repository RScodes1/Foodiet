     
   const mongoose = require('mongoose');

   const userSchema = mongoose.Schema({
    name : {type: String,required: true },
     email : {type :String, required : true},
     password : {type: String }
   })

// {
//     _id: ObjectId,
//     name: String,
//     email: String,
//     password: String,
//     address: {
//       street: String,
//       city: String,
//       state: String,
//       country: String,
//       zip: String
//     }
//   }