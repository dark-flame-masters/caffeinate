import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Todo, TodoDocument } from './todo.schema';
import { Model } from 'mongoose';

@Injectable()
export class TodoService {
    constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

    async findTodoByAuthorIndex(username: string, idx: number) {
        return await this.todoModel.find({ author: username }).sort({dueDate: -1}).skip(idx).limit(1).findOne();
    }

    async findTodoByAuthor(username: string) {
        return await this.todoModel.find({ author: username }).sort({dueDate: -1}).lean();
    } 

    async findTodoById(id: String) {
        return await this.todoModel.findOne({ _id: id }).lean();
    } 

    async markComplete(id){
        //we also turn off notifier here
        let todo = await this.todoModel.findOneAndUpdate({ _id: id }, {completed : true, notifyMe : false}).lean();
        return {...todo, completed: true, notifyMe : false};
    }
    
    async markIncomplete(id){
        let todo = await this.todoModel.findOneAndUpdate({ _id: id }, {completed : false}).lean();
        return {...todo, completed: false};
    }

    async notifyMeOn(id){
        let todo = await this.todoModel.findOneAndUpdate({ _id: id }, {notifyMe : true}).lean();
        return {...todo, notifyMe : true};
    }

    async notifyMeOff(id){
        let todo = await this.todoModel.findOneAndUpdate({ _id: id }, {notifyMe : false}).lean();
        return {...todo, notifyMe: false};
    }
    
    async createTodo(input: { item: string; dueDate: Date; author: string; }) {
        let newItem = await this.todoModel.create(input);
        newItem.completed = false;
        newItem.notifyMe = false;
        await newItem.save();
        return newItem;
    }
    
    async deleteTodo(id) {
        let res = await this.todoModel.deleteOne({ _id: id }).lean();
        if(res) { return true; }
        return false;
        //do I need to return anything?
    }

}
