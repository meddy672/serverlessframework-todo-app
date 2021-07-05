import 'source-map-support/register'
import { getUserId } from '../utils'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
import { updateTodo } from '../../businessLogic/todo'
import { TodoUpdate } from '../../models/TodoUpdate'

const logger = createLogger('Update Todo')

/**
 * updates the todo
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId: string = event.pathParameters.todoId
  const userId: string = getUserId(event)
  const todoBody: UpdateTodoRequest = JSON.parse(event.body)
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
  
  logger.info('Updating todo', { todoBody, userId, todoId })
  try {
    const todo: TodoUpdate = await updateTodo(todoBody, userId, todoId)
    if (todo) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(todo)
      }
    }
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: ''
    }
  } catch (error) {
    logger.warn('Failed to update todo', { error: error.message})
  }
}
