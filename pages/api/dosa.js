// pages/api/dosa.js

import clientPromise from "../../utils/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db("crispy-dosa");

        // GET all dosa
        if (req.method === "GET") {
            const { id, type } = req.query;

            // GET dosa by ID
            if (id) {
                const dosa = await db
                    .collection("dosa")
                    .findOne({ _id: new ObjectId(id) });

                if (!dosa) {
                    return res.status(404).json({
                        success: false,
                        message: "Dosa not found",
                    });
                }

                return res.status(200).json(dosa);
            }

            // GET dosa by type
            if (type) {
                const dosaList = await db
                    .collection("dosa")
                    .find({ type })
                    .toArray();

                return res.status(200).json(dosaList);
            }

            // GET all dosa
            const dosaList = await db
                .collection("dosa")
                .find({})
                .toArray();

            return res.status(200).json(dosaList);
        }

        // ADD new dosa
        if (req.method === "POST") {
            const newDosa = req.body;

            const result = await db
                .collection("dosa")
                .insertOne(newDosa);

            return res.status(201).json({
                success: true,
                insertedId: result.insertedId,
            });
        }

        // UPDATE dosa
        if (req.method === "PUT") {
            const { id } = req.query;
            const updatedData = req.body;

            await db
                .collection("dosa")
                .updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updatedData }
                );

            return res.status(200).json({
                success: true,
                message: "Dosa updated",
            });
        }

        // DELETE dosa
        if (req.method === "DELETE") {
            const { id } = req.query;

            await db
                .collection("dosa")
                .deleteOne({
                    _id: new ObjectId(id),
                });

            return res.status(200).json({
                success: true,
                message: "Dosa deleted",
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