// pages/api/orders.js

import clientPromise from "../../utils/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db("crispy-dosa");

        // GET Orders
        if (req.method === "GET") {
            const { orderId, phone, status } = req.query;

            // GET by order ID
            if (orderId) {
                const order = await db
                    .collection("orders")
                    .findOne({
                        _id: new ObjectId(orderId),
                    });

                if (!order) {
                    return res.status(404).json({
                        success: false,
                        message: "Order not found",
                    });
                }

                return res.status(200).json(order);
            }

            // GET orders by phone
            if (phone) {
                const orders = await db
                    .collection("orders")
                    .find({ phone })
                    .toArray();

                return res.status(200).json(orders);
            }

            // GET orders by status
            if (status) {
                const orders = await db
                    .collection("orders")
                    .find({ status })
                    .toArray();

                return res.status(200).json(orders);
            }

            // GET all orders
            const orders = await db
                .collection("orders")
                .find({})
                .sort({ createdAt: -1 })
                .toArray();

            return res.status(200).json(orders);
        }

        // CREATE order
        if (req.method === "POST") {
            const orderData = req.body;

            orderData.createdAt = new Date();
            orderData.status = "Pending";

            const result = await db
                .collection("orders")
                .insertOne(orderData);

            return res.status(201).json({
                success: true,
                orderId: result.insertedId,
            });
        }

        // UPDATE order status
        if (req.method === "PUT") {
            const { orderId } = req.query;
            const { status } = req.body;

            await db
                .collection("orders")
                .updateOne(
                    { _id: new ObjectId(orderId) },
                    { $set: { status } }
                );

            return res.status(200).json({
                success: true,
                message: "Order status updated",
            });
        }

        // DELETE order
        if (req.method === "DELETE") {
            const { orderId } = req.query;

            await db
                .collection("orders")
                .deleteOne({
                    _id: new ObjectId(orderId),
                });

            return res.status(200).json({
                success: true,
                message: "Order deleted",
            });
        }

        res.status(405).json({
            success: false,
            message: "Method not allowed",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}