import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'
import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

const todoTable = process.env.TODO_TABLE
const bucketName = process.env.TODO_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  console.log('Caller event', event)
  const imageId = uuid.v4()
  const newItem = await createImage(todoId, imageId, event)
  
  const url = getUploadUrl(imageId)

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

  // get the attributes of the todo to edit
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
  console.log('Editing Todo',todo)

  // create new todo
  const newItem = {
    userId,
    todoId,
    name: todo.Item.name,
    createdAt: todo.Item.createdAt,
    done: todo.Item.done,
    dueDate: todo.Item.dueDate,
    imageId,
    imageUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`
  }
  console.log('Storing new item: ', newItem)

  // save new todo
  await docClient
    .put({
      TableName: todoTable,
      Item: newItem,
    })
    .promise()

  return newItem
}

function getUploadUrl(imageId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: imageId,
    Expires: parseInt(urlExpiration, 10)
  })
}
