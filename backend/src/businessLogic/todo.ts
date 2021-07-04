import * as uuid from 'uuid'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { TodoAccess } from '../dataLayer/todoAccess'

const todoAccess = new TodoAccess()

export async function createTodo(newTodo: CreateTodoRequest,
    userId: string): Promise<TodoItem> {
    const timestamp = new Date().toISOString()
    const todoId = uuid.v4().toString()

    return await todoAccess.createTodo({
        todoId: todoId,
        userId: userId,
        createdAt: timestamp,
        done: false,
        attachmentUrl: '',
        ...newTodo
    })
}

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
    

export async function deleteTodo(userId: string, todoId: string) {
    return await todoAccess.deleteTodo(userId, todoId)
}

export async function getTodos(userId: string) {
    return await todoAccess.getTodos(userId)
    
}
