

import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error loading products
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="w-full">
          <div className="text-2xl font-bold h-12 mb-6 border-b border-gray-800 pb-2">
            All Products ({products.length})
          </div>
          <div className="flex flex-wrap justify-around items-center gap-6">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/admin/product/update/${product._id}`}
                className="block mb-4 overflow-hidden border border-gray-800 rounded-lg hover:border-pink-600 transition-all duration-300 w-full md:w-[45%] lg:w-[30%]"
              >
                <div className="flex flex-col bg-gray-900">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-[15rem] object-cover"
                  />
                  <div className="p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <h5 className="text-xl font-semibold">
                          {product?.name}
                        </h5>
                        <p className="text-gray-400 text-xs">
                          {moment(product.createdAt).format("MMMM Do YYYY")}
                        </p>
                      </div>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {product?.description?.substring(0, 160)}...
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <Link
                        to={`/admin/product/update/${product._id}`}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800 transition-all duration-300"
                      >
                        Update Product
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
                      <p className="text-lg font-semibold text-pink-400">$ {product?.price}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="md:w-1/4 p-3 mt-2">
            <AdminMenu/>
         </div>
      </div>
    </>
  );
};

export default AllProducts;