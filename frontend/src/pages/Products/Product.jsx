import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div className="w-[30rem] h-[35rem] ml-[2rem] p-3 relative  rounded shadow">
      <div className="relative w-full h-[20rem] overflow-hidden rounded">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover rounded"
        />
        <HeartIcon product={product} />
      </div>

      <div className="p-4 flex flex-col justify-between h-[13rem]">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center">
            <div className="text-lg font-medium">{product.name}</div>
            <span className="bg-pink-100 text-pink-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
              $ {product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default Product;
