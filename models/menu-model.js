const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const menuSchema = new Schema({
  mealNo: Number,
  mealType: String,
  name: String,
  price: Number,
});

const Menu = mongoose.model("menuList", menuSchema);

module.exports = Menu;

const menuList = [
  {
    name: "rice and chicken pepper soup",
    price: "70",
    mealType: "main",
    mealNo: "3",
  },
  { name: "seafood pasta", price: "13000", mealType: "main", mealNo: "4" },
  {
    name: "Calamari soup",
    price: "40",
    mealType: "starter",
    mealNo: "5",
  },
  {
    name: "cake ice-cream",
    price: "30",
    mealType: "dessert",
    mealNo: "6",
  },
  { name: "stir-fry cous-cous", price: "6400", mealType: "main", mealNo: "7" },
  {
    name: "pina colada ice cream cake slice ",
    price: "40",
    mealType: "dessert",
    mealNo: "8",
  },
  {
    name: "rice pudding",
    price: "2200",
    mealType: "starter",
    mealNo: "9",
  },
];

// (async () => {
//   const res = await Menu.create(menuList);
//   console.log(res);
// })();
