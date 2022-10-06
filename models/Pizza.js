const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String,
      required: true,
      trim: true
    },
    createdBy: {
      type: String,
      required: "No created provided.",
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
      type: String,
      enum: ["Personal", "Small", "Medium", "Large", "Extra Large"],
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
  return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});
const Pizza = model("Pizza", PizzaSchema);

module.exports = Pizza;