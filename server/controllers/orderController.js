import Order from "../models/orderModel.js";

const addOrder = async (req, res) => {
  const { userId, products, totalCost } = req.body;
  console.log(userId, products, totalCost);
  // const userId = localStorage.getItem("userId");
  try {
    const order = new Order({
      user: req.body.user,
      orderItems: req.body.orderItems,
      totalPrice: req.body.totalPrice,
    });

    const savedOrder = await order.save();
    console.log(savedOrder);

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default addOrder;
