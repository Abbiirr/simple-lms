import axios from "axios";
import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAILURE,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAILURE,
} from "../constants/orderConstants";
import { getUserId } from "../utilities/utils";
export const createOrder =
  (userId, products, totalPrice) => async (dispatch, getState) => {
    try {
      dispatch({ type: ORDER_CREATE_REQUEST });

      //   const userId = localStorage.getItem("userId");

      const order = { userId, products, totalPrice };
      const { data } = await axios.post(
        "/api/orders/create",

        {
          user: order.userId,
          orderItems: order.products,
          totalPrice: Number(order.totalPrice),
        }
      );

      dispatch({
        type: ORDER_CREATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ORDER_CREATE_FAILURE,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const listOrders = () => async (dispatch) => {
  try {
    dispatch({ type: ORDER_LIST_REQUEST });

    const userId = getUserId();

    const { data } = await axios.get(`api/orders/user/${userId}`);

    dispatch({
      type: ORDER_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_LIST_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
