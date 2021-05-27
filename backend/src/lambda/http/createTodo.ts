import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import * as uuid from 'uuid'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

const docClient = new AWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODO_TABLE


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const todoId = uuid.v4().toString()
  const timestamp = new Date().toISOString()

  const createTodo = {
    todoId: todoId,
    userId:'1',
    createdAt: timestamp,
    done: 0,
    attachmentUrl: '',
    ...newTodo
  }

  await docClient.put({
    TableName: todosTable,
    Item: createTodo
  }).promise();

  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({ createTodo })
  };
}
