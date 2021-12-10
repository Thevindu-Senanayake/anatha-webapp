const Product = require('../models/product');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');

// Create new product  => /api/v1/admin/product/new
exports.newProduct = catchAsyncErrors (async (req, res, next) => {

	const product = await Product.create(req.body)

	res.status(201).json({
		success: true,
		product
	})
})

// Get All products  => /api/v1/products?keyword=apple
exports.getProducts = catchAsyncErrors (async (req, res, next) => {

	const apiFeatures = new APIFeatures(Product.find(), req.query)
		.search()

	const products = await apiFeatures.query;

	res.status(200).json({
		success: true,
		count: products.length,
		products
	})
})

// get Single product details => /api/v1/product/:productId
exports.getSingleProduct = catchAsyncErrors (async (req, res, next) => {

	const product = await Product.findById(req.params.productId);

	if(!product) {
		return next(new ErrorHandler('Product not found', 404));
	}

	res.status(200).json({
		success: true,
		product
	})
})

// Update Product  => /api/v1/admin/product/:productId
exports.updateProduct = catchAsyncErrors (async (req, res, next) => {

	let product = await Product.findById(req.params.productId);

	if(!product) {
		return next(new ErrorHandler('Product not found', 404));
	}

	product = await Product.findByIdAndUpdate(req.params.productId, req.body, {
		new: true,
		runValidators: true
	});

	res.status(200).json({
		success: true,
		product
	})
})

// Delete Product  => /api/v1/admin/product/:productId
exports.deleteProduct = catchAsyncErrors (async (req, res, next) => {

	const product = await Product.findById(req.params.productId);

	if(!product) {
		return next(new ErrorHandler('Product not found', 404));
	}

	await product.deleteOne();

	res.status(200).json({
		success: true,
		message: 'Product is deleted'
	})
})