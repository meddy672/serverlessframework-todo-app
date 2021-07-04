import * as AWS from 'aws-sdk'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

const logger = createLogger('todoAccess')

export class TodoAccess {

    constructor(
        private readonly docClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODO_TABLE,
        //private readonly bucketName = process.env.TODO_S3_BUCKET,
        //private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
    ) { }

    async createTodo(todo: TodoItem) {
        logger.info('Creating todo', todo)
        await this.docClient.put({ TableName: this.todosTable, Item: todo }).promise();
        return todo
    }

    async updateTodo(todo: TodoItem): Promise<TodoUpdate> {
        logger.info('Updating todo', todo)
        const result = await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                userId: todo.userId,
                todoId: todo.todoId
            },
            UpdateExpression: "set #name = :name, dueDate=:dueDate, done=:done",
            ExpressionAttributeValues: {
                ":name": todo.name,
                ":dueDate": todo.dueDate,
                ":done": todo.done
            },
            ExpressionAttributeNames: {
                "#name": "name"
            },
            ReturnValues: "UPDATED_NEW"
        }).promise()
        return result as unknown as TodoUpdate
    }

    async deleteTodo(userId: string, todoId: string) {
        logger.info('Deleting todo', { userId, todoId })
        await this.docClient.delete({ TableName: this.todosTable, Key: { userId,todoId }}).promise()
    }

    async getTodos(userId: string) {
        const result = await this.docClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: 'userId = :userId',
            ProjectionExpression: '#name, todoId, done, dueDate, createdAt, attachmentUrl',
            ExpressionAttributeNames: {
                "#name": "name"
            },
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()
        return result.Items as TodoItem[]
    }
}