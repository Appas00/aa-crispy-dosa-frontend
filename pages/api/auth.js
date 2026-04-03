// pages/api/auth.js

import clientPromise from "../../utils/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "crispy_dosa_secret";

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db("crispy-dosa");

        if (req.method === "POST") {
            const { action } = req.body;

            // LOGIN
            if (action === "login") {
                const { email, password } = req.body;

                const user = await db.collection("users").findOne({ email });

                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: "User not found",
                    });
                }

                const isMatch = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!isMatch) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid password",
                    });
                }

                const token = jwt.sign(
                    { id: user._id, email: user.email },
                    JWT_SECRET,
                    { expiresIn: "1d" }
                );

                return res.status(200).json({
                    success: true,
                    token,
                    user: {
                        email: user.email,
                    },
                });
            }

            // REGISTER
            if (action === "register") {
                const { email, password } = req.body;

                const existingUser = await db
                    .collection("users")
                    .findOne({ email });

                if (existingUser) {
                    return res.status(400).json({
                        success: false,
                        message: "User already exists",
                    });
                }

                const hashedPassword = await bcrypt.hash(
                    password,
                    10
                );

                await db.collection("users").insertOne({
                    email,
                    password: hashedPassword,
                });

                return res.status(200).json({
                    success: true,
                    message: "User registered",
                });
            }
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