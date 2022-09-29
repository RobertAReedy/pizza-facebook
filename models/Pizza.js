const { Schema, model } = require("mongoose");

const PizzaSchema = new Schema({
  pizzaName: {
    type: String
  },
  createdBy: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  size: {
    type: String,
    default: "Large"
  },
  toppings: []
  //,toppings: { type: Array } //would this work?
});

const Pizza = model("Pizza", PizzaSchema);

module.exports = Pizza;