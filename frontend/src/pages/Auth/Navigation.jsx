import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{ zIndex: 9999 }}
      className={`${
        showSidebar ? "hidden" : "flex"
      } xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 text-white bg-gradient-to-b from-black to-gray-800 w-[4%] hover:w-[15%] h-[100vh] fixed shadow-lg`}
      id="navigation-container"
    >
      <div className="flex flex-col justify-center space-y-4">
        <Link
          to="/"
          className="flex items-center transition-transform transform hover:translate-x-2 hover:text-pink-400 group"
        >
          <div className="">
            <AiOutlineHome className="mt-[3rem]" size={26} />
          </div>
          <span className="hidden nav-item-name mt-[3rem] ml-3 font-semibold tracking-wide">HOME</span>
        </Link>

        <Link
          to="/shop"
          className="flex items-center transition-transform transform hover:translate-x-2 hover:text-pink-400 group"
        >
          <div className="">
            <AiOutlineShopping className="mt-[3rem]" size={26} />
          </div>
          <span className="hidden nav-item-name mt-[3rem] ml-3 font-semibold tracking-wide">SHOP</span>
        </Link>

        <Link to="/cart" className="flex relative group hover:text-pink-400">
          <div className="flex items-center transition-transform transform hover:translate-x-2">
            <div className="">
              <AiOutlineShoppingCart className="mt-[3rem]" size={26} />
            </div>
            <span className="hidden nav-item-name mt-[3rem] ml-3 font-semibold tracking-wide">CART</span>

          <div className="mt-[3rem] ml-2">
            {cartItems.length > 0 && (
              <span>
                <span className="px-2 py-1 text-xs text-white bg-pink-500 rounded-full shadow-md">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              </span>
            )}
          </div>
          </div>

        </Link>

        <Link to="/favorite" className="flex relative group hover:text-pink-400">
          <div className="flex items-center transition-transform transform hover:translate-x-2">
            <div className="">
              <FaHeart className="mt-[3rem]" size={20} />
            </div>
            <span className="hidden nav-item-name mt-[3rem] ml-3 font-semibold tracking-wide">
              FAVORITES
            </span>
            <div className="mt-[3rem] ml-2">
              <FavoritesCount />
            </div>
          </div>
        </Link>
      </div>

      <div className="relative mb-6">
        <button
          onClick={toggleDropdown}
          className="flex items-center focus:outline-none hover:text-pink-400 transition-colors duration-300 w-full"
        >
          {userInfo ? (
            <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800 transition-all duration-300 w-full">
              <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center">
                <span className="font-bold text-sm">{userInfo.username?.charAt(0).toUpperCase()}</span>
              </div>
              <span className="hidden nav-item-name text-sm font-medium">{userInfo.username}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`hidden nav-item-name h-4 w-4 transition-transform duration-300 ${
                  dropdownOpen ? "transform rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                />
              </svg>
            </div>
          ) : (
            <></>
          )}
        </button>

        {dropdownOpen && userInfo && (
          <ul
            className={`absolute right-0 mt-2 mr-14 space-y-1 bg-gray-800 text-white rounded-lg shadow-xl border border-gray-700 overflow-hidden ${
              !userInfo.isAdmin ? "-top-20" : "-top-80"
            }`}
          >
            {userInfo.isAdmin && (
              <>
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2 hover:bg-pink-500 transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/productlist"
                    className="block px-4 py-2 hover:bg-pink-500 transition-colors duration-200"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/categorylist"
                    className="block px-4 py-2 hover:bg-pink-500 transition-colors duration-200"
                  >
                    Category
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/orderlist"
                    className="block px-4 py-2 hover:bg-pink-500 transition-colors duration-200"
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/userlist"
                    className="block px-4 py-2 hover:bg-pink-500 transition-colors duration-200"
                  >
                    Users
                  </Link>
                </li>
              </>
            )}

            <li>
              <Link to="/profile" className="block px-4 py-2 hover:bg-pink-500 transition-colors duration-200">
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={logoutHandler}
                className="block w-full text-left px-4 py-2 hover:bg-pink-500 transition-colors duration-200"
              >
                Logout
              </button>
            </li>
          </ul>
        )}
        {!userInfo && (
          <ul className="space-y-4">
            <li>
              <Link
                to="/login"
                className="flex items-center transition-transform transform hover:translate-x-2 hover:text-pink-400 group"
              >
                <div className="p-2 rounded-full bg-gray-800 group-hover:bg-pink-500 transition-all duration-300">
                  <AiOutlineLogin size={26} />
                </div>
                <span className="hidden nav-item-name ml-3 font-semibold tracking-wide">LOGIN</span>
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="flex items-center transition-transform transform hover:translate-x-2 hover:text-pink-400 group"
              >
                <div className="p-2 rounded-full bg-gray-800 group-hover:bg-pink-500 transition-all duration-300">
                  <AiOutlineUserAdd size={26} />
                </div>
                <span className="hidden nav-item-name ml-3 font-semibold tracking-wide">REGISTER</span>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navigation;