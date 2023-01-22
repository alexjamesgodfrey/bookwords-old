import dotenv from "dotenv"
import express, { Express, Request, Response } from "express"
const cors = require("cors")

dotenv.config()

const app: Express = express()
app.use(cors())
app.use(express.json())

require("./routes/analysis")(app)

const port = process.env.PORT

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript")
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
