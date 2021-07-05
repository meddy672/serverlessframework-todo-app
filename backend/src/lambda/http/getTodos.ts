import 'source-map-support/register'
import { getUserId } from '../utils'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getTodos } from '../../businessLogic/todo'
import { createLogger } from '../../utils/logger'
import { TodoItem } from '../../models/TodoItem'

const logger = createLogger('Get Todos')

/**
 * get all users todos
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId: string = getUserId(event)
  
  logger.info('Getting todos', { event, userId })
  try {
    const todos: TodoItem[] = await getTodos(userId)
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
    logger.warn('failure', { error: error.message})
  }

}
