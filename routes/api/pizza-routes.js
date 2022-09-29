const router = require("express").Router();
const { getAllPizza, getPizzaById, createPizza, deletePizza, updatePizza, deleteAllPizzas } = require("../../controllers/pizza-controller");

router
  .route("/")
  .get(getAllPizza)
  .post(createPizza);

router
  .route("/emergencyClear")
  .delete(deleteAllPizzas);
  
router
  .route("/:id")
  .get(getPizzaById)
  .put(updatePizza)
  .delete(deletePizza);

module.exports = router;