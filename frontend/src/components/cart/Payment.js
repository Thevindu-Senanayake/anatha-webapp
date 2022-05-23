import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";

import MetaData from "../layout/MetaData";
import CheckoutSteps from "./CheckoutSteps";

import {
	useStripe,
	useElements,
	CardCvcElement,
	CardNumberElement,
	CardExpiryElement,
} from "@stripe/react-stripe-js";

import axios from "axios";

const options = {
	style: {
		base: {
			fontSize: "16px",
		},
		invalid: {
			color: "#9e2146",
		},
	},
};

const Payment = () => {
	const stripe = useStripe();
	const navigate = useNavigate();
	const alert = useAlert();
	const dispatch = useDispatch();
	const elements = useElements();

	const { user } = useSelector((state) => state.auth);
	const { cartItems, shippingInfo } = useSelector((state) => state.cart);

	useEffect(() => {}, []);

	const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

	const paymentData = {
		amount: Math.round(orderInfo.totalPrice * 100),
	};

	const submitHandler = async (e) => {
		e.preventDefault();

		document.querySelector("#pay_btn").disabled = true;

		let res;

		try {
			const config = {
				headers: {
					"Content-Type": "application/json",
				},
			};

			res = await axios.post("/api/v1/payment/process", paymentData, config);

			console.log(res);
			console.log(paymentData);
			console.log(config);

			const clientSecret = res.data.client_secret;

			if (!stripe || !elements) {
				return;
			}

			const result = await stripe.confirmCardPayment(clientSecret, {
				payment_method: {
					card: elements.getElement(CardNumberElement),
					billing_details: {
						name: user.name,
						email: user.email,
					},
				},
			});

			if (result.error) {
				alert.error(result.error.message);
				document.querySelector("#pay_btn").disabled = false;
			} else {
				// The payment is processed or not
				if (result.paymentIntent.status === "succeeded") {
					// TODO: New Order

					navigate("/orders");
				} else {
					alert.error("Payment failed");
					document.querySelector("#pay_btn").disabled = false;
				}
			}
		} catch (error) {
			document.querySelector("#pay_btn").disabled = false;
			console.log(error);
			alert.error(error.response.data.message);
		}
	};

	return (
		<Fragment>
			<MetaData title={"Payment"} />

			<CheckoutSteps shipping confirmOrder payment />

			<div className="row wrapper">
				<div className="col-10 col-lg-5">
					<form className="shadow-lg" onSubmit={submitHandler}>
						<h1 className="mb-4">Card Info</h1>
						<div className="form-group">
							<label htmlFor="card_num_field">Card Number</label>
							<CardNumberElement
								type="text"
								id="card_num_field"
								className="form-control"
								options={options}
							/>
						</div>

						<div className="form-group">
							<label htmlFor="card_exp_field">Card Expiry</label>
							<CardExpiryElement
								type="text"
								id="card_exp_field"
								className="form-control"
								options={options}
							/>
						</div>

						<div className="form-group">
							<label htmlFor="card_cvc_field">Card CVC</label>
							<CardCvcElement
								type="text"
								id="card_cvc_field"
								className="form-control"
								options={options}
							/>
						</div>

						<button
							id="pay_btn"
							type="submit"
							className="btn btn-block py-3"
						>
							Pay {` - ${orderInfo && orderInfo.totalPrice}`}
						</button>
					</form>
				</div>
			</div>
		</Fragment>
	);
};

export default Payment;
