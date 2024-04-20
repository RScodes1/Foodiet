const express = require('express');

const userRouter = express.Router();

const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")

const {UserModel} = require("../model/user.model");
const { RestaurantModel } = require("../model/restaurant.model");
const { OrderModel } = require("../model/order.model");


userRouter.post('/api/register', async(req,res)=>{
    const {username, email, password} = req.body;
    try {
        const existinguser = await UserModel.findOne({email});
        if(existinguser){
            res.status(500).json({msg: "user already registered"})
        } else {
             bcrypt.hash(password, 8, async(err, hash)=>{
                  if(err){
                    res.status(502).json({msg: "error hashing password"});
                  } else if(hash){
                      const user = new UserModel({username, email, password : hash});
                      await user.save();
                      res.status(201).json({msg: "user registered successfully"});
                  }
             })
        }
    } catch (error) {
        console.log("error", error);
    }
})

userRouter.post('/api/login',async(req,res)=>{
    const {email, password} = req.body;

       try {
        const existinguser1 = await UserModel.find({email});
        if(!existinguser1){
            res.status(500).json({msg : "user doesnt exist"});
        } else {
            bcrypt.compare(existinguser1.password, password, (err, result)=>{
                if(err){
                 res.status(500).json({msg : "password not matched"});
                } else if(result){
                    const token  = jwt.sign(existinguser1._id, "masai");
                    res.status(200).json({msg : "user login sucessfully"}, token);
                }
            })
        }
       } catch (error) {
        console.log("error",error);
       }
})

userRouter.patch('api/user/:id/reset', async(req,res)=>{
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

      try {
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        bcrypt.compare(currentPassword, user.password, async(err, result) => {
            if (err) {
                return res.status(500).json({ msg: 'Error comparing passwords' });
            }
            if (!result) {
                return res.status(400).json({ msg: 'Current password is incorrect' });
            }

            const hash = await bcrypt.hash(newPassword, 8);
            user.password = hash;
            await user.save();

            return res.status(204).end();
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
});


userRouter.post('/api/restaurants', async(req, res) => {
    const { name, address, menu } = req.body;

    try {
        const restaurant = new RestaurantModel({ name, address, menu });
        await restaurant.save();
        return res.status(201).json({ msg: 'Restaurant created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
});

userRouter.get('/api/restaurants', async(req, res) => {
    try {
        const restaurants = await RestaurantModel.find();
        return res.status(200).json(restaurants);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
});

userRouter.get('/api/restaurants/:id', async(req, res) => {
    const { id } = req.params;

    try {
        const restaurant = await RestaurantModel.findById(id);
        if (!restaurant) {
            return res.status(404).json({ msg: 'Restaurant not found' });
        }
        return res.status(200).json(restaurant);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
});

userRouter.get('/api/restaurants/:id/menu', async(req, res) => {
    const { id } = req.params;

    try {
        const restaurant = await RestaurantModel.findById(id);
        if (!restaurant) {
            return res.status(404).json({ msg: 'Restaurant not found' });
        }
        return res.status(200).json(restaurant.menu);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
});

userRouter.put('/api/restaurants/:id/menu', async(req, res) => {
    const { id } = req.params;
    const { name, description, price, image } = req.body;

    try {
        const restaurant = await RestaurantModel.findById(id);
        if (!restaurant) {
            return res.status(404).json({ msg: 'Restaurant not found' });
        }

        const menuItem = { name, description, price, image };
        restaurant.menu.push(menuItem);
        await restaurant.save();

        return res.status(201).json({ msg: 'Menu item added successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
});

userRouter.delete('/api/restaurants/:id/menu/:menuId', async(req, res) => {
    const { id, menuId } = req.params;

    try {
        const restaurant = await RestaurantModel.findById(id);
        if (!restaurant) {
            return res.status(404).json({ msg: 'Restaurant not found' });
        }

        restaurant.menu = restaurant.menu.filter(item => item._id.toString() !== menuId);
        await restaurant.save();

        return res.status(202).json({ msg: 'Menu item deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
});

userRouter.post('/api/orders', async(req, res) => {
    const { user, restaurant, items, totalPrice, deliveryAddress, status } = req.body;

    try {
        const order = new OrderModel({ user, restaurant, items, totalPrice, deliveryAddress, status });
        await order.save();
        return res.status(201).json({ msg: 'Order placed successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
});

userRouter.get('/api/orders/:id', async(req, res) => {
    const { id } = req.params;

    try {
        const order = await OrderModel.findById(id).populate('user').populate('restaurant');
        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }
        return res.status(200).json(order);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
});

userRouter.put('/api/orders/:id', async(req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const order = await OrderModel.findByIdAndUpdate(id, { status }, { new: true });
        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }
        return res.status(204).end();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
});

module.exports = {userRouter};
