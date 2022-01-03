import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import "../../App.css";

import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";

import Search from "./Search";

const Header = () => {
	const alert = useAlert();
	const dispatch = useDispatch();

	const { user, loading } = useSelector((state) => state.auth);

	return (
		<Fragment>
			<nav className="navbar row">
				<div className="col-12 col-md-3">
					<div className="navbar-brand">
						<Link to="/">
							<img src="./images/logo.png" />
						</Link>
					</div>
				</div>

				<div className="col-12 col-md-6 mt-2 mt-md-0">
					<Search />
				</div>

				<div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
					{user ? (
						<div className="ml-4 dropdown d-inline">
							<Link
								to="#!"
								className="btn dropdown-toggle text-white"
								type="button"
								id="dropDownMenuButton"
								data-toggle="dropdown"
								aria-expanded="false"
								aria-haspopup="true"
							>
								<figure className="avatar avatar-nav">
									<img
										src=""
										// alt={user && user.name}
										className="rounded-circle"
									/>
								</figure>
								<span>{user && user.name}</span>
							</Link>
							<div
								className="dropdown-menu"
								aria-labelledby="dropDownMenuButton"
							>
								{user && user.role !== "admin" ? (
									<Link className="dropdown-item" to="/orders/me">
										My Orders
									</Link>
								) : (
									<Link className="dropdown-item" to="/dashboard">
										Dashboard
									</Link>
								)}

								<Link className="dropdown-item" to="/orders/me">
									My Orders
								</Link>
								<Link className="dropdown-item" to="/me">
									My Account
								</Link>
								<Link to="/" className="dropdown-item text-danger">
									Logout
								</Link>
							</div>
						</div>
					) : (
						!loading && (
							<Link to="/login" className="btn ml-4" id="login_btn">
								Login
							</Link>
						)
					)}

					<Link to="/cart" style={{ textDecoration: "none" }}>
						<span id="cart" className="ml-3">
							Cart
						</span>
						<span className="ml-1" id="cart_count">
							2
						</span>
					</Link>
				</div>
			</nav>
		</Fragment>
	);
};

export default Header;
