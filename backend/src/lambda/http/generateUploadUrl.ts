import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { generateUploadUrl } from '../../businessLogic/todo'

const logger = createLogger('GenerateUrl')

/**
 * uploads image to s3, updates the todo with attachmentUrl, 
 * and returns new todo with url to the client
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId: string = event.pathParameters.todoId
  const userId: string = getUserId(event)

  logger.info('Caller event', event)
  try {
    const { url, todo } = await generateUploadUrl(userId, todoId)
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        newItem: todo,
        uploadUrl: url
      })
    } 
  } catch (error) {
    logger.warn('Failed to generate url')
  }
}

