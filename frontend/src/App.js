import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import Home from "./components/Home";
import ProductDetails from "./components/product/ProductDetails";

// Cart Imports
import Cart from "./components/cart/Cart";
import Shipping from "./components/cart/Shipping";
import ConfirmOrder from "./components/cart/ConfirmOrder";
import Payment from "./components/cart/Payment";
import OrderSuccess from "./components/cart/OrderSuccess";

// Order Imports
import ListOrders from "./components/order/ListOrders";
import OrderDetails from "./components/order/OrderDetails";

// Auth and User Imports
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Account from "./components/user/Account";
import UpdateAccount from "./components/user/UpdateAccount";
import UpdatePassword from "./components/auth/UpdatePassword";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";

// Admin Imports
import Dashboard from "./components/admin/Dashboard";
import ProductList from "./components/admin/ProductList";
import NewProduct from "./components/admin/NewProduct";

import ProtectedRoutes from "./components/routes/ProtectedRoutes";
import { loadUser } from "./actions/authActions";
import store from "./store";

// Payment
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

function App() {
	const [stripeApiKey, setStripeApiKey] = useState("");

	useEffect(() => {
		store.dispatch(loadUser());

		async function getStripApiKey() {
			const { data } = await axios.get("/api/v1/stripeapi");
			setStripeApiKey(data.stripeApiKey);
		}

		getStripApiKey();
	}, []);

	const { user, loading } = useSelector((state) => state.auth);

	return (
		<Router>
			<div className="App">
				<Header />
				<div className="container container-fluid">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/search/:keyword" element={<Home />} />
						<Route path="/product/:id" element={<ProductDetails />} />

						<Route path="/cart" element={<Cart />} />

						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/password/forgot" element={<ForgotPassword />} />
						<Route
							path="/password/reset/:token"
							element={<ResetPassword />}
						/>
						<Route
							path="/me"
							element={
								<ProtectedRoutes>
									<Account />
								</ProtectedRoutes>
							}
						/>
						<Route
							path="/me/update"
							element={
								<ProtectedRoutes>
									<UpdateAccount />
								</ProtectedRoutes>
							}
						/>
						<Route
							path="/password/update"
							element={
								<ProtectedRoutes>
									<UpdatePassword />
								</ProtectedRoutes>
							}
						/>
						<Route
							path="/orders/me"
							element={
								<ProtectedRoutes>
									<ListOrders />
								</ProtectedRoutes>
							}
						/>
						<Route
							path="/order/:id"
							element={
								<ProtectedRoutes>
									<OrderDetails />
								</ProtectedRoutes>
							}
						/>
						<Route
							path="/shipping"
							element={
								<ProtectedRoutes>
									<Shipping />
								</ProtectedRoutes>
							}
						/>
						<Route
							path="/order/confirm"
							element={
								<ProtectedRoutes>
									<ConfirmOrder />
								</ProtectedRoutes>
							}
						/>
						<Route
							path="/success"
							element={
								<ProtectedRoutes>
									<OrderSuccess />
								</ProtectedRoutes>
							}
						/>
						{stripeApiKey && (
							<Route
								path="/payment"
								element={
									<Elements stripe={loadStripe(stripeApiKey)}>
										<Payment />
									</Elements>
								}
							/>
						)}
					</Routes>
				</div>
				<Routes>
					<Route
						path="/dashboard"
						element={
							<ProtectedRoutes isAdmin={true}>
								<Dashboard />
							</ProtectedRoutes>
						}
					/>
					<Route
						path="/admin/products"
						element={
							<ProtectedRoutes isAdmin={true}>
								<ProductList />
							</ProtectedRoutes>
						}
					/>
					<Route
						path="/admin/product"
						element={
							<ProtectedRoutes isAdmin={true}>
								<NewProduct />
							</ProtectedRoutes>
						}
					/>
				</Routes>

				{!loading && user && user.role !== "admin" && <Footer />}
			</div>
		</Router>
	);
}

export default App;
