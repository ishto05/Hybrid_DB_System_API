import BlobSchema from "../models/mongo/mongo.record.js";
import record from "../models/sql/sql.record.js";

const uploadData = async (req, res) => {
  try {
    const { structured, data } = req.body;
    const userId = req.user.id; // sent by authguard

    if (!data || typeof structured !== "boolean") {
      return res.status(400).json({
        status: "error",
        message: "Missing or invalid data/structured flag.",
      });
    }

    //separating structured data
    if (structured) {
      //store in sql
      const datarecord = await record.create({ ...data, userId });

      return res.status(201).json({
        status: "success",
        message: "Structured data stored in SQL.",
        datarecord,
      });
    }
    //separating unstructured data
    else {
      //store in mongo
      const blob = await BlobSchema.create({ payload: data, userId });
      return res.status(201).json({
        status: "success",
        message: "Unstructured data stored in MongoDB.",
        blob,
      });
    }
  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to store data.",
    });
  }
};

export default uploadData;
