import 'source-map-support/register'
import { getUserId } from '../utils'
import * as AWS from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODO_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  const result = await docClient.update({
    TableName: todosTable,
    Key: {
      userId,
      todoId
    },
    UpdateExpression: "set #name = :name, dueDate=:dueDate, done=:done",  ExpressionAttributeValues:{        
      ":name": updatedTodo.name,        
      ":dueDate": updatedTodo.dueDate,        
      ":done": updatedTodo.done
    },    
    ExpressionAttributeNames: {"#name": "name", "#attachmentUrl": "attachmentUrl"},    ReturnValues:"UPDATED_NEW"  }).promise()

  if (result) {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result)
    }
  }

  return {
    statusCode: 404,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }
}
