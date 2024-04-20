     
   const mongoose = require('mongoose');

   const userSchema = mongoose.Schema({
    name : {type: String,required: true },
     email : {type :String, required : true},
     password : {type: String },
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