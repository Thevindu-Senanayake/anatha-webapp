import React, { Fragment, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MDBDataTable } from "mdbreact";

import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import Sidebar from "./Sidebar";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import {
	getAllOrders,
	deleteOrder,
	clearErrors,
} from "../../actions/orderActions";
import { DELETE_ORDER_RESET } from "../../constants/orderConstants";

const OrdersList = () => {
	const alert = useAlert();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { loading, error, orders } = useSelector((state) => state.allOrders);
	const { isDeleted } = useSelector((state) => state.updateOrder);

	useEffect(() => {
		dispatch(getAllOrders());

		if (error) {
			alert.error(error);
			dispatch(clearErrors());
		}

		if (isDeleted) {
			alert.success("Order Deleted Successfully");
			navigate("/admin/orders");
			dispatch({ type: DELETE_ORDER_RESET });
		}
	}, [dispatch, alert, error, navigate, isDeleted, navigate]);

	const deleteOrderHandler = (id) => {
		dispatch(deleteOrder(id));
	};

	const setOrders = () => {
		const data = {
			columns: [
				{
					label: "Order ID",
					field: "id",
					sort: "asc",
				},
				{
					label: "Number of Items",
					field: "numOfItems",
					sort: "asc",
				},
				{
					label: "Amount",
					field: "amount",
					sort: "asc",
				},
				{
					label: "Status",
					field: "status",
					sort: "asc",
				},
				{
					label: "Actions",
					field: "actions",
				},
			],
			rows: [],
		};

		orders.forEach((order) => {
			data.rows.push({
				id: order._id,
				numOfItems: order.orderItems.length,
				amount: `$${order.totalPrice}`,
				stock: order.stock,
				status:
					order.orderStatus &&
					String(order.orderStatus).includes("Delivered") ? (
						<p style={{ color: "green" }}>{order.orderStatus}</p>
					) : (
						<p style={{ color: "red" }}>{order.orderStatus}</p>
					),
				actions: (
					<Fragment>
						<Link
							to={`/admin/order/${order._id}`}
							className="btn btn-primary py-1 px-2"
						>
							<i className="fa fa-eye"></i>
						</Link>
						<button className="btn btn-danger py-1 px-2 ml-2">
							<i
								className="fa fa-trash"
								onClick={() => deleteOrderHandler(order._id)}
							></i>
						</button>
					</Fragment>
				),
			});
		});

		return data;
	};

	return (
		<Fragment>
			<MetaData title={"All Orders"} />
			<div className="row">
				<div className="col-12 col-md-2">
					<Sidebar />
				</div>

				<div className="col-12 col-md-10">
					<Fragment>
						<h1 className="my-5">All Orders</h1>

						{loading ? (
							<Loader />
						) : (
							<MDBDataTable
								striped
								bordered
								hover
								data={setOrders()}
								className="px-3"
							/>
						)}
					</Fragment>
				</div>
			</div>
		</Fragment>
	);
};

export default OrdersList;
