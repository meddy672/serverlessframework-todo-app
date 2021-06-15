import 'source-map-support/register'
import { getUserId } from '../utils'
import * as AWS from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { TodoItem } from '../../models/TodoItem'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODO_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event)
  console.log('Processing event:', event)

  const result = await docClient.query({
    TableName: todosTable,
    KeyConditionExpression: 'userId = :userId AND todoId = :todoId',
    ExpressionAttributeValues: {
      ':userId': userId
    },
    ScanIndexForward: false
  }).promise()

  const items = result.Items as TodoItem[]

  return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin':'*'  
      },
      body: JSON.stringify({
          items
      })
  }

}
