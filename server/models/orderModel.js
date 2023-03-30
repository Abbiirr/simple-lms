import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    orderItems: [
      {
        name: { type: String },
        qty: { type: Number },
        image: { type: String },
        price: { type: Number },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
