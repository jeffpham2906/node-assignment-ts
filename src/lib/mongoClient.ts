import mongoose from "mongoose";

let pool: Promise<mongoose.Mongoose> | null = null;
export const getMongoClient = async (
    mongoUri: string = process.env.MONGO_URL || "",
    dbName: string = "node-assignment"
) => {

    try {
        if (!pool) {
            pool = mongoose.connect(mongoUri, { dbName });
        }

        await pool;
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    }
};
