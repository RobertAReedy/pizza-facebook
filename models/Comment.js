const { Schema, model, Types } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const ReplySchema = new Schema(
  {
    writtenBy: {
      type: String,
      required: true,
      trim: true
    },

    replyBody: {
      type: String,
      required: true,
      trim: true
    },

    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => dateFormat(createdAtVal)
    },

    replyId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    }
  },
  {
    toJSON: {
      getters: true
    }
  }
);

const CommentSchema = new Schema(
  {
    writtenBy: {
      type: String,
      required: true,
      trim: true
    },

    commentBody: {
      type: String,
      required: true,
      trim: true
    },

    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => dateFormat(createdAtVal)
    },

    replies: [ReplySchema] //no need for "rel" as we have replyschema in the same file here
  },
  {
    toJSON: {
      getters: true,
      virtuals: true
    },
    id: false
  }
);

CommentSchema.virtual("replyCount").get(function() {
  return this.replies.length;
});

const Comment = model("Comment", CommentSchema);

module.exports = Comment;