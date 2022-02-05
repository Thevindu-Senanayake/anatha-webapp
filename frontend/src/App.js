import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import Cart from "./components/cart/Cart";
import Shipping from "./components/cart/Shipping";
import ConfirmOrder from "./components/cart/ConfirmOrder";
import Payment from "./components/cart/Payment";

import Home from "./components/Home";
import ProductDetails from "./components/product/ProductDetails";
import Account from "./components/user/Account";
import UpdateAccount from "./components/user/UpdateAccount";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import UpdatePassword from "./components/auth/UpdatePassword";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";

import ProtectedRoutes from "./components/routes/ProtectedRoutes";
import { loadUser } from "./actions/authActions";
import store from "./store";
import axios from "axios";

// Payment
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

function App() {
	const [stripeApiKey, setStripeApiKey] = useState("");

	useEffect(() => {
		store.dispatch(loadUser());

		async function getStripApiKey() {
			console.log("test1");
			const { data } = await axios.get("/api/v1/stripeapi");
			console.log("test2");
			setStripeApiKey(data.stripeApiKey);
			console.log("test3");
		}

		getStripApiKey();
	}, []);

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
						{stripeApiKey && (
							<Elements stripe={loadStripe(stripeApiKey)}>
								<Routes>
									<Route
										path="/payment"
										element={
											<ProtectedRoutes>
												<Payment />
											</ProtectedRoutes>
										}
									/>
								</Routes>
							</Elements>
						)}
					</Routes>
				</div>
				<Footer />
			</div>
		</Router>
	);
}

export default App;
