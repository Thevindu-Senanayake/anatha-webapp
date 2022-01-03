import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import Home from "./components/Home";
import ProductDetails from "./components/product/ProductDetails";
import Account from "./components/user/Account";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

import { loadUser } from "./actions/authActions";
import store from "./store";

function App() {
	useEffect(() => {
		store.dispatch(loadUser());
	});

	return (
		<Router>
			<div className="App">
				<Header />
				<div className="container container-fluid">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/search/:keyword" element={<Home />} />
						<Route path="/product/:id" element={<ProductDetails />} />

						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/me" element={<Account />} />
					</Routes>
				</div>
				<Footer />
			</div>
		</Router>
	);
}

export default App;
