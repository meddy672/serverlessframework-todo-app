import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { generateUploadUrl } from '../../businessLogic/todo'

const logger = createLogger('GenerateUrl')

/**
 * add an attachmentUrl to a todo
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId: string = event.pathParameters.todoId
  const userId: string = getUserId(event)
  if (!userId) {
    return {
      statusCode: 401,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'User is not authorized'
      })
    }
  }
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

