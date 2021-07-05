import * as AWS from 'aws-sdk'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
const AWSXRay = require('aws-xray-sdk');

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('todoAccess')

/**
 * Data object for managing todos
 */
export class TodoAccess {

    constructor(
        private readonly docClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODO_TABLE,
        private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
        private readonly bucketName = process.env.TODO_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
    ) { }




    /**
     * creates a new todo in the database
     */
    async createTodo(todo: TodoItem): Promise<TodoItem> {
        logger.info('Creating todo', todo)
        await this.docClient.put({ TableName: this.todosTable, Item: todo, }).promise();
        return todo as TodoItem
    }





    /**
     * updates a todo by composite key and returns data for TodoUpdate
     */
    async updateTodo(todo: TodoItem): Promise<TodoUpdate> {
        logger.info('Updating todo', todo)
        const result = await this.docClient.update({
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
        }).promise()

        const todoUpdate = {
            name: result.name,
            dueDate: result.dueDate,
            done: result.done
        }

        return todoUpdate as TodoUpdate
    }




    /**
     * deletes a todo from the database by composite key
     */
    async deleteTodo(userId: string, todoId: string): Promise<void> {
        logger.info('Deleting todo', { userId, todoId })
        await this.docClient.delete({ TableName: this.todosTable, Key: { userId, todoId } }).promise()
    }





    /**
     * gets all user todos by userId
     */
    async getTodos(userId: string): Promise<TodoItem[]> {
        logger.info('Getting todos', userId)
        const result = await this.docClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: 'userId = :userId',
            ProjectionExpression: '#name, todoId, done, dueDate, createdAt, attachmentUrl',
            ExpressionAttributeNames: { "#name": "name" },
            ExpressionAttributeValues: { ':userId': userId }
        }).promise()
        return result.Items as TodoItem[]
    }





    /**
     * get a todo from the database by composite key
     */
    async getTodo(userId: string, todoId: string): Promise<TodoItem> {
        logger.info('Getting todo', { userId, todoId })
        const todo = await this.docClient
            .get({
                TableName: this.todosTable,
                Key: { userId, todoId },
                ProjectionExpression: "#name, createdAt, done, dueDate",
                ExpressionAttributeNames: { "#name": "name" }
            }).promise()
        return todo.Item as TodoItem
    }





    /**
     * replaces an old todo with a todo with attachmentUrl
     */
    async todoAttachUrl(imageId: string, todo: TodoItem,): Promise<void> {
        logger.info('Attaching Url to Todo', todo)
        const newItem: TodoItem = {
            ...todo,
            attachmentUrl: `https://${this.bucketName}.s3.amazonaws.com/${imageId}`
        }
        logger.info('Todo AttachingUrl', newItem)
        await this.docClient.put({ TableName: this.todosTable, Item: newItem }).promise()
    }





    /**
     * generates presigned url and returns the url
     */
    async getUploadUrl(imageId: string): Promise<string> {
        logger.info('Getting upload url', imageId)
        return this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: imageId,
            Expires: parseInt(this.urlExpiration, 10)
        })
    }
}