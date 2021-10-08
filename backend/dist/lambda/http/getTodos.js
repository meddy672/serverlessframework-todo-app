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
import { getTodos } from '../../businessLogic/todo';
import { createLogger } from '../../utils/logger';
const logger = createLogger('Get Todos');
/**
 * get all users todos
 */
export const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    logger.info(event);
    const userId = getUserId(event);
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
    logger.info('Getting todos', { event, userId });
    try {
        const todos = yield getTodos(userId);
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                todos
            })
        };
    }
    catch (error) {
        logger.warn('failure', { error: error.message });
    }
});
//# sourceMappingURL=getTodos.js.map