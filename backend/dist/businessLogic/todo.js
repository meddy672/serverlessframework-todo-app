var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as uuid from 'uuid';
import { TodoAccess } from '../dataLayer/todoAccess';
const todoAccess = new TodoAccess();
/**
 * create a new todo requires userId and CreateTodoRequst
 */
export function createTodo(newTodo, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const timestamp = new Date().toISOString();
        const todoId = uuid.v4().toString();
        return yield todoAccess.createTodo(Object.assign({ todoId: todoId, userId: userId, createdAt: timestamp, done: false, attachmentUrl: '' }, newTodo));
    });
}
/**
 * update a todo requires todoId, userId, UpdateTodoRequest
 */
export function updateTodo(todo, userId, todoId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield todoAccess.updateTodo({
            todoId: todoId,
            userId: userId,
            name: todo.name,
            dueDate: todo.dueDate,
            done: todo.done,
            createdAt: new Date().toISOString()
        });
    });
}
/**
 * delete a todo requires userId and todoId
 */
export function deleteTodo(userId, todoId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield todoAccess.deleteTodo(userId, todoId);
    });
}
/**
 * get all user todos by userId
 */
export function getTodos(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield todoAccess.getTodos(userId);
    });
}
/**
 * creates an url for a todo requires userId and stringId
 */
export function generateUploadUrl(userId, todoId) {
    return __awaiter(this, void 0, void 0, function* () {
        const imageId = uuid.v4().toString();
        const url = yield todoAccess.getUploadUrl(imageId);
        const todo = yield todoAccess.getTodo(userId, todoId);
        yield todoAccess.todoAttachUrl(imageId, {
            userId,
            todoId,
            name: todo.name,
            dueDate: todo.dueDate,
            createdAt: todo.createdAt,
            done: todo.done,
        });
        return { url, todo };
    });
}
//# sourceMappingURL=todo.js.map