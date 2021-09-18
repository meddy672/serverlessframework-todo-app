import { createTodo, deleteTodo, getTodos, updateTodo, generateUploadUrl } from '../../src/businessLogic/todo'
import { createLogger } from '../../src/utils/logger'
import { TodoAccess } from '../../src/dataLayer/todoAccess'
import { TodoItem } from '../../src/interface/TodoItem'
import { CreateTodoRequest } from '../../src/interface/CreateTodoRequest'
import { UpdateTodoRequest } from '../../src/interface/UpdateTodoRequest'

const todo = {
    userId: '123456789',
    todoId: '1234',
    createdAt: 'New Date',
    name: 'myTodo',
    dueDate: 'new Date',
    done: false,
    attachmentUrl: ''
}

const updatedTodo = {

    name: 'myTodo',
    dueDate: 'A new todo time',
    done: true,

}

const todos = [
     {
        userId: '123456789',
        todoId: '1234',
        createdAt: 'New Date',
        name: 'myTodo',
        dueDate: 'new Date',
        done: false,
        attachmentUrl: ''
    },
    {
        userId: '123456789',
        todoId: '1234',
        createdAt: 'New Date',
        name: 'myTodo',
        dueDate: 'new Date',
        done: false,
        attachmentUrl: 'http:placehold.it/300'
    },
]

const generatUploadUrlResponse = {
    userId: '123456789',
    todoId: '1234',
    createdAt: 'New Date',
    name: 'myTodo',
    dueDate: 'new Date',
    done: false,
}
let imageUrl: string;
describe('Todo', function (this: { response: any, todos: TodoItem[], logger: any, notTodo: any, error: Error }) {

    describe('CreateTodo', () => {
        beforeEach(async () => {

            this.logger = createLogger('todoAccess')

            spyOn(TodoAccess.prototype, 'createTodo').and.resolveTo(todo)

            spyOn(this.logger, 'info')

            const request: CreateTodoRequest = {
                name: 'myTodo',
                dueDate: new Date().toISOString()
            }

            this.notTodo = {
                userId: '123456789',
                todoId: '1234',
                createdAt: 'New Date',
                name: 'myTodo',
                dueDate: 'new Date',
                done: false,
            }
            try {
                this.response = await createTodo(request, todo.userId)
                this.logger.info('Creating todo', todo)
            } catch (e) {
                this.error = e
            }
        });
        afterEach(() => {
            this.response = undefined
         })
        it(`should return a todo as a response`, () => {
            expect(this.response).toBeDefined()
            expect(this.response).toEqual(todo)
            expect(this.response).not.toBe(this.notTodo)
        })
        it(`should not throw an error`, () => {
            expect(this.error).toBeUndefined()
        })
        it(`should call 'TodoAccess.createTodo' once`, () => {
            expect(TodoAccess.prototype.createTodo).toHaveBeenCalledTimes(1)
        })
        it(`should call logger once with 'Creating todo'`, () => {
            expect(this.logger.info).toHaveBeenCalledOnceWith('Creating todo', todo)
        })
    })

    describe('DeleteTodo', () => {
        beforeEach(async () => {

            this.logger = createLogger('todoAccess')

            spyOn(TodoAccess.prototype, 'deleteTodo').and.resolveTo()

            spyOn(this.logger, 'info')

            const { todoId, userId } = todo


            try {
                await deleteTodo(todoId, userId)
                this.logger.info('Deleting todo', { userId, todoId })
            } catch (e) {
                this.error = e
            }
        })
        it(`should not return a todo`, () => {
            expect(this.response).toBeUndefined()
        })
        it(`should call 'deleteTodo' once`, () => {
            expect(TodoAccess.prototype.deleteTodo).toHaveBeenCalledOnceWith(todo.todoId, todo.userId)
        })
        it(`should not throw a error`, () => {
            expect(this.error).toBeUndefined()
        })
        it(`should call logger once with 'Deleting todo'`, () => {
            expect(this.logger.info).toHaveBeenCalledOnceWith('Deleting todo', { userId: todo.userId, todoId: todo.todoId })
        })
    })

    describe('GetTodos', () => {
        beforeEach(async () => {

            this.logger = createLogger('todoAccess')

            spyOn(TodoAccess.prototype, 'getTodos').and.resolveTo(todos)

            spyOn(this.logger, 'info')

            const { userId } = todo


            try {
                this.todos = await getTodos(todo.userId)
                this.logger.info('Getting todos', userId)
            } catch (e) {
                this.error = e
            }
        })
        it(`should return an array of 'todos' `, () => {
            expect(this.todos).toEqual(todos)
        })
        it(`should call 'getTodos' once`, () => {
            expect(TodoAccess.prototype.getTodos).toHaveBeenCalledOnceWith(todo.userId)
        })
        it(`should not throw a error`, () => {
            expect(this.error).toBeUndefined()
        })
        it(`should call logger once with 'Deleting todo'`, () => {
            expect(this.logger.info).toHaveBeenCalledOnceWith('Getting todos', todo.userId)
        })
    })

    describe('UpdateTodo', () => {
        beforeEach(async () => {

            this.logger = createLogger('todoAccess')

            spyOn(TodoAccess.prototype, 'updateTodo').and.resolveTo(updatedTodo)

            spyOn(this.logger, 'info')

            const request: UpdateTodoRequest = {
                name: todo.name,
                dueDate: 'A new todo time',
                done: true
            }

            try {
                this.response = await updateTodo(request, todo.userId, todo.todoId)
                this.logger.info('Updating todo', updatedTodo)
            } catch (e) {
                this.error = e
            }
        })
        afterEach(() => {

        })
        it(`should return an 'updatedTodo' `, () => {
            expect(this.response).toEqual(updatedTodo)
        })
        it(`should call 'updateTodo' once`, () => {
            expect(TodoAccess.prototype.updateTodo).toHaveBeenCalledTimes(1)
        })
        it(`should not throw a error`, () => {
            expect(this.error).toBeUndefined()
        })
        it(`should call logger once with 'Updating todo'`, () => {
            expect(this.logger.info).toHaveBeenCalledOnceWith('Updating todo', updatedTodo)
        })
    })

    describe('GenerateUploadUrl', () => {
        beforeEach(async() => {
            this.logger = createLogger('TodoAccess')

            spyOn(TodoAccess.prototype, 'getUploadUrl').and.resolveTo('http://localhost')

            spyOn(TodoAccess.prototype, 'getTodo').and.resolveTo(generatUploadUrlResponse)

            spyOn(TodoAccess.prototype, 'todoAttachUrl')

            spyOn(this.logger, 'info')

            try {
                const { url, todo } = await generateUploadUrl('123456789', '1234')

                this.response = todo
                imageUrl = url
             } catch (e) {
                this.error = e
            } 

            this.logger.info('Attaching Url to Todo', todo)
        })
        it(`should return 'url' and 'todo' ()`, () => {
            expect(imageUrl).toBeDefined()
            expect(this.response).toBeDefined()
        })
        it(`should return a todo that matches 'todoWithImage'`, () => {
            expect(this.response).toEqual(generatUploadUrlResponse)
        })
        it(`should not throw an error`, () => {
            expect(this.error).toBeUndefined()
        })
        it(`should call 'getTodo' once`, () => {
            expect(TodoAccess.prototype.getTodo).toHaveBeenCalledOnceWith(todo.userId, todo.todoId)
        })
        it(`should call 'getUploadUrl' once`, () => {
            expect(TodoAccess.prototype.getUploadUrl).toHaveBeenCalledTimes(1)
        })
        it(`should call 'logger info' twice`, () => {
            expect(this.logger.info).toHaveBeenCalledTimes(1)
        })
     })
})