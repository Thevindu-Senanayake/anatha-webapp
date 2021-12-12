const mongoose = require('mongoose');

const productScema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please enter product name'],
		trim: true,
		maxLength: [100, 'Product name cannot be longer than 100 characters']
	},
	price: {
		type: Number,
		required: [true, 'Please enter price for product'],
		maxLength: [7, 'Product price cannot be longer than 7 characters'],
		default: 0.00
	},
	description: {
		type: String,
		required: [true, 'Please enter product description'],
	},
	ratings: {
		type: Number,
		default: 0
	},
	images: [
		{
			public_id: {
				type: String,
				require: true
			},
			url: {
				type: String,
				require: true
			},
		}
	],
	category: {
		type: String,
		require: [true, 'Please select category for this product'],
		enum: {
			values: [
				'books',
				'pencils',
				'cuters',
				'pastles',
				'Electronics',
				'Headphones',
				'Accessories',
				'Cameras',
				'Laptops',
				'Food'
			],
			message: 'Please select correct category for product'
		}
	},
	stock: {
		type: Number,
		required: [true, 'Please enter product stock'],
		maxLength: [5, 'Product stock cannot be longer than 5 characters']
	},
	numOfReviews: {
		type: String,
		default: 0
	},
	reviews: [
		{
			name: {
				type: String,
				required: true
			},
			rating: {
				type: String,
				required: true
			},
			comment: {
				type: String,
				required: true
			}
		}
	],
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Product', productScema);