const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String
    },
    createdBy: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
      type: String,
      default: "Large"
    },
    toppings: [],
    comments: [ //how does it know about Comment.js?
      {
        type: Schema.Types.ObjectId,
        ref: "Comment"
      }
    ]
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);

/**
 * Rather than storing a value in the database, which
 * would need to be updated every time a comment was
 * added, we can simply add this virtual, which will
 * activate and calculate the 'comment count' by
 * using the length of the comments array
 */
PizzaSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});
const Pizza = model("Pizza", PizzaSchema);

module.exports = Pizza;