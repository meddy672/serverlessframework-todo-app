var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import 'source-map-support/register';
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger';
import { updateTodo } from '../../businessLogic/todo';
const logger = createLogger('Update Todo');
/**
 * updates the todo
 */
export const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const todoId = event.pathParameters.todoId;
    const userId = getUserId(event);
    const todoBody = JSON.parse(event.body);
    if (!userId) {
        return {
            statusCode: 401,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'User is not authorized'
            })
        };
    }
    logger.info('Updating todo', { todoBody, userId, todoId });
    try {
        const todo = yield updateTodo(todoBody, userId, todoId);
        if (todo) {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(todo)
            };
        }
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: ''
        };
    }
    catch (error) {
        logger.warn('Failed to update todo', { error: error.message });
    }
});
//# sourceMappingURL=updateTodo.js.map