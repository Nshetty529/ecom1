const Product = require("../models/Product");

// Fetch all products
const getProducts = async (req, res) => {
  try {
    console.log("getProducts controller function called");

    console.log("Request query parameters:", req.query);

    const {
      search,
      category,
      manufacturer,
      type,
      shipping,
      minPrice,
      maxPrice,
      minRating,
      sort = "price_asc",
      page = 1,
      limit = 10,
    } = req.query;

    // Build query
    let query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { shortDescription: { $regex: search.trim(), $options: "i" } },
      ];
    }

    // Category filter
    if (category) {
      const categories = Array.isArray(category) ? category : [category];
      query.categories = { $in: categories };
    }

    // Manufacturer filter
    if (manufacturer) {
      query.manufacturer = { $regex: manufacturer.trim(), $options: "i" };
    }

    // Type filter
    if (type) {
      query.type = { $regex: type.trim(), $options: "i" };
    }

    // Shipping filter
    if (shipping) {
      if (shipping.trim() === "free") {
        query.shipping = "Free shipping";
      } else if (shipping.trim() === "paid") {
        query.$and = [
          { shipping: { $ne: "Free shipping" } },
          { shipping: { $ne: null } },
        ];
      }
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.salePrice = {};
      if (minPrice) query.salePrice.$gte = Number(minPrice);
      if (maxPrice) query.salePrice.$lte = Number(maxPrice);
    }

    // Customer rating filter
    if (minRating) {
      query.customerReviewCount = { $gte: Number(minRating) };
    }

    // Build sort options
    let sortOptions = {};
    const cleanSort = sort.trim();

    switch (cleanSort) {
      case "price_asc":
        sortOptions = { salePrice: 1 };
        break;
      case "price_desc":
        sortOptions = { salePrice: -1 };
        break;
      case "name_asc":
        sortOptions = { name: 1 };
        break;
      case "name_desc":
        sortOptions = { name: -1 };
        break;
      case "rating_desc":
        sortOptions = { customerReviewCount: -1 };
        break;
      case "bestseller":
        sortOptions = { bestSellingRank: 1 };
        break;
      default:
        sortOptions = { salePrice: 1 };
    }

    // Debugging logs
    console.log("Final query:", JSON.stringify(query, null, 2));
    console.log("Sort options:", sortOptions);

    // Execute query with pagination
    const products = await Product.find(query)
      .collation({ locale: "en_US", numericOrdering: true })
      .sort(sortOptions)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    console.log("Number of products fetched:", products.length); // Log the number of products fetched

    // Get total count for pagination
    const total = await Product.countDocuments(query);
    console.log("Total products matching query:", total); // Log the total count of products

    // Get available filter options
    const availableFilters = {
      manufacturers: await Product.distinct("manufacturer"),
      types: await Product.distinct("type"),
      categories: await Product.distinct("categories"),
      priceRanges: [
        { label: "Under $25", min: 0, max: 25 },
        { label: "$25 to $50", min: 25, max: 50 },
        { label: "$50 to $100", min: 50, max: 100 },
        { label: "$100 & Above", min: 100, max: null },
      ],
    };

    // Return response
    res.status(200).json({
      success: true,
      data: {
        products,
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalProducts: total,
        productsPerPage: Number(limit),
      },
      filters: {
        search: search || null,
        category: category || null,
        manufacturer: manufacturer || null,
        type: type || null,
        shipping: shipping || null,
        priceRange: {
          min: minPrice || null,
          max: maxPrice || null,
        },
        minRating: minRating || null,
        sort: cleanSort,
      },
      availableFilters,
      appliedSort: sortOptions,
    });
  } catch (error) {
    console.error("Error fetching products:", error.message); // Log the error message
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};


const getProductById = async (req, res) => {
  try {
    console.log("GET /api/products/:id called"); // Log when the route is hit
    const productId = req.params.id;
    console.log("Product ID:", productId); // Log the product ID

    const product = await Product.findById(productId);
    if (!product) {
      console.log("Product not found");
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error in getProductById:", error.message); // Log any errors
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};


// Add a new product
const createProduct = async (req, res) => {
  const {
    name,
    shortDescription,
    bestSellingRank,
    thumbnailImage,
    salePrice,
    manufacturer,
    url,
    type,
    image,
    customerReviewCount,
    shipping,
    salePrice_range,
    categories,
  } = req.body;

  try {
    const newProduct = await Product.create({
      name,
      shortDescription,
      bestSellingRank,
      thumbnailImage,
      salePrice,
      manufacturer,
      url,
      type,
      image,
      customerReviewCount,
      shipping,
      salePrice_range,
      categories,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Update an existing product
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, // Find product by _id
      req.body, // Update fields from request body
      { new: true } // Return the updated document
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(updatedProduct); // Send updated product as response
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id); // Find and delete by _id
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" }); // If product doesn't exist
    }
    res.status(200).json({ message: "Product deleted successfully" }); // Success response
  } catch (error) {
    console.error("Error deleting product:", error.message); // Log error
    res.status(500).json({ message: error.message }); // Internal server error
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
