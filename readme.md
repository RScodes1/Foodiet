# Restaurant Ordering System

This is a backend application built with Express and Mongoose for managing restaurants, menus, and orders.

## Getting Started

To get started with this project, clone the repository and install the dependencies:

```bash```
git clone https://github.com/yourusername/restaurant-ordering-system.git
cd restaurant-ordering-system
npm install


```run the server```
npm start


## API Endpoints
User Authentication <br>
<br>
POST /api/register: Register a new user <br>
POST /api/login: Login with existing user credentials <br>
<br>
User Management <br>

<br>
PUT /api/user/:id/reset: Reset user password <br>
Restaurant Management <br>
POST /api/restaurants: Add a new restaurant <br>
GET /api/restaurants: Get a list of all restaurants <br>
GET /api/restaurants/:id: Get details of a specific restaurant <br>
GET /api/restaurants/:id/menu: Get the menu of a specific restaurant <br>
PUT /api/restaurants/:id/menu: Add a new item to a restaurant's menu <br>
DELETE /api/restaurants/:id/menu/:menuId: Delete a menu item from a restaurant's menu <br>
<br>
Order Management <br>
<br>
POST /api/orders: Place a new order <br>
GET /api/orders/:id: Get details of a specific order  <br>
PUT /api/orders/:id: Update the status of a specific order <br>
