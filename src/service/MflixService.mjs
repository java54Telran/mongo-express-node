import MongoConnection from '../mongo/MongoConnection.mjs'
import { ObjectId } from 'mongodb'
export default class MflixService {
    #moviesCollection
    #commentsCollection
    #connection
    constructor(uri, dbName, moviesCollection, commentsCollection){
        this.#connection = new MongoConnection(uri, dbName);
        this.#moviesCollection = this.#connection.getCollection(moviesCollection);
        this.#commentsCollection = this.#connection.getCollection(commentsCollection);
        
    }
    shutdown() {
        this.#connection.closeConnection();
    }
    async addComment(commentDto) {
        
        const commentDB = this.#toComment(commentDto);
        const result = await this.#commentsCollection.insertOne(commentDB);
        commentDB._id = result.insertedId;
        return commentDB;
    }
    #toComment(commentDto) {
        const movieId = ObjectId.createFromHexString(commentDto.movie_id);
        return {...commentDto,'movie_id': movieId}
    }
}