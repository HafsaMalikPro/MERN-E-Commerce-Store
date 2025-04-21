import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  return (
    <div className="h-full flex flex-col bg-[#1a1a24] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
      <div className="h-52 overflow-hidden relative">
        <Link to={`/product/${p._id}`}>
          <img
            src={p.image}
            alt={p.name}
            className="w-full h-full object-cover"
          />
          {/* Brand badge */}
          <span className="absolute bottom-3 right-3 bg-pink-100 text-pink-800 text-xs font-bold px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
            {p?.brand}
          </span>
        </Link>
        <div className="absolute top-2 left-2">
          <HeartIcon product={p} />
        </div>
      </div>
      
      {/* Card Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h5 className="text-lg font-semibold text-white line-clamp-1">{p?.name}</h5>
          <p className="text-pink-500 font-bold">
            {p?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {p?.description?.substring(0, 60)} ...
        </p>
        
        <div className="mt-auto flex justify-between items-center">
          <Link
            to={`/product/${p._id}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors focus:ring-4 focus:outline-none focus:ring-pink-300"
          >
            Read More
            <svg
              className="w-3.5 h-3.5 ml-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>

          <button
            className="p-2 bg-gray-800 hover:bg-gray-700 transition-colors rounded-full flex items-center justify-center"
            onClick={() => addToCartHandler(p, 1)}
          >
            <AiOutlineShoppingCart size={25} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;