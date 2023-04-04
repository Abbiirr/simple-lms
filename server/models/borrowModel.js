import mongoose from "mongoose";

const borrowSchema = mongoose.Schema({
  bookID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  due_date: {
    type: Date,
    required: true,
  },
  returned_date: {
    type: Date,
    default: null,
  },
});

const Borrow = mongoose.model("Borrow", borrowSchema);

export default Borrow;
