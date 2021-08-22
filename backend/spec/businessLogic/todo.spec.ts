import { createTodo } from '../../src/businessLogic/todo'
import { createLogger } from '../../src/utils/logger'
import { TodoAccess } from '../../src/dataLayer/todoAccess'
import { TodoItem } from '../../src/interface/TodoItem'
import { CreateTodoRequest } from '../../src/interface/CreateTodoRequest'

const todo = {
    userId: '123456789',
    todoId: '1234',
    createdAt: 'New Date',
    name: 'myTodo',
    dueDate: 'new Date',
    done: false,
    attachmentUrl: ''
}

describe('Todo', () => {
    
    describe('CreateTodo', function (this: { response: TodoItem, logger: any }) {
        beforeEach(async () => {

            this.logger = createLogger('todoAccess')

            spyOn(TodoAccess.prototype, 'createTodo').and.resolveTo(todo)

            spyOn(this.logger, 'info')
            
            const request: CreateTodoRequest = {
                name: 'myTodo',
                dueDate: new Date().toISOString()
            }

            const userId = '1234567890'
            
            this.response = await createTodo(request, userId)
            this.logger.info('Creating todo', todo)
        });
        it(`should return a todo as a response`, () => {
            expect(this.response).toBeDefined()
            expect(this.response).toEqual(todo)
        })
        it(`should call logger once with 'Creating todo'`, () => {
            expect(this.logger.info).toHaveBeenCalledOnceWith('Creating todo',todo)
        })
    })

    describe('DeleteTodo', () => { })

    describe('GetTodos', () => { })

    describe('UpdateTodo', () => { })

    describe('GenerateUploadUrl', () => { })
})