import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Todo, TodoDocument, UpdateTodoInput } from './todo.schema';
import { UsersService } from 'src/users/users.service';
import { Model } from 'mongoose';

@Injectable()
export class TodoService {
    constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>, private usersService: UsersService) {}

    async findTodoByAuthorIndex(googleId: string, idx: number) {
        return await this.todoModel.find({ authorGoogleId: googleId }).sort({}).skip(idx*10).limit(10).lean();
    }

    async findTodoByAuthor(googleId: string) {
        return await this.todoModel.find({ authorGoogleId: googleId }).sort({}).lean();
    } 

    async findTodoById(id: String) {
        return await this.todoModel.findOne({ _id: id }).lean();
    } 

    async markComplete(id: String){
        //we also turn off notifier here
        let todo = await this.todoModel.findOneAndUpdate({ _id: id }, {completed : true, dueDate : null}).lean();
        return {...todo, completed: true, dueDate : null};
    }
    
    async markIncomplete(id: String){
        let todo = await this.todoModel.findOneAndUpdate({ _id: id }, {completed : false}).lean();
        return {...todo, completed: false};
    }

    async setDueDate(updateTodoInput: UpdateTodoInput){
        let todo = await this.todoModel.findOneAndUpdate({ _id: updateTodoInput.id }, {dueDate : updateTodoInput.dueDate}).lean();
        return {...todo, dueDate : updateTodoInput.dueDate};
    }
    
    
    async createTodo(item: string, authorGoogleId: string ) {
        let newItem = await this.todoModel.create(item);
        let user = await this.usersService.findOne(authorGoogleId);
        newItem.completed = false;
        newItem.dueDate = null;
        let res = await newItem.save();
        if (res && user) {
            user.todoCount++;
        }
        return newItem;
    }
    
    async deleteTodo(googleId: string, id: String) {
        let res = await this.todoModel.deleteOne({ _id: id }).lean();
        let user = await this.usersService.findOne(googleId);
        if (res && user) { 
            user.todoCount--;
            return true; 
        }
        return false;
    }

}
