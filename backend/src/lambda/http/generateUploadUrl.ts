import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'
import { getUserId } from '../utils'
import { TodoItem } from '../../models/TodoItem'
import { createLogger } from '../../utils/logger'

const docClient = new AWS.DynamoDB.DocumentClient()

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

const todoTable = process.env.TODO_TABLE
const bucketName = process.env.TODO_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const logger = createLogger('GenerateUrl')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  logger.info('Caller event', event)
  const imageId = uuid.v4()
  const url = getUploadUrl(imageId)
  const newItem = await createImage(todoId, imageId, event)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      newItem: newItem,
      uploadUrl: url
    })
  }
}

async function createImage(todoId: string, imageId: string, event: APIGatewayProxyEvent) {
  const userId = getUserId(event)

  try {

    // get the attributes of the todo being edited
    const todo = await docClient
      .get({
        TableName: todoTable,
        Key: {
          userId,
          todoId
        },
        ProjectionExpression: "#name, createdAt, done, dueDate",
        ExpressionAttributeNames: {
          "#name": "name"
        }
      }).promise()
    logger.info('get todo', todo)


    // create new todo
    const { name, createdAt, done, dueDate } = todo.Item
    const newItem: TodoItem = {
      userId,
      todoId,
      name,
      createdAt,
      done,
      dueDate,
      attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${imageId}`
    }

    // save new todo
    await docClient
      .put({
        TableName: todoTable,
        Item: newItem,
      })
      .promise()
      logger.info('put todo', newItem)
    return newItem as TodoItem

  } catch (error) {
    logger.warn('Failure', {error: error.message})
  }

}

function getUploadUrl(imageId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: imageId,
    Expires: parseInt(urlExpiration, 10)
  })
}
