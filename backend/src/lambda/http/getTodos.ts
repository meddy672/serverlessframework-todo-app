import 'source-map-support/register'
import { getUserId } from '../utils'
import * as AWS from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { TodoItem } from '../../models/TodoItem'
import { createLogger } from '../../utils/logger'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODO_TABLE
const logger = createLogger('Get Todos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event)
  console.log('Processing event:', event)

  logger.info('Getting todos')
  try {

    const result = await docClient.query({
      TableName: todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()
  
    const todos = result.Items as TodoItem[]
  
    return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin':'*'  
        },
        body: JSON.stringify({
            todos
        })
    }

  } catch (error) {
    // handle error cases scenarios
    logger.warn('failure', { error: error.message})
  }

}
