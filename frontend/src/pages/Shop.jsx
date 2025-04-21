import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        // Filter products based on both checked categories and price filter
        const filteredProducts = filteredProductsQuery.data.filter(
          (product) => {
            // Check if the product price includes the entered price filter value
            return (
              product.price.toString().includes(priceFilter) ||
              product.price === parseInt(priceFilter, 10)
            );
          }
        );

        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  // Add "All Brands" option to uniqueBrands
  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    // Update the price filter state when the user types in the input filed
    setPriceFilter(e.target.value);
  };

  const toggleMobileFilters = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        {/* Mobile filter toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={toggleMobileFilters}
            className="flex items-center justify-center w-full bg-pink-600 text-white py-3 rounded-lg shadow-md hover:bg-pink-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            {isMobileFilterOpen ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters sidebar */}
          <div className={`md:w-64 md:block ${isMobileFilterOpen ? 'block' : 'hidden'}`}>
            <div className="bg-[#1a1a24] rounded-xl shadow-lg overflow-hidden border border-gray-800">
              {/* Categories section */}
              <div className="border-b border-gray-700">
                <h2 className="text-lg font-semibold bg-pink-600 text-white py-3 px-4">
                  Filter by Categories
                </h2>
                <div className="p-4 space-y-3">
                  {categoriesQuery.isLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="w-6 h-6 border-2 border-pink-600 rounded-full animate-spin border-t-transparent"></div>
                    </div>
                  ) : (
                    categories?.map((c) => (
                      <div key={c._id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`category-${c._id}`}
                          onChange={(e) => handleCheck(e.target.checked, c._id)}
                          className="w-5 h-5 text-pink-600 bg-gray-700 border-gray-600 rounded focus:ring-pink-500"
                        />
                        <label
                          htmlFor={`category-${c._id}`}
                          className="ml-3 text-gray-200 text-sm font-medium cursor-pointer hover:text-pink-400"
                        >
                          {c.name}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Brands section */}
              <div className="border-b border-gray-700">
                <h2 className="text-lg font-semibold bg-pink-600 text-white py-3 px-4">
                  Filter by Brands
                </h2>
                <div className="p-4 space-y-3">
                  {filteredProductsQuery.isLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="w-6 h-6 border-2 border-pink-600 rounded-full animate-spin border-t-transparent"></div>
                    </div>
                  ) : (
                    uniqueBrands?.map((brand) => (
                      <div key={brand} className="flex items-center">
                        <input
                          type="radio"
                          id={`brand-${brand}`}
                          name="brand"
                          onChange={() => handleBrandClick(brand)}
                          className="w-5 h-5 text-pink-600 bg-gray-700 border-gray-600 rounded-full focus:ring-pink-500"
                        />
                        <label
                          htmlFor={`brand-${brand}`}
                          className="ml-3 text-gray-200 text-sm font-medium cursor-pointer hover:text-pink-400"
                        >
                          {brand}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Price filter section */}
              <div className="border-b border-gray-700">
                <h2 className="text-lg font-semibold bg-pink-600 text-white py-3 px-4">
                  Filter by Price
                </h2>
                <div className="p-4">
                  <input
                    type="text"
                    placeholder="Enter Price"
                    value={priceFilter}
                    onChange={handlePriceChange}
                    className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Reset button */}
              <div className="p-4">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center border border-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Products grid */}
          <div className="flex-1">
            <div className="bg-[#1a1a24] rounded-xl shadow-lg p-6 mb-6 border border-gray-800">
              <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center">
                <span className="mr-3">Products</span>
                <span className="bg-pink-600 text-white text-sm py-1 px-3 rounded-full">
                  {products?.length || 0}
                </span>
              </h2>

              {products.length === 0 ? (
                <div className="flex justify-center items-center min-h-64">
                  <Loader />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products?.map((p) => (
                    <div key={p._id} className="transition-transform hover:scale-105 duration-200">
                      <ProductCard p={p} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;