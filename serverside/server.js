const fs = require("fs/promises");
const http = require("http");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongodb-session")(session);
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const { Server } = require("socket.io");

// const moment = require("moment");
const app = express();
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "public", "chat.html"));
});
// const app = require("../app");
const Menu = require("./models/menu-Model");
const Chat = require("./models/chat-Model");
const User = require("./models/user-Model");
const Order = require("./models/order-Model");

const PORT = 4000,
  HOST = "localhost";

mongoose
  .connect("mongodb://localhost:27017/restaurantBot")
  .then(() => {
    console.log("Connection to MongoDB Successful!");
    httpServer.listen(PORT, HOST, () => {
      console.log("Server running on port", PORT);
    });
  })
  .catch((error) => {
    console.log(error, "Connection to MongoDB failed!");
  });

const httpServer = http.createServer(app);

const io = new Server(httpServer);

// const wrap = (midddleware) => (socket, next) =>
//   midddleware(socket.request, {}, next);

const store = new MongoStore({
  uri: "mongodb://localhost:27017/restaurantBot",
  collection: "sessions",
});

store.on("error", (error) => {
  console.log(error);
});

const sessionMW = session({
  secret: "I-am-proud-to-be-a-female-developer",
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false }, // Set secure to true if using HTTPS
});

app.use(sessionMW);
app.use(cookieParser());

// io.use(wrap(sessionMW));
io.use((socket, next) => {
  sessionMW(socket.request, {}, next);
});

io.on("connection", async (socket) => {
  const menu = await Menu.find({}).sort({ mealNo: 1 });
  const option = await fs.readFile(
    path.join(__dirname, "public", "option.json")
  );
  const options = JSON.parse(option);
  const session = socket.request.session;
  console.log(session.userId);
  let userID = session.userId;
  let user;
  if (!userID) {
    userID = uuidv4();
    session.userId = userID;
    session.save((err) => {
      if (err) {
        console.error("Error occured while saving session:", err);
      } else {
        console.log("Saved user ID to session:", userID);
      }
    });
    user = await User.create({ userId: userID });
  } else {
    user = await User.findOne({ userId: userID });
  }
  console.log(session.userId);
  //   // Load Chat History
  // const userChatHistory = await Chat.find({
  //   userId: user._id,
  // });
  // socket.emit("loadChatHistory", userChatHistory);
  //   Initial Msg
  socket.emit("botInitialMsg", Object.values(options[0]));
  // Save Chat
  socket.on("saveMsg", async (chat, isBotMsg) => {
    const chatMsg = await Chat.create({
      userId: user._id,
      chatMsg: chat,
      isBotMsg,
      // time: moment.now("h:mm n"),
    });
    // console.log(chatMsg);
  });

  socket.on("msgInput", async (chatInput) => {
    const selectedItems = chatInput.split(",");
    let orders = menu.filter((item) => selectedItems.includes(item.dishNo));
    session.orders = orders;
    // console.log(session.orders);
    const selectionPattern = /^[3-9](,[3-9])*$/;
    switch (true) {
      case chatInput === "1":
        socket.emit("botMessage", { type: "menu", data: menu });
        break;
      case chatInput === "99":
        // Checkout  and save to database
        if (session.currentOrder) {
          const orders_Id = session.currentOrder.map((order) => order._id);
          await Order.create({ orders: orders_Id, userId: user._id });
          socket.emit("botMessage", {
            type: null,
            data: { message: Object.values(options[1]) },
          });
          session.currentOrder = undefined;
          session.save((err) => {
            if (err) {
              console.log(err);
            }
          });
        } else {
          socket.emit("botMessage", {
            type: null,
            data: { message: "you didn't select any order." },
          });
        }

        break;
      case chatInput === "98":
        // orderhistory
        const orderHistory = await Order.find({ userId: user._id }).populate(
          "orders"
        );
        if (orderHistory.length) {
          socket.emit("botMessage", {
            type: "orderHistory",
            data: orderHistory,
          });
        } else {
          socket.emit("botMessage", {
            type: null,
            data: {
              message:
                "please place an order!! you don't have any order with us",
            },
          });
        }

        break;
      case chatInput === "97":
        //current order

        if (session.currentOrder) {
          socket.emit("botMessage", {
            type: "currentOrder",
            data: session.currentOrder,
          });
        } else {
          socket.emit("botMessage", {
            type: null,
            data: { message: "No current order." },
          });
        }
        break;
      case chatInput === "0":
        // Checkout logic

        if (session.currentOrder) {
          socket.emit("botMessage", {
            type: null,
            data: { message: "Order cancelled" },
          });
          session.currentOrder = undefined;
          session.save((err) => {
            console.log(err);
          });
        } else {
          socket.emit("botMessage", {
            type: null,
            data: { message: "No order to cancel." },
          });
        }
        break;
      case selectionPattern.test(chatInput):
        const itemdSeleted = chatInput.split(",");
        let orders = menu.filter((item) =>
          itemdSeleted.includes(item.mealNo.toString())
        );
        if (orders.length) {
          socket.emit("botMessage", { type: "currentOrder", data: orders });
          session.currentOrder = orders;
          session.save((err) => {
            if (err) {
              console.log(err);
            }
          });
        }
        break;
      default:
        socket.emit("botMessage", {
          type: "invalidInput",
          data: { message: "wrong input" },
        });
        break;
    }
  });
});