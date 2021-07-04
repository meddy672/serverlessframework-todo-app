import * as uuid from 'uuid'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { TodoAccess } from '../dataLayer/todoAccess'

const todoAccess = new TodoAccess()

/**
 * 
 * @param newTodo 
 * @param userId 
 * @returns 
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
 * 
 * @param todo 
 * @param userId 
 * @param todoId 
 * @returns 
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
 * 
 * @param userId 
 * @param todoId 
 */
export async function deleteTodo(userId: string, todoId: string): Promise<void> {
     await todoAccess.deleteTodo(userId, todoId)
}




/**
 * 
 * @param userId 
 * @returns 
 */
export async function getTodos(userId: string): Promise<TodoItem[]> {
    return await todoAccess.getTodos(userId)
}




/**
 * 
 * @param userId 
 * @param todoId 
 * @returns 
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
