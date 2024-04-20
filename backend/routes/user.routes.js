const express = require('express');

const userRouter = express.Router();

const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")

const {UserModel} = require("../model/user.model");
const { RestaurantModel } = require("../model/restaurant.model");
const { OrderModel } = require("../model/order.model");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description:  the user name
 *         email:
 *           type: string
 *           description: the user email
 *         password:
 *           type: string
 *           description: the user email
 *         address: 
 *           type: object
 *           properties:
 *               street:
 *                    type : string
 *                    description: The street of the user
 *               city:
 *                    type : string
 *                    description: The city of the user 
 *               state:
 *                    type : string
 *                    description: The state of the user
 *               country:
 *                    type : string
 *                    description: The country of the user
 *               zip:
 *                    type : string
 *                    description: The zip of the user
 */

/**
 * @swagger
 * /users:
 *  get:
 *      summary: This will get all the users data from database
 *      tags: [Users]
 *      responses:
 *          200:
 *              description: The list of all the users
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          item:
 *                              $ref:"#/components/schemas/User"
 *          400:
 *               description: some error occured
 */



/**
 * @swagger
 * /users/api/register:
 *  post:
 *      summary: This post the new user details data from database
 *      tags: [Users]
 *      requestBody: 
 *          required: true
 *          content:
 *              application/json:
 *              schema:
 *                  $ref: "#/components/schemas/User"
 *      responses:
 *          200:
 *              description: To add a new user to list of all the users
 *              content:
 *                  application/json:
 *                      schema:                
 *                          item:
 *                              $ref:"#/components/schemas/User"
 *          400: 
 *               description: internal server error
 */

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


/**
* @swagger
* /users/{id}:
*  patch:
*       summary: Update a user by ID
*       description: Update an existing user identified by their ID.
*       parameters:
*         - name: id
*           in: path
*           description: ID of the user to update
*           required: true
*           schema:
*             type: string
*         - name: body
*           in: body
*           description: Data to update the user with
*           required: true
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/User'
*       responses:
*         200:
*           description: Successfully updated user
*         404:
*           description: User not found
*/


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

/**
 * @swagger
 * /api/restaurants:
 *   post:
 *     summary: Add a new restaurant
 *     tags: [Restaurants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   country:
 *                     type: string
 *                   zip:
 *                     type: string
 *               menu:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     price:
 *                       type: number
 *                     image:
 *                       type: string
 *     responses:
 *       '201':
 *         description: Restaurant created successfully
 *       '401':
 *         description: creation failed
 */      

userRouter.get('/api/restaurants', async(req, res) => {
    try {
        const restaurants = await RestaurantModel.find();
        return res.status(200).json(restaurants);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
});

/**
 * @swagger
 * /api/restaurants/:id
 *   get:
 *     summary: get restaurant models
 *     tags: [Restaurants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   country:
 *                     type: string
 *                   zip:
 *                     type: string
 *               menu:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     price:
 *                       type: number
 *                     image:
 *                       type: string
 *     responses:
 *       '201':
 *         description: Restaurant retrived successfully
 *     
 */
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

/**
 * @swagger
 * /api/restaurants/{id}/menu:
 *   get:
 *     summary: Get the menu of a specific restaurant
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the restaurant
 *     responses:
 *       '200':
 *         description: Menu retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   price:
 *                     type: number
 *                   image:
 *                     type: string
 *   put:
 *     summary: Add a new item to a restaurant's menu
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the restaurant
 *       - in: body
 *         name: menuItem
 *         required: true
 *         description: The menu item to add
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             description:
 *               type: string
 *             price:
 *               type: number
 *             image:
 *               type: string
 *     responses:
 *       '201':
 *         description: Menu item added successfully
 *       '404':
 *         description: Restaurant not found
 *       '500':
 *         description: Internal server error
 */

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

/**
 * @swagger
 * /api/restaurants/{id}/menu/{menuId}:
 *   delete:
 *     summary: Delete a menu item from a restaurant's menu
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the restaurant
 *       - in: path
 *         name: menuId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the menu item
 *     responses:
 *       '202':
 *         description: Menu item deleted successfully
 *       '404':
 *         description: Restaurant not found
 *       '500':
 *         description: Internal server error
 */

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

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               restaurant:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *                     quantity:
 *                       type: number
 *               totalPrice:
 *                 type: number
 *               deliveryAddress:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   country:
 *                     type: string
 *                   zip:
 *                     type: string
 *               status:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Order placed successfully
 *       '500':
 *         description: Internal server error
 */

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

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get details of a specific order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the order
 *     responses:
 *       '200':
 *         description: Order details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                 restaurant:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       price:
 *                         type: number
 *                       quantity:
 *                         type: number
 *                 totalPrice:
 *                   type: number
 *                 deliveryAddress:
 *                   type: object
 *                   properties:
 *                     street:
 *                       type: string
 *                     city:
 *                       type: string
 *                     state:
 *                       type: string
 *                     country:
 *                       type: string
 *                     zip:
 *                       type: string
 *                 status:
 *                   type: string
 *   put:
 *     summary: Update the status of a specific order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the order
 *       - in: body
 *         name: status
 *         required: true
 *         description: The new status of the order
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *     responses:
 *       '204':
 *         description: Order status updated successfully
 *       '404':
 *         description: Order not found
 *       '500':
 *         description: Internal server error
 */

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
