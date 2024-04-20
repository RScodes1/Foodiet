     
   const mongoose = require('mongoose');

   const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zip: String
    }
   })

   const UserModel = mongoose.model("users",userSchema);

   module.exports  = {
    UserModel
   }
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