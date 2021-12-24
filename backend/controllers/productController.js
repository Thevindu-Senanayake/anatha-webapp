const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");

// Create new product  => /api/v1/admin/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
	req.body.user = req.user.id;

	const product = await Product.create(req.body);

	res.status(201).json({
		success: true,
		product,
	});
});

// Get All products  => /api/v1/products?keyword=apple
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
	const resPerPage = 8;
	const productCount = await Product.countDocuments();

	const apiFeatures = new APIFeatures(Product.find(), req.query)
		.search()
		.filter()
		.pagination(resPerPage);

	const products = await apiFeatures.query;

	setTimeout(() => {
		res.status(200).json({
			success: true,
			productCount,
			products,
		});
	}, 2000);
});

// get Single product details => /api/v1/product/:productId
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
	const product = await Product.findById(req.params.productId);

	if (!product) {
		return next(new ErrorHandler("Product not found", 404));
	}

	res.status(200).json({
		success: true,
		product,
	});
});

// Update Product  => /api/v1/admin/product/:productId
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
	let product = await Product.findById(req.params.productId);

	if (!product) {
		return next(new ErrorHandler("Product not found", 404));
	}

	product = await Product.findByIdAndUpdate(req.params.productId, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		product,
	});
});

// Delete Product  => /api/v1/admin/product/:productId
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
	const product = await Product.findById(req.params.productId);

	if (!product) {
		return next(new ErrorHandler("Product not found", 404));
	}

	await product.deleteOne();

	res.status(200).json({
		success: true,
		message: "Product is deleted",
	});
});

// Review Functions

// Create new review		=> /api/v1/review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
	const { rating, comment, productId } = req.body;

	const review = {
		user: req.user._id,
		name: req.user.name,
		rating: Number(rating),
		comment,
	};

	const product = await Product.findById(productId);

	const isReviewed = product.reviews.find(
		(r) => r.user.toString() === req.user._id.toString()
	);

	if (isReviewed) {
		product.reviews.forEach((review) => {
			if (review.user.toString() === req.user._id.toString()) {
				review.comment = comment;
				review.rating = rating;
			}
		});
	} else {
		product.reviews.push(review);
		product.numOfReviews = product.reviews.length;
	}

	product.ratings =
		product.reviews.reduce((acc, item) => item.rating + acc, 0) /
		product.reviews.length;

	await product.save({ validateBeforeSave: false });

	res.status(200).json({
		success: true,
	});
});

// Get All Reviews of a Product	=> /api/v1/reviews
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
	const product = await Product.findById(req.query.id);

	res.status(200).json({
		success: true,
		reviews: product.reviews,
	});
});

// Delete a Review	=> /api/v1/reviews
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
	const product = await Product.findById(req.query.productId);

	const reviews = product.reviews.filter(
		(review) => review._id.toString() !== req.query.id.toString()
	);

	const numOfReviews = reviews.length;

	const ratings =
		product.reviews.reduce((acc, item) => item.rating + acc, 0) /
		reviews.length;

	await Product.findByIdAndUpdate(
		req.query.productId,
		{
			reviews,
			ratings,
			numOfReviews,
		},
		{
			new: true,
			validateBeforeSave: false,
			useFindAndModify: false,
		}
	);

	res.status(200).json({
		success: true,
	});
});
