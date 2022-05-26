import React, { Fragment, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MDBDataTable } from "mdbreact";

import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import Sidebar from "./Sidebar";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { getAdminProducts, clearErrors } from "../../actions/productActions";

const ProductList = () => {
	const alert = useAlert();
	const dispatch = useDispatch();

	const { loading, error, products } = useSelector((state) => state.products);

	useEffect(() => {
		dispatch(getAdminProducts());

		if (error) {
			alert.error(error);
			dispatch(clearErrors());
		}
	}, [dispatch, alert, error]);

	const setProducts = () => {
		const data = {
			columns: [
				{
					label: "ID",
					field: "id",
					sort: "asc",
				},
				{
					label: "Name",
					field: "name",
					sort: "asc",
				},
				{
					label: "Price",
					field: "price",
					sort: "asc",
				},
				{
					label: "Stock",
					field: "stock",
					sort: "asc",
				},
				{
					label: "Actions",
					field: "actions",
				},
			],
			rows: [],
		};

		products.forEach((product) => {
			data.rows.push({
				id: product._id,
				name: product.name,
				price: `$${product.price}`,
				stock: product.stock,
				actions: (
					<Fragment>
						<Link
							to={`/admin/product/${product._id}`}
							className="btn btn-primary py-1 px-2"
						>
							<i className="fa fa-pencil"></i>
						</Link>
						<button className="btn btn-danger py-1 px-2 ml-2">
							<i className="fa fa-trash"></i>
						</button>
					</Fragment>
				),
			});
		});

		return data;
	};

	return (
		<Fragment>
			<MetaData title={"All Products"} />
			<div className="row">
				<div className="col-12 col-md-2">
					<Sidebar />
				</div>

				<div className="col-12 col-md-10">
					<Fragment>
						<h1 className="my-5">All Products</h1>

						{loading ? (
							<Loader />
						) : (
							<MDBDataTable
								striped
								bordered
								hover
								data={setProducts()}
								className="px-3"
							/>
						)}
					</Fragment>
				</div>
			</div>
		</Fragment>
	);
};

export default ProductList;
