import { Express, Request, Response } from "express"

module.exports = function (app: Express) {
  app.get("/test", (req: Request, res: Response) => {
    res.send("analysis")
  })
}
