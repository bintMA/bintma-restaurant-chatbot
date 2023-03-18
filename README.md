# FoodPlanet ChatBot

The FoodPlanet ChatBot is a chatbot application that enables users to place orders for their preferred meals at FoodPlanet.

Built as a project at [Altschool Africa School of Engineering 3rd semester exam - Node.js track](https://docs.google.com/document/d/1wI4Y7eIQy9Qs9sR9JLoJglNJp5B4i4rV2Ch6-JV-dfo/edit)

## User Interaction

Once you enter the application you get to see options to place an order, checkout, see order history or cancel an order. These options has specific commands

- To see the menu, send `1`.
- To place your order, send the number preceding the items you want to order e.g `2. plantain => $5`.
- To checkout an order, send `99`.
- To see order history, send `98`.
- To see current order, send `97`.
- To cancel current order, send `0`.

> **Kindly Note**

1. When ordering multiple meals, seperate the values with a comma (no space) e.g. `4,5,6`.
2. If you enter any random text or number not listed, the bot will regard it as an invalid response.
3. After checking out the order is placed and saved in the database. Each user have a unique sesion ID and this ID is used to save all user message inside the database, so, after reloading the user can still get their chat history
   After every reload the still get his/her chat history for future refrences

### Main Dependencies

- **node.js** and **express** as the JavaScript runtime environment and server framework
- **mongodb** preferred database
- **mongoose** an ODM library
- **socket.io** to allow interaction between users and server
- **connect-mongodb-session** used to store each user session
- **express-session** express-session used for generating sessionID for each user

## Main Files: Project Structure

```sh

├── README.md *** Instructions on how to set-up the project locally.
├── package.json *** The dependencies to be installed with "npm install"
├── server.js *** Entry point of the app
├── .env
├── ex.env
├── models
│   ├── user-model.js
│   ├── chat-model.js
│   ├── menu-model.js
│   ├── order-model.js
├──  public
│   ├── images
│       ├── botlogo.png
│       ├── send.svg
│   ├── client.js
│   ├── option.json
│   ├── chat.html
└── └── style.css


```

## Getting Started Locally

### Prerequisites & Installation

To be able to get this application up and running, ensure to have [node](https://nodejs.org/en/download/) installed on your device.

### Development Setup

1. **Download the project locally by forking this repo and then clone or just clone directly with:**

```
git clone https://github.com/bintMA/bintma-restaurant-chatbot

```

2. **Install the dependencies** from the root directory, in your terminal run:

```
npm install

```

3. **Create a .env file just like the ex.env**

   - Assign the `SESSION_SECRET` variable a very strong secret.
   - Assign the `SESSION_EXPIRATION_TIME` variable a very long time in milliseconds.

4. **Set up the Database**

   - Create 2 MongoDB databases on your local MongoDB server or in the cloud (Atlas)
   - Copy the connection strings and assign it to the `MONGODB_CONNECTION_URL` and other environment variables in the ex.env file each.
   - On connection to these databases, four collections - `users`,`chats`,`orders`,`menus`and `sessions` will be created.

5. **Run the development server:** bash or command prompt

```
npm run dev

```

5. **Now your server should be up and running** at [http://127.0.0.1:4000/](http://127.0.0.1:4000/) or [http://localhost:4000](http://localhost:4000)

## Models

### User

Example of a response of user saved in the Database

```json
{
  "_id": {
    "$oid": "6410bc6d3a3d4ef76f202b87"
  },
  "userId": "82583dac-cc9a-4a13-93dc-f8a06fa6a5b4",
  "orders": [],
  "__v": 0
}
```

### Chat

Example of response from the Database when user sends 1

```json

{
  "_id": {
    "$oid": "64108015db4cbdcb2a8c8857"
  },
  "userId": {
    "$oid": "64108009db4cbdcb2a8c8853"
  },
  "chatMsg": "3,5",
  "isBotMsg": false,
  "__v": 0
}
{
  "_id": {
    "$oid": "64108130db4cbdcb2a8c885c"
  },
  "userId": {
    "$oid": "6410812bdb4cbdcb2a8c885a"
  },
  "chatMsg": "1",
  "isBotMsg": false,
  "__v": 0
}

```

## Deployment

[FoodPlanet](https://foodplacebot.onrender.com/)

## Acknowledgements

My utmost gratitude goes to Almighty Allah, my family, AltSchool Africa team, my friends and colleagues

## Creator

[Adeola M. Adelodun ](https://github.com/bintMA)
