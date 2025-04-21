import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const [showPopup, setShowPopup] = useState(false);

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    setShowPopup(true); // Show the popup instead of navigating
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="container mx-auto mt-10 px-6 relative">
      {cartItems.length === 0 ? (
        <div className="text-center text-lg">
          Your cart is empty.{" "}
          <Link to="/shop" className="text-pink-500 hover:underline">
            Go to Shop
          </Link>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Cart Items */}
          <div className="w-full md:w-3/4">
            <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center bg-gray-900 p-4 rounded-lg mb-4 shadow-md"
              >
                <div className="w-[5rem] h-[5rem]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>

                <div className="flex-1 ml-4">
                  <Link
                    to={`/product/${item._id}`}
                    className="text-lg font-semibold text-pink-400 hover:underline"
                  >
                    {item.name}
                  </Link>
                  <div className="text-sm text-gray-300 mt-1">{item.brand}</div>
                  <div className="text-base font-bold mt-2">${item.price}</div>
                </div>

                <div className="w-24">
                  <select
                    className="w-full p-1 border rounded text-white bg-gray-800 focus:outline-none"
                    value={item.qty}
                    onChange={(e) =>
                      addToCartHandler(item, Number(e.target.value))
                    }
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="ml-4">
                  <button
                    className="text-red-500 hover:text-red-400"
                    onClick={() => removeFromCartHandler(item._id)}
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Box */}
          <div className="w-full md:w-1/4">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <p className="text-sm mb-2 text-gray-300">
                Total Items:{" "}
                <span className="text-white font-bold">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              </p>
              <p className="text-lg font-bold mb-6">
                Total: $
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}
              </p>
              <button
                onClick={checkoutHandler}
                className="bg-pink-500 w-full py-2 text-white rounded-full font-semibold hover:bg-pink-600 transition-all duration-200"
                disabled={cartItems.length === 0}
              >
                Proceed To Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coming Soon Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg text-center max-w-sm w-full shadow-xl">
            <h2 className="text-xl font-bold mb-2 text-white">Coming Soon</h2>
            <p className="text-white mb-4">
              The checkout feature is not available yet.
            </p>
            <button
              onClick={closePopup}
              className="bg-pink-500 px-4 py-2 text-white rounded-full hover:bg-pink-600"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
