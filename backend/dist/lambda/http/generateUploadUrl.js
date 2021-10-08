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
import { generateUploadUrl } from '../../businessLogic/todo';
const logger = createLogger('GenerateUrl');
/**
 * add an attachmentUrl to a todo
 */
export const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const todoId = event.pathParameters.todoId;
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
    logger.info('Caller event', event);
    try {
        const { url, todo } = yield generateUploadUrl(userId, todoId);
        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                newItem: todo,
                uploadUrl: url
            })
        };
    }
    catch (error) {
        logger.warn('Failed to generate url');
    }
});
//# sourceMappingURL=generateUploadUrl.js.map