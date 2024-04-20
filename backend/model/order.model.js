     
   const mongoose = require('mongoose');

   const orderSchema = mongoose.Schema({
     
    user : {type : objectId, ref : 'users'},
    restaunrant : {type : objectId, ref : 'restaurants'},
    items: [{
        name: String,
        price: Number,
        quantity: Number
      }],
      totalPrice: {type : Number},
   
      deliveryAddress: {
        street: {type : String},
        city: {type : String},
        state: {type : String},
        country: {type : String},
        zip: {type : String}
      },
      status: {type : String,
    enum : ["placed", "preparing" , "on the way", "delivered"],
     }  // e.g, "placed", "preparing", "on the way", "delivered"
   });

   const OrderModel = mongoose.model("orders",orderSchema);

   module.exports  = {
    OrderModel
   }
