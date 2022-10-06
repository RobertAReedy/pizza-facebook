const { Comment, Pizza } = require("../models");

const commentController = {
  addComment({ params, body }, res) {
    console.log(body);
    Comment.create(body)
      .then(({ _id }) => {
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $push: { comments: _id } },
          { new: true } //this causes the updated pizza to be returned instead of the version before the added comment
        );
      })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza with this id." });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.json(err));
  },

  removeComment({ params }, res) {
    Comment.findOneAndDelete({ _id: params.commentId })
      .then(deletedComment => {
        if (!deletedComment) {
          return res.status(404).json({ message: "No comment by that id." });
        }
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $pull: { comments: params.commentId } }, //assuming that the comments array in the Pizza keeps a reference to the comment rather than the comment itself, which would explain the need to pull it as well as delete the actual comment
          { new: true }
        );
      })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza by that id. This means a pizza still has a deleted comment attached." });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.json(err));
  },

  addReply({ params, body }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $push: { replies: body } },
      { new: true, runValidators: true }
    )
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza with this ID." });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.json(err));
  },

  removeReply({ params }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $pull: { replies: { replyId: params.replyId } } },
      { new: true }
    )
    .then(dbPizzaData => {
      if (!dbPizzaData) {
        res.status(404).json({ message: "No pizza with this ID." });
        return;
      }
      res.json(dbPizzaData);
    })
    .catch(err => res.json(err));
  }
};

module.exports = commentController;