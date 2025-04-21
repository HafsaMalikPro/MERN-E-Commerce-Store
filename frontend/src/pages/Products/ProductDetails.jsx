import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
  FaArrowLeft,
  FaShippingFast,
  FaCreditCard,
  FaPercent,
  FaCheckCircle
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

// Add global styles to your CSS
// .text-gradient {
//   background: linear-gradient(to right, #ff79c6, #bd93f9);
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;
// }
// .bg-gradient {
//   background: linear-gradient(to right, #ff79c6, #bd93f9);
// }
// .btn-gradient {
//   background: linear-gradient(to right, #ff79c6, #bd93f9);
//   color: white;
//   border: none;
// }
// .shadow-glow {
//   box-shadow: 0 0 15px rgba(255, 121, 198, 0.4);
// }
// .shadow-glow-sm {
//   box-shadow: 0 0 10px rgba(255, 121, 198, 0.2);
// }

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [fadeIn, setFadeIn] = useState(false);

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  // Set initial image and trigger fade-in animation
  useEffect(() => {
    if (product && product.image) {
      setMainImage(product.image);
      // Trigger animation after a small delay
      setTimeout(() => setFadeIn(true), 100);
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
      setComment("");
      setRating(0);
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    toast.success(`${product.name} added to cart`);
    navigate("/cart");
  };

  // Generate some alternate images for the gallery
  const getGalleryImages = () => {
    if (!product || !product.image) return [];
    
    // This is just for demo - in a real app you'd have actual alternate images
    return [
      product.image,
      product.image,
      product.image
    ];
  };

  // Features list
  const productFeatures = [
    { icon: <FaShippingFast />, text: "Free Shipping" },
    { icon: <FaCreditCard />, text: "Secure Payment" },
    { icon: <FaPercent />, text: "Special Discounts" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Back Button with enhanced styling */}
      <Link
        to="/"
        className="inline-flex items-center text-gray-300 hover:text-pink-500 font-medium mb-8 transition-colors rounded-lg px-4 py-2 hover:bg-gray-900"
      >
        <FaArrowLeft className="mr-2" /> Back to Products
      </Link>

      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <Loader />
        </div>
      ) : error ? (
        <div className="my-8">
          <Message variant="danger">
            {error?.data?.message || error.message}
          </Message>
        </div>
      ) : (
        <div className="space-y-16">
          {/* Product Main Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image Gallery */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="relative bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-800 overflow-hidden">
                <img
                  src={mainImage}
                  alt={product.name}
                  className={`w-full h-auto object-contain rounded-xl transition-opacity duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
                  style={{ minHeight: "400px" }}
                />
                <div className="absolute top-6 right-6 z-10">
                  <HeartIcon product={product} />
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              <div className="flex justify-center space-x-4">
                {getGalleryImages().map((img, index) => (
                  <button 
                    key={index}
                    onClick={() => {
                      setFadeIn(false);
                      setTimeout(() => {
                        setMainImage(img);
                        setFadeIn(true);
                      }, 300);
                    }}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${mainImage === img ? 'border-pink-500 shadow-glow-sm' : 'border-gray-700'}`}
                  >
                    <img src={img} alt={`Product view ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col space-y-8">
              {/* Product Header */}
              <div className="bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-800">
                {product.countInStock > 0 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300 mb-4">
                    <FaCheckCircle className="mr-1" /> In Stock
                  </span>
                )}
                
                <h1 className="text-3xl lg:text-4xl font-bold mb-4">{product.name}</h1>
                
                <div className="flex items-center mb-6">
                  <Ratings value={product.rating} />
                  <span className="ml-2 text-gray-400">
                    {product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'}
                  </span>
                </div>

                <div className="text-4xl font-bold text-gradient mb-6">
                  ${product.price.toFixed(2)}
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed">
                  {product.description}
                </p>

                {/* Product Features */}
                <div className="flex flex-wrap gap-4 mb-6">
                  {productFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-300 bg-gray-800 rounded-full px-4 py-2">
                      <span className="text-pink-500 mr-2">{feature.icon}</span>
                      {feature.text}
                    </div>
                  ))}
                </div>

                {/* Product Meta Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-300">
                      <FaStore className="mr-3 text-pink-500" />
                      <span className="font-medium">Brand:</span>
                      <span className="ml-2">{product.brand}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <FaClock className="mr-3 text-pink-500" />
                      <span className="font-medium">Added:</span>
                      <span className="ml-2">{moment(product.createdAt).fromNow()}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <FaStar className="mr-3 text-pink-500" />
                      <span className="font-medium">Ratings:</span>
                      <span className="ml-2">{product.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center text-gray-300">
                      <FaBox className="mr-3 text-pink-500" />
                      <span className="font-medium">In Stock:</span>
                      <span className="ml-2">{product.countInStock}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <FaShoppingCart className="mr-3 text-pink-500" />
                      <span className="font-medium">Sold:</span>
                      <span className="ml-2">{product.quantity || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add to Cart Section */}
              <div className="bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-800">
                <h3 className="text-xl font-bold mb-4">Purchase Options</h3>
                
                {product.countInStock > 0 ? (
                  <div>
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <div className="w-full sm:w-32">
                        <label className="block text-gray-400 mb-2">Quantity</label>
                        <div className="relative">
                          <select
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 pr-10 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition text-white appearance-none"
                          >
                            {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-full sm:w-auto sm:flex-1">
                        <button
                          onClick={addToCartHandler}
                          className="btn-gradient w-full py-4 px-8 rounded-xl font-bold flex items-center justify-center transition-all duration-300 transform hover:scale-105 hover:shadow-glow"
                        >
                          <FaShoppingCart className="mr-2" /> Add To Cart
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-green-400 text-sm flex items-center">
                      <FaCheckCircle className="mr-2" /> 
                      {product.countInStock > 10 
                        ? 'In stock and ready to ship' 
                        : `Only ${product.countInStock} left in stock - order soon!`}
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-800 text-red-400 py-4 px-6 rounded-xl inline-flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Currently Out of Stock
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div>
            <ProductTabs
              loadingProductReview={loadingProductReview}
              userInfo={userInfo}
              submitHandler={submitHandler}
              rating={rating}
              setRating={setRating}
              comment={comment}
              setComment={setComment}
              product={product}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;