var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as AWS from 'aws-sdk';
import { createLogger } from '../utils/logger';
const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger('todoAccess');
/**
 * Data object for managing todos
 */
export class TodoAccess {
    constructor(docClient = createDynamoDBClient(), todosTable = process.env.TODO_TABLE, s3 = new XAWS.S3({ signatureVersion: 'v4' }), bucketName = process.env.TODO_S3_BUCKET, urlExpiration = process.env.SIGNED_URL_EXPIRATION) {
        this.docClient = docClient;
        this.todosTable = todosTable;
        this.s3 = s3;
        this.bucketName = bucketName;
        this.urlExpiration = urlExpiration;
    }
    /**
     * creates a new todo in the database
     */
    createTodo(todo) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info('Creating todo', todo);
            yield this.docClient.put({ TableName: this.todosTable, Item: todo, }).promise();
            return todo;
        });
    }
    /**
     * updates a todo by composite key and returns data for TodoUpdate
     */
    updateTodo(todo) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info('Updating todo', todo);
            const result = yield this.docClient.update({
                TableName: this.todosTable,
                Key: { userId: todo.userId, todoId: todo.todoId },
                UpdateExpression: "set #name=:name, dueDate=:dueDate, done=:done",
                ExpressionAttributeValues: {
                    ":name": todo.name,
                    ":dueDate": todo.dueDate,
                    ":done": todo.done,
                },
                ExpressionAttributeNames: { "#name": "name" },
                ReturnValues: "UPDATED_NEW"
            }).promise();
            const todoUpdate = {
                name: result.name,
                dueDate: result.dueDate,
                done: result.done
            };
            return todoUpdate;
        });
    }
    /**
     * deletes a todo from the database by composite key
     */
    deleteTodo(userId, todoId) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info('Deleting todo', { userId, todoId });
            yield this.docClient.delete({ TableName: this.todosTable, Key: { userId, todoId } }).promise();
        });
    }
    /**
     * gets all user todos by userId
     */
    getTodos(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info('Getting todos', userId);
            const result = yield this.docClient.query({
                TableName: this.todosTable,
                KeyConditionExpression: 'userId = :userId',
                ProjectionExpression: '#name, todoId, done, dueDate, createdAt, attachmentUrl',
                ExpressionAttributeNames: { "#name": "name" },
                ExpressionAttributeValues: { ':userId': userId }
            }).promise();
            return result.Items;
        });
    }
    /**
     * get a todo from the database by composite key
     */
    getTodo(userId, todoId) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info('Getting todo', { userId, todoId });
            const todo = yield this.docClient
                .get({
                TableName: this.todosTable,
                Key: { userId, todoId },
                ProjectionExpression: "#name, createdAt, done, dueDate",
                ExpressionAttributeNames: { "#name": "name" }
            }).promise();
            return todo.Item;
        });
    }
    /**
     * replaces an old todo with a todo with attachmentUrl
     */
    todoAttachUrl(imageId, todo) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info('Attaching Url to Todo', todo);
            const newItem = Object.assign(Object.assign({}, todo), { attachmentUrl: `https://${this.bucketName}.s3.amazonaws.com/${imageId}` });
            logger.info('Todo AttachingUrl', newItem);
            yield this.docClient.put({ TableName: this.todosTable, Item: newItem }).promise();
        });
    }
    /**
     * generates presigned url and returns the url
     */
    getUploadUrl(imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info('Getting upload url', imageId);
            return this.s3.getSignedUrl('putObject', {
                Bucket: this.bucketName,
                Key: imageId,
                Expires: parseInt(this.urlExpiration, 10)
            });
        });
    }
}
/**
 *  checks to see if the env IS_OFFLINE is set and will use local DB
 */
function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance');
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        });
    }
    return new XAWS.DynamoDB.DocumentClient();
}
//# sourceMappingURL=todoAccess.js.map