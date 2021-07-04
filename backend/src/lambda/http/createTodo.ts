import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

import * as uuid from 'uuid'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

const docClient = new AWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODO_TABLE
const logger = createLogger('Create Todo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const todoId = uuid.v4().toString()
  const userId = getUserId(event)
  const timestamp = new Date().toISOString()

  const item = {
    todoId: todoId,
    userId: userId,
    createdAt: timestamp,
    done: false,
    attachmentUrl: '',
    ...newTodo
  }

  logger.info('creating todo', item)
  
  try {

    await docClient.put({
      TableName: todosTable,
      Item: item
    }).promise();
  
    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ item })
    }

  } catch (error) {
    logger.warn('failure', { error: error.message})
  }


}
