     
   const mongoose = require('mongoose');

   const orderSchema = mongoose.Schema({
     
    user: { type: Schema.Types.ObjectId, ref: 'users' },
  restaurant: { type: Schema.Types.ObjectId, ref: 'restaurants' },
  items: [{
    name: String,
    price: Number,
    quantity: Number
  }],
  totalPrice: Number,
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    zip: String
  },
      status: {type : String,
    enum : ["placed", "preparing" , "on the way", "delivered"],
     }  // e.g, "placed", "preparing", "on the way", "delivered"
   });

   const OrderModel = mongoose.model("orders",orderSchema);

   module.exports  = {
    OrderModel
   }
