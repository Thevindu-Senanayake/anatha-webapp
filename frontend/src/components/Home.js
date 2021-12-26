import React, { Fragment, useState, useEffect } from "react";
import Pagination from 'react-js-pagination';
import { useParams } from 'react-router-dom';

import MetaData from "./layout/MetaData";
import Product from "./product/Product";
import Loader from "./layout/Loader";

import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { getProducts } from "../actions/productActions";

const Home = () => {

	const [currentPage, setCurrentPage] = useState(1)

	const alert = useAlert();
	const dispatch = useDispatch();
	const params = useParams();

	const { loading, products, error, productCount, resPerPage } = useSelector(
		(state) => state.products
	);

	const keyword = params.keyword

	useEffect(() => {
		if (error) {
			return alert.error(error);
		}

		dispatch(getProducts(keyword, currentPage));

	}, [dispatch, alert, error, keyword, currentPage]);

	function setCurrentPageNo(pageNumber) {
		setCurrentPage(pageNumber)
	}

	return (
		<Fragment>
			{loading ? (
				<Loader />
			) : (
				<Fragment>
					<MetaData title={"Home page"} />

					<h1 id="products_heading">Latest Products</h1>

					<section id="products" className="container mt-5">
						<div className="row">
							{products &&
								products.map((product) => (
									<Product key={product._id} product={product} />
								))}
						</div>
					</section>

					{resPerPage <= productCount && (
						<div className="d-flex justify-content-center mt-5">
							<Pagination
								acvitePage={currentPage}
								itemsCountPerPage={resPerPage}
								totalItemsCount={productCount}
								onChange={setCurrentPageNo}
								nextPageText={'Next'}
								prevPageText={'Prev'}
								firstPageText={'First'}
								lastPageText={'Last'}
								itemClass="page-item"
								linkClass="page-link"
							/>
						</div>
					)}
				</Fragment>
			)}
		</Fragment>
	);
};

export default Home;
