import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { CreateTodoRequest } from '../../interface/CreateTodoRequest'
import { createTodo } from '../../businessLogic/todo'
import { TodoItem } from '../../interface/TodoItem'
const logger = createLogger('Create Todo')

/**
 * create a new todo in the database
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
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
  logger.info('Create Todo Request', { newTodo, userId })
  try {
    const todo: TodoItem = await createTodo(newTodo, userId)
    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ todo })
    }
  } catch (error) {
    logger.warn('Failed To Create Todo', { error: error.message})
  }
}
