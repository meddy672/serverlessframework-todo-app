import { CreateTodoRequest } from '../interface/CreateTodoRequest';
import { UpdateTodoRequest } from '../interface/UpdateTodoRequest';
import { TodoItem } from '../interface/TodoItem';
import { TodoUpdate } from '../interface/TodoUpdate';
/**
 * create a new todo requires userId and CreateTodoRequst
 */
export declare function createTodo(newTodo: CreateTodoRequest, userId: string): Promise<TodoItem>;
/**
 * update a todo requires todoId, userId, UpdateTodoRequest
 */
export declare function updateTodo(todo: UpdateTodoRequest, userId: string, todoId: string): Promise<TodoUpdate>;
/**
 * delete a todo requires userId and todoId
 */
export declare function deleteTodo(userId: string, todoId: string): Promise<void>;
/**
 * get all user todos by userId
 */
export declare function getTodos(userId: string): Promise<TodoItem[]>;
/**
 * creates an url for a todo requires userId and stringId
 */
export declare function generateUploadUrl(userId: string, todoId: string): Promise<{
    url: string;
    todo: TodoItem;
}>;
//# sourceMappingURL=todo.d.ts.map