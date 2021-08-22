import { createTodo } from '../../src/businessLogic/todo';
import { TodoAccess } from '../../src/dataLayer/todoAccess'
import { TodoItem } from '../../src/interface/TodoItem';
import { CreateTodoRequest } from '../../src/interface/CreateTodoRequest';

const createTodoResponse = {
    userId: '123456789',
    todoId: '1234',
    createdAt: 'New Date',
    name: 'myTodo',
    dueDate: 'new Date',
    done: false,
    attachmentUrl: ''
}

describe('Todo', () => {
    
    describe('CreateTodo', function (this: { response: TodoItem }) {
        beforeEach(async () => {

            spyOn(TodoAccess.prototype, 'createTodo').and.resolveTo(createTodoResponse)
            // spyOn Logger
            const request: CreateTodoRequest = {
                name: 'myTodo',
                dueDate: new Date().toISOString()
            }

            const userId = '1234567890'
            
            this.response = await createTodo(request, userId);
        });
        it(`should return a response`, () => {
            expect(this.response).toBeDefined()
        })
        it(`should return a todo`, () => {
            expect(this.response).toEqual(createTodoResponse)
        })
    })

    describe('DeleteTodo', () => { })

    describe('GetTodos', () => { })

    describe('UpdateTodo', () => { })

    describe('GenerateUploadUrl', () => { })
})