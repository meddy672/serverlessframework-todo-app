import * as uuid from 'uuid'
import { CreateTodoRequest } from '../interface/CreateTodoRequest'
import { UpdateTodoRequest } from '../interface/UpdateTodoRequest'
import { TodoItem } from '../interface/TodoItem'
import { TodoUpdate } from '../interface/TodoUpdate'
import { TodoAccess } from '../dataLayer/todoAccess'

const todoAccess = new TodoAccess()

/**
 * create a new todo requires userId and CreateTodoRequst
 */
export async function createTodo(newTodo: CreateTodoRequest, userId: string): Promise<TodoItem> {
    const timestamp: string = new Date().toISOString()
    const todoId: string = uuid.v4().toString()
    return await todoAccess.createTodo({
        todoId: todoId,
        userId: userId,
        createdAt: timestamp,
        done: false,
        attachmentUrl: '',
        ...newTodo
    })
}




/**
 * update a todo requires todoId, userId, UpdateTodoRequest
 */
export async function updateTodo(todo: UpdateTodoRequest, userId: string, todoId: string): Promise<TodoUpdate> {
    return await todoAccess.updateTodo({
        todoId: todoId,
        userId: userId,
        name: todo.name,
        dueDate: todo.dueDate,
        done: todo.done,
        createdAt: new Date().toISOString()
    })
}


    

/**
 * delete a todo requires userId and todoId
 */
export async function deleteTodo(userId: string, todoId: string): Promise<void> {
     await todoAccess.deleteTodo(userId, todoId)
}




/**
 * get all user todos by userId
 */
export async function getTodos(userId: string): Promise<TodoItem[]> {
    return await todoAccess.getTodos(userId)
}




/**
 * creates an url for a todo requires userId and stringId
 */
export async function generateUploadUrl(userId: string, todoId: string): Promise<{url: string, todo: TodoItem}> {
    const imageId: string = uuid.v4().toString()
    const url: string = await todoAccess.getUploadUrl(imageId)
    const todo: TodoItem = await todoAccess.getTodo(userId, todoId)
    await todoAccess.todoAttachUrl(imageId, {
        userId,
        todoId,
        name: todo.name,
        dueDate: todo.dueDate,
        createdAt: todo.createdAt,
        done: todo.done,
    })
    return { url, todo }
}
