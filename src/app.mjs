import express from 'express';
import {validateBody, valid, validateParams} from './middleware/validation.mjs'
import MflixService from './service/MflixService.mjs'
import asyncHandler from 'express-async-handler'
import { errorHandler } from './errors/error.mjs';
import { ADD_UPDATE_COMMENT, DELETE_GET_COMMENT, GET_MOVIES_RATED } from './config/pathes.mjs';
import schemas, { schemaParams } from './validation-schemas/schemas.mjs';
const app = express();
const port = process.env.PORT || 3500;
const mflixService = new MflixService(process.env.MONGO_URI, process.env.DB_NAME,
    process.env.MOVIES_COLLECTION, process.env.COMMENTS_COLLECTION)
const server = app.listen(port);


server.on("listening", ()=>console.log(`server listening on port ${server.address().port}`));
app.use(express.json());
app.use(validateBody(schemas));
app.use(valid);
app.post(ADD_UPDATE_COMMENT, asyncHandler(async (req, res) => {
    const commentDB = await mflixService.addComment(req.body);
    res.status(201).end(JSON.stringify(commentDB));
}));
app.put(ADD_UPDATE_COMMENT, asyncHandler(async (req, res) => {
    //update comment
    //req.body {"commentId":<string>, "text":<string>}
   
    if(req.error_message) {
        throw {code:400, text: req.error_message}
    }
    const commentUpdated = await mflixService.updateCommentText(req.body);
    res.status(200).end(JSON.stringify(commentUpdated));
}));
app.delete(DELETE_GET_COMMENT, validateParams(schemaParams), asyncHandler(async (req, res) => {
    // delete comment
   // req.params.id - comment to delete
   const deletedComment = await mflixService.deleteComment(req.params.id);
   res.status(200).end(JSON.stringify(deletedComment));
}))
app.get(DELETE_GET_COMMENT,  validateParams(schemaParams), asyncHandler(async (req, res) => {
    //get comment
   // req.params.id - comment to get
   const comment = await mflixService.getComment(req.params.id);
   res.status(200).end(JSON.stringify(comment));
}))
app.post(GET_MOVIES_RATED, asyncHandler(async (req, res) => {
    //find most imdb rated movies
   // req.body {"year":<number>(optional), "genre":<string>(optional),
   // "acter":<string-regex>(optional), "amount":<number>(mandatary)}
   const movies = await mflixService.getMostRatedMovies(req.body);
   res.status(200).end(JSON.stringify(movies));
}))
app.use(errorHandler);
