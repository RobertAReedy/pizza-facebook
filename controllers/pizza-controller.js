const { Pizza } = require("../models");

const pizzaController = {
  //functions will go here as methods
  getAllPizza(req, res) {
    Pizza.find({})
      .populate({
        path: "comments",
        select: "-__v"
      })
      .select("-__v")
      .sort({ _id: -1 }) //somehow this means to display newest first
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  getPizzaById({ params }, res) {
    Pizza.findOne({ _id: params.id })
      .populate({
        path: "comments",
        select: "-__v"
      })
      .select("-__v")
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza with this ID"});
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  createPizza({ body }, res) {
    Pizza.create(body)
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => res.status(400).json(err));
  },

  updatePizza({ params, body }, res) {
    Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(400).json({ message: "No pizza with this ID"});
          return;
        }
        res.json(dbPizzaData);
      })
        .catch(err => res.status(400).json(err));
  },

  deletePizza({ params }, res) {
    Pizza.findOneAndDelete({ _id: params.id })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza with this ID" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.status(400).json(err));
  },
  
  deleteAllPizzas(req, res) {
    Pizza.deleteMany({})
      .then(res.send("Emergency clear finished."))
      .catch(error => res.send("Something went wrong with the emergency clear."));
  }
};

module.exports = pizzaController;