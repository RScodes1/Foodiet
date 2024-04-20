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
User Authentication

POST /api/register: Register a new user
POST /api/login: Login with existing user credentials

User Management

PUT /api/user/:id/reset: Reset user password
Restaurant Management
POST /api/restaurants: Add a new restaurant
GET /api/restaurants: Get a list of all restaurants
GET /api/restaurants/:id: Get details of a specific restaurant
GET /api/restaurants/:id/menu: Get the menu of a specific restaurant
PUT /api/restaurants/:id/menu: Add a new item to a restaurant's menu
DELETE /api/restaurants/:id/menu/:menuId: Delete a menu item from a restaurant's menu

Order Management

POST /api/orders: Place a new order
GET /api/orders/:id: Get details of a specific order
PUT /api/orders/:id: Update the status of a specific order
