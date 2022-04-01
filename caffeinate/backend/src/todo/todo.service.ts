import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Todo, TodoDocument, UpdateTodoInput } from './todo.schema';
import { Model } from 'mongoose';

@Injectable()
export class TodoService {
    constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

    async findTodoByAuthorIndex(googleId: string, idx: number) {
        return await this.todoModel.find({ authorGoogleId: googleId }).sort({dueDate: 1}).skip(idx).limit(1).findOne();
    }

    async findTodoByAuthor(googleId: string) {
        return await this.todoModel.find({ authorGoogleId: googleId }).sort({dueDate: 1}).lean();
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
    
    
    async createTodo(input: { item: string; authorGoogleId: string; }) {
        let newItem = await this.todoModel.create(input);
        newItem.completed = false;
        newItem.dueDate = null;
        await newItem.save();
        return newItem;
    }
    
    async deleteTodo(id: String) {
        let res = await this.todoModel.deleteOne({ _id: id }).lean();
        if(res) { return true; }
        return false;
    }

}
