import { Router } from "express";
import record from "../models/sql/sql.record.js";
import BlobSchema from "../models/mongo/mongo.record.js";

const testRouter = Router()

testRouter.post("/", async (req, res) => {
  const { structured, data } = req.body;

  if (structured) {
    const rec = await record.create(data);
    return res.json({ source: 'mysql', record: rec });
  } else {
    const blob = await BlobSchema.create({ payload: data });
    return res.json({ source: 'mongo', record: blob });
  }
});

testRouter.get('/', async (req, res) => {
  const [ sqlData, mongoData ] = await Promise.all([
    record.findAll(),
    Blob.find().lean(),
  ]);
  res.json({ sql: sqlData, mongo: mongoData });
});

export default testRouter;