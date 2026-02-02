import { X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [discountProducts, setDiscountProducts] = useState([]);
  const [bestSellerProducts, setBestSellerProducts] = useState([]);
  const [toastMsg, setToastMsg] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchRef = useRef(null);

  useEffect(() => {
    loadFeaturedProducts();
    loadDiscountProducts();
    loadBestSellerProducts();
  }, []);

  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => setToastMsg(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadSearchResults = async () => {
      if (searchInput.trim() === "") {
        setSearchResults([]);
        return;
      }
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchInput)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.slice(0, 5)); // Limit to 5 results for dropdown
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error('Failed to load search results:', err);
        setSearchResults([]);
      }
    };
    loadSearchResults();
  }, [searchInput]);

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products?featured=true&limit=8');
      let data = [];
      if (res.ok) {
        data = await res.json();
      }
      if (data.length === 0) {
        const fallbackRes = await fetch('/api/products?limit=8');
        if (fallbackRes.ok) {
          data = (await fallbackRes.json()).slice(0, 8);
        }
      }
      setFeaturedProducts(data);
    } catch (err) {
      console.error('Failed to load featured products:', err);
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadDiscountProducts = async () => {
    try {
      const res = await fetch('/api/products?discount=true&limit=4');
      if (res.ok) {
        const data = await res.json();
        setDiscountProducts(data);
      } else {
        setDiscountProducts([]);
      }
    } catch {
      setDiscountProducts([]);
    }
  };

  const loadBestSellerProducts = async () => {
    try {
      const res = await fetch('/api/products?bestSeller=true&limit=4');
      if (res.ok) {
        const data = await res.json();
        setBestSellerProducts(data);
      } else {
        setBestSellerProducts([]);
      }
    } catch {
      setBestSellerProducts([]);
    }
  };

  const handleAddToCart = async (product, productName) => {
    const userId = localStorage.getItem("userEmail");
    if (!userId) {
      setToastMsg("Please log in to add items to cart.");
      setTimeout(() => {
        setToastMsg("Redirecting to login...");
        window.location.href = "/login"; // Redirect to login page
      }, 1000);
      return;
    }

    try {
      const res = await fetch(
        `/api/cart/add?userId=${encodeURIComponent(userId)}&productId=${product.id || product._id}&quantity=1&grams=${product.grams || 1}&finalPrice=${product.price}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error("Add to cart failed.");
      setToastMsg(`"${productName}" added to cart successfully!`);
    } catch (err) {
      console.error(err);
      setToastMsg("Failed to add to cart. Please try again.");
    }
  };

  const viewProduct = (id) => {
    window.location.href = `/product/${id}`;
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setSearchOpen(false);
    window.location.href = `/collections?search=${encodeURIComponent(searchInput)}`;
  };

  const handleSearchClick = () => {
    window.location.href = `/collections?focus=true`;
  };

  const getBadgeColor = (badge) => {
    switch (badge?.toLowerCase()) {
      case 'bestseller': return 'bg-amber-500 text-white';
      case 'new': return 'bg-green-500 text-white';
      case 'trending': return 'bg-purple-500 text-white';
      case 'limited': return 'bg-red-500 text-white';
      case 'heritage': return 'bg-orange-500 text-white';
      case 'modern': return 'bg-blue-500 text-white';
      case 'exclusive': return 'bg-pink-500 text-white';
      case 'vintage': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        handleSearchSubmit={handleSearchSubmit}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        searchResults={searchResults}
        viewProduct={viewProduct}
        handleSearchClick={handleSearchClick}
        setSearchOpen={setSearchOpen}
        searchOpen={searchOpen}
      />

      {/* Instagram banner */}
      <div className="bg-amber-50 border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-800">
          <span className="font-medium tracking-wide">
            Dangly Dreams · Handmade jewelry from our Instagram shop
          </span>
          <a
            href="https://www.instagram.com/dangly_dreams/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center px-4 py-1.5 rounded-full border border-amber-400 text-amber-700 hover:bg-amber-100 transition-colors"
          >
            Follow @dangly_dreams
          </a>
        </div>
      </div>

      {/* Featured Products Section */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-4 tracking-wide">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Our most cherished pieces, handpicked for their exceptional beauty and craftsmanship.
              Each item represents the pinnacle of jewelry artistry.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.slice(0, 8).map((product, index) => (
                  <div key={product.id || product._id} className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                    <div className="relative overflow-hidden">
                      <img
                        src={product.image || product.imageUrl || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                        alt={product.name}
                        className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {(product.badge || product.featured || product.bestSeller || (product.discountPercentage > 0)) && (
                        <div className="absolute top-4 left-4 flex flex-wrap gap-1">
                          {product.badge && (
                            <span className={`px-3 py-1 text-xs font-medium tracking-wider ${getBadgeColor(product.badge)}`}>
                              {product.badge.toUpperCase()}
                            </span>
                          )}
                          {product.featured && !product.badge && <span className="px-3 py-1 text-xs font-medium bg-amber-500 text-white">FEATURED</span>}
                          {product.bestSeller && <span className="px-3 py-1 text-xs font-medium bg-green-500 text-white">BEST SELLER</span>}
                          {product.discountPercentage > 0 && <span className="px-3 py-1 text-xs font-medium bg-red-500 text-white">{product.discountPercentage}% OFF</span>}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => handleAddToCart(product, product.name)}
                          className="bg-white text-gray-900 px-6 py-2 text-sm font-medium tracking-wider hover:bg-gray-100 transition-colors duration-200"
                        >
                          ADD TO CART
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-xs text-gray-500 tracking-wider mb-2">{product.category}</p>
                      <h3
                        className="text-lg font-light mb-3 group-hover:text-amber-600 transition-colors cursor-pointer"
                        onClick={() => viewProduct(product.id || product._id)}
                      >
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500">Weight: {product.weight}g</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl font-medium text-gray-900">€{product.price?.toLocaleString()} <span className="text-xs ml-2 text-gray-500">per gram</span></span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through">€{product.originalPrice.toLocaleString()}</span>
                          )}
                        </div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="bg-red-100 text-red-600 px-2 py-1 text-xs font-medium rounded">
                            SAVE €{(product.originalPrice - product.price).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <button
                  onClick={() => window.location.href = '/collections'}
                  className="border-2 border-gray-900 text-gray-900 px-8 py-3 text-sm tracking-wider hover:bg-gray-900 hover:text-white transition-all duration-300"
                >
                  VIEW ALL PRODUCTS
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Discount Products Section */}
      {discountProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-light mb-8 tracking-wide">Special Offers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {discountProducts.map((product) => (
              <div key={product.id || product._id} className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all">
                <div className="relative overflow-hidden">
                  <img
                    src={product.image || product.imageUrl || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform"
                  />
                  {product.discountPercentage > 0 && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-medium">{product.discountPercentage}% OFF</span>
                  )}
                  <button
                    onClick={() => handleAddToCart(product, product.name)}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white px-4 py-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ADD TO CART
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-500">{product.category}</p>
                  <h3 className="font-medium text-gray-900 cursor-pointer hover:text-amber-600" onClick={() => viewProduct(product.id || product._id)}>{product.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-amber-600 font-medium">€{product.price?.toLocaleString()}</span>
                    {product.discountPercentage > 0 && (
                      <span className="text-gray-400 text-sm line-through">
                        €{((product.price * 100) / (100 - product.discountPercentage)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Best-Selling Products Section */}
      {bestSellerProducts.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-light mb-8 tracking-wide">Best Sellers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellerProducts.map((product) => (
                <div key={product.id || product._id} className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image || product.imageUrl || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-xs font-medium">BEST SELLER</span>
                    <button
                      onClick={() => handleAddToCart(product, product.name)}
                      className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white px-4 py-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ADD TO CART
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500">{product.category}</p>
                    <h3 className="font-medium text-gray-900 cursor-pointer hover:text-amber-600" onClick={() => viewProduct(product.id || product._id)}>{product.name}</h3>
                    <span className="text-amber-600 font-medium">€{product.price?.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 bg-white shadow-2xl border border-green-200 text-green-800 px-6 py-4 rounded-2xl z-50 animate-slide-in-right max-w-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-medium">{toastMsg}</p>
            <button
              onClick={() => setToastMsg("")}
              className="ml-2 flex-shrink-0 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <X className="w-3 h-3 text-gray-600" />
            </button>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default Home;