import * as AWSMock from 'aws-sdk-mock'
import * as AWS from 'aws-sdk'
import { TodoAccess } from '../../src/dataLayer/todoAccess'

const todo = {
    userId: '123456789',
    todoId: '1234',
    createdAt: 'New Date',
    name: 'myTodo',
    dueDate: 'new Date',
    done: false,
    attachmentUrl: ''
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
        createdAt: '8/25/2021',
        name: 'myTodo Again',
        dueDate: '8/25/2021',
        done: true,
        attachmentUrl: 'http://example.com/'
    }
]

const todoUpdate = {
    name: 'myTodo',
    dueDate: 'new Date',
    done: false,
}

describe('TodoAccess', function (this: {response: any, logger: any}) {

    describe('CreateTodo', () => {
        beforeEach(async () => {

            AWSMock.setSDKInstance(AWS);
            AWSMock.mock('DynamoDB.DocumentClient', 'put', function (_, callback){
                callback(null, todo);
            });

            const todoAccess = new TodoAccess()

            this.response = await todoAccess.createTodo(todo)
        })
        afterEach(() => {
            AWSMock.restore('DynamoDB.DocumentClient', 'put')
        })
        it(`should return a 'todo' as a response`, () => {
            expect(this.response).toBeDefined()
            expect(this.response).toEqual(todo)
        })
    })
    
    describe('UpdateTodo', () => {
        beforeEach(async () => {

            AWSMock.setSDKInstance(AWS);
            AWSMock.mock('DynamoDB.DocumentClient', 'update', function (_, callback){
                callback(null, todoUpdate);
            });

            const todoAccess = new TodoAccess()

            this.response = await todoAccess.updateTodo(todo)
        })
        afterEach(() => {
            AWSMock.restore('DynamoDB.DocumentClient', 'update')
        })
        it(`should return a 'todoUpdate' as a response`, () => {
            expect(this.response).toBeDefined()
            expect(this.response).toEqual(todoUpdate)
        })
    })
    
    describe('DeleteTodo', () => {
        beforeEach(async () => {

            AWSMock.setSDKInstance(AWS);
            AWSMock.mock('DynamoDB.DocumentClient', 'delete', function (_, callback){
                callback(null, {});
            });

            const todoAccess = new TodoAccess()

            this.response = await todoAccess.deleteTodo(todo.userId, todo.todoId)
        })
        afterEach(() => {
            AWSMock.restore('DynamoDB.DocumentClient', 'delete')
        })
        it(`should delete a todo`, () => {
            expect(this.response).toBeUndefined()
        })
    })
    describe('GetTodos', () => {
        beforeEach(async () => {

            AWSMock.setSDKInstance(AWS);
            AWSMock.mock('DynamoDB.DocumentClient', 'query', function (_, callback) {
                callback(null, todos);
            });

            const todoAccess = new TodoAccess()

            this.response = await todoAccess.getTodos(todo.userId)
        })
        afterEach(() => {
            AWSMock.restore('DynamoDB.DocumentClient', 'query')
        })
        it(`should return an array of 'todos'`, () => {
            expect(this.response).toBeDefined()
            expect(this.response).toEqual(todos)
        })
     })
})