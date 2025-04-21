import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";
import { FaPencilAlt, FaComments, FaBoxOpen } from "react-icons/fa";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);
  const [animateTab, setAnimateTab] = useState(false);

  // Animation effect when changing tabs
  useEffect(() => {
    setAnimateTab(true);
    const timer = setTimeout(() => setAnimateTab(false), 300);
    return () => clearTimeout(timer);
  }, [activeTab]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  // Rating option labels with emojis
  const ratingOptions = [
    { value: "1", label: "Inferior ⭐" },
    { value: "2", label: "Decent ⭐⭐" },
    { value: "3", label: "Great ⭐⭐⭐" },
    { value: "4", label: "Excellent ⭐⭐⭐⭐" },
    { value: "5", label: "Exceptional ⭐⭐⭐⭐⭐" },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Enhanced Tabs Navigation */}
      <section className="lg:w-64">
        <div className="sticky top-8 bg-gray-900 rounded-xl overflow-hidden shadow-xl border border-gray-800">
          <TabButton 
            active={activeTab === 1} 
            onClick={() => handleTabClick(1)}
            label="Write Your Review"
            icon={<FaPencilAlt />}
          />
          <TabButton 
            active={activeTab === 2} 
            onClick={() => handleTabClick(2)}
            label="All Reviews"
            icon={<FaComments />}
            badge={product.reviews.length > 0 ? product.reviews.length : null}
          />
          <TabButton 
            active={activeTab === 3} 
            onClick={() => handleTabClick(3)}
            label="Related Products"
            icon={<FaBoxOpen />}
          />
        </div>
      </section>

      {/* Content Area with Animation */}
      <section className={`flex-1 min-w-0 transition-opacity duration-300 ${animateTab ? 'opacity-0' : 'opacity-100'}`}>
        {/* Write Review Tab */}
        {activeTab === 1 && (
          <div className="bg-gray-900 rounded-xl p-8 shadow-xl border border-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-gradient">Write Your Review</h2>
            {userInfo ? (
              <form onSubmit={submitHandler} className="space-y-6">
                <div className="space-y-3">
                  <label htmlFor="rating" className="block text-lg font-medium text-gray-300">
                    Rating
                  </label>
                  <div className="relative">
                    <select
                      id="rating"
                      required
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 pl-5 pr-10 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition text-white appearance-none"
                    >
                      <option value="">Select Rating</option>
                      {ratingOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                      <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label htmlFor="comment" className="block text-lg font-medium text-gray-300">
                    Your Thoughts
                  </label>
                  <textarea
                    id="comment"
                    rows="5"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition !text-white placeholder-gray-500"
                    placeholder="Share your experience with this product..."
                  ></textarea>
                  <p className="text-gray-400 text-sm">
                    Your review helps other shoppers make better decisions.
                  </p>
                </div>
                
                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="btn-gradient w-full sm:w-auto py-4 px-8 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingProductReview ? (
                    <span className="inline-flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </form>
            ) : (
              <div className="bg-gray-800 p-8 rounded-xl text-center border border-gray-700">
                <svg className="mx-auto h-16 w-16 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-xl mb-4">Sign in to write a review</p>
                <Link 
                  to="/login" 
                  className="inline-block bg-pink-600 hover:bg-pink-700 text-white py-3 px-6 rounded-xl font-medium transition-colors"
                >
                  Sign In Now
                </Link>
              </div>
            )}
          </div>
        )}

        {/* All Reviews Tab */}
        {activeTab === 2 && (
          <div className="bg-gray-900 rounded-xl p-8 shadow-xl border border-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-gradient">Customer Reviews</h2>
            
            {product.reviews.length === 0 ? (
              <div className="bg-gray-800 p-8 rounded-xl text-center border border-gray-700">
                <svg className="mx-auto h-16 w-16 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <p className="text-xl mb-2">No Reviews Yet</p>
                <p className="text-gray-400">Be the first to share your experience with this product!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-gray-800 p-6 rounded-xl border border-gray-700 transition duration-300 hover:border-pink-500 hover:shadow-glow-sm"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {review.name.charAt(0)}
                        </div>
                        <span className="font-bold text-lg text-white ml-3">{review.name}</span>
                      </div>
                      <span className="text-gray-400 text-sm bg-gray-700 px-3 py-1 rounded-full">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <Ratings value={review.rating} />
                      <span className="ml-2 text-pink-500 font-medium">
                        {ratingOptions.find(option => option.value === review.rating.toString())?.label.split(' ')[0]}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 bg-gray-900 p-4 rounded-lg">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 3 && (
          <div className="bg-gray-900 rounded-xl p-8 shadow-xl border border-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-gradient">Related Products</h2>
            
            {!data ? (
              <Loader />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((product) => (
                  <div 
                    key={product._id} 
                    className="transition-all duration-300 transform hover:scale-105 hover:shadow-glow-sm"
                  >
                    <div className="border border-gray-800 rounded-xl overflow-hidden">
                      <SmallProduct product={product} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

const TabButton = ({ active, onClick, label, icon, badge = null }) => (
  <button
    onClick={onClick}
    className={`px-6 py-5 text-left transition-all duration-300 w-full flex items-center ${
      active 
        ? "bg-gradient-to-r from-pink-700 to-pink-500 text-white font-bold" 
        : "text-gray-300 hover:bg-gray-800"
    }`}
  >
    <span className={`mr-3 ${active ? 'text-white' : 'text-pink-500'}`}>
      {icon}
    </span>
    {label}
    {badge !== null && (
      <span className="ml-auto bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-full">
        {badge}
      </span>
    )}
  </button>
);

export default ProductTabs;