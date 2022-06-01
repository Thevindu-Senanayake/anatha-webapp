import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import {
	updateProduct,
	getProductDetails,
	clearErrors,
} from "../../actions/productActions";
import { UPDATE_PRODUCT_RESET } from "../../constants/productConstants";

const UpdateProduct = () => {
	const alert = useAlert();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const params = useParams();

	const [name, setName] = useState("");
	const [price, setPrice] = useState(0);
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("");
	const [stock, setStock] = useState(0);
	const [seller, setSeller] = useState("");
	const [images, setImages] = useState([]);
	const [oldImages, setOldImages] = useState([]);
	const [imagesPreview, setImagesPreview] = useState([]);

	const categories = [
		"Electronics",
		"Cameras",
		"Laptops",
		"Accessories",
		"Headphones",
		"Food",
		"Books",
		"Clothes/Shoes",
		"Beauty/Health",
		"Sports",
		"Outdoor",
		"Home",
	];

	const { error, product } = useSelector((state) => state.productDetails);
	const {
		loading,
		error: updateError,
		success,
		isUpdated,
	} = useSelector((state) => state.deleteProduct);

	const productId = params.id;

	useEffect(() => {
		if (product && product._id !== productId) {
			dispatch(getProductDetails(productId));
		} else {
			setName(product.name);
			setPrice(product.price);
			setDescription(product.description);
			setCategory(product.category);
			setStock(product.stock);
			setSeller(product.seller);
			setOldImages(product.images);
		}

		if (error) {
			alert.error(error);
			dispatch(clearErrors());
		}

		if (updateError) {
			alert.error(updateError);
			dispatch(clearErrors());
		}

		if (isUpdated) {
			navigate("/admin/products");
			alert.success("Product Updated Successfully");
			dispatch({ type: UPDATE_PRODUCT_RESET });
		}
	}, [
		dispatch,
		alert,
		error,
		navigate,
		isUpdated,
		updateError,
		product,
		productId,
	]);

	const submitHandler = (e) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append("name", name);
		formData.append("price", price);
		formData.append("description", description);
		formData.append("category", category);
		formData.append("stock", stock);
		formData.append("seller", seller);

		images.forEach((image) => {
			formData.append("images", image);
		});

		dispatch(updateProduct(product._id, formData));
	};

	const onChange = (e) => {
		const files = Array.from(e.target.files);

		setImagesPreview([]);
		setImages([]);
		setOldImages([]);

		files.forEach((file) => {
			const reader = new FileReader();

			reader.onload = () => {
				if (reader.readyState === 2) {
					setImagesPreview((oldArray) => [...oldArray, reader.result]);
					setImages((oldArray) => [...oldArray, reader.result]);
				}
			};

			reader.readAsDataURL(file);
		});
	};

	return (
		<Fragment>
			<MetaData title={"Update Product"} />
			<div className="row">
				<div className="col-12 col-md-2">
					<Sidebar />
				</div>

				<div className="col-12 col-md-10">
					<Fragment>
						<div className="wrapper my-5">
							<form
								className="shadow-lg"
								onSubmit={submitHandler}
								encType="multipart/form-data"
							>
								<h1 className="mb-4">Update Product</h1>

								<div className="form-group">
									<label htmlFor="name_field">Name</label>
									<input
										name="name"
										type="text"
										id="name_field"
										className="form-control"
										value={name}
										onChange={(e) => setName(e.target.value)}
									/>
								</div>

								<div className="form-group">
									<label htmlFor="price_field">Price</label>
									<input
										name="price"
										type="text"
										id="price_field"
										className="form-control"
										value={price}
										onChange={(e) => setPrice(e.target.value)}
									/>
								</div>

								<div className="form-group">
									<label htmlFor="description_field">
										Description
									</label>
									<textarea
										name="description"
										className="form-control"
										id="description_field"
										rows="8"
										value={description}
										onChange={(e) => setDescription(e.target.value)}
									></textarea>
								</div>

								<div className="form-group">
									<label htmlFor="category_field">Category</label>
									<select
										name="category"
										className="form-control"
										id="category_field"
										value={category}
										onChange={(e) => setCategory(e.target.value)}
									>
										{categories.map((category) => (
											<option key={category} value={category}>
												{category}
											</option>
										))}
									</select>
								</div>
								<div className="form-group">
									<label htmlFor="stock_field">Stock</label>
									<input
										name="stock"
										type="number"
										id="stock_field"
										className="form-control"
										value={stock}
										onChange={(e) => setStock(e.target.value)}
									/>
								</div>

								<div className="form-group">
									<label htmlFor="seller_field">Seller Name</label>
									<input
										name="seller"
										type="text"
										id="seller_field"
										className="form-control"
										value={seller}
										onChange={(e) => setSeller(e.target.value)}
									/>
								</div>

								<div className="form-group">
									<label>Images</label>

									<div className="custom-file">
										<input
											type="file"
											name="images"
											className="custom-file-input"
											id="customFile"
											onChange={onChange}
											multiple
										/>
										<label
											className="custom-file-label"
											htmlFor="customFile"
										>
											Choose Images
										</label>
									</div>

									{oldImages &&
										oldImages.map((img) => (
											<img
												name="product_images"
												src={img.url}
												key={img.url}
												alt={img.url}
												className="mt-3 mr-2"
												width="55"
												height="52"
											/>
										))}

									{imagesPreview.map((img) => (
										<img
											name="product_images"
											src={img}
											key={img}
											alt="Images Preview"
											className="mt-3 mr-2"
											width="55"
											height="52"
										/>
									))}
								</div>

								<button
									id="login_button"
									type="submit"
									className="btn btn-block py-3"
									disabled={loading ? true : false}
								>
									UPDATE
								</button>
							</form>
						</div>
					</Fragment>
				</div>
			</div>
		</Fragment>
	);
};

export default UpdateProduct;
