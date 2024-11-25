import express from 'express';
import MflixService from './service/MflixService.mjs'
const app = express();
const port = process.env.PORT || 3500;
const mflixService = new MflixService(process.env.MONGO_URI, process.env.DB_NAME,
    process.env.MOVIES_COLLECTION, process.env.COMMENTS_COLLECTION)
const server = app.listen(port);
server.on("listening", ()=>console.log(`server listening on port ${server.address().port}`));
app.use(express.json());
app.post("/mflix/comments", async (req, res) => {
    const commentDB = await mflixService.addComment(req.body);
    res.status(201).end(JSON.stringify(commentDB));
});
app.put("/mflix/comments", async (req, res) => {
    //TODO update comment
    //req.body {"commentId":<string>, "text":<string>}
});
app.delete("/mflix/comments/:id", async (req, res) => {
    //TODO delete comment
   // req.params.id - comment to delete
})
app.get("/mflix/comments/:id", async (req, res) => {
    //TODO get comment
   // req.params.id - comment to get
})
app.post("/mflix/movies/rated", async (req, res) => {
    //TODO find most imdb rated movies
   // req.body {"year":<number>(optional), "genre":<string>(optional),
   // "acter":<string-regex>(optional), "amount":<number>(mandatary)}
})
