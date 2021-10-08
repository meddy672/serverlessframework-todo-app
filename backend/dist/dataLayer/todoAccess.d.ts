import { TodoItem } from '../interface/TodoItem';
import { TodoUpdate } from '../interface/TodoUpdate';
/**
 * Data object for managing todos
 */
export declare class TodoAccess {
    private readonly docClient;
    private readonly todosTable;
    private readonly s3;
    private readonly bucketName;
    private readonly urlExpiration;
    constructor(docClient?: any, todosTable?: string, s3?: any, bucketName?: string, urlExpiration?: string);
    /**
     * creates a new todo in the database
     */
    createTodo(todo: TodoItem): Promise<TodoItem>;
    /**
     * updates a todo by composite key and returns data for TodoUpdate
     */
    updateTodo(todo: TodoItem): Promise<TodoUpdate>;
    /**
     * deletes a todo from the database by composite key
     */
    deleteTodo(userId: string, todoId: string): Promise<void>;
    /**
     * gets all user todos by userId
     */
    getTodos(userId: string): Promise<TodoItem[]>;
    /**
     * get a todo from the database by composite key
     */
    getTodo(userId: string, todoId: string): Promise<TodoItem>;
    /**
     * replaces an old todo with a todo with attachmentUrl
     */
    todoAttachUrl(imageId: string, todo: TodoItem): Promise<void>;
    /**
     * generates presigned url and returns the url
     */
    getUploadUrl(imageId: string): Promise<string>;
}
//# sourceMappingURL=todoAccess.d.ts.map