import { BadRequestException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { validate } from 'class-validator';
import { GoogleAuthGuard } from 'src/auth/google.guard';
import { GoogleUserInfo, UserInfo } from 'src/auth/user-info.param';
import { NotifierService } from 'src/notifier/notifier.service';
import { UsersService } from 'src/users/users.service';
import { CreateTodoInput, Todo, UpdateTodoInput} from './todo.schema';
import { TodoService } from './todo.service';

@Resolver()
export class TodoResolver {
    constructor(private readonly todoService: TodoService, private readonly usersService: UsersService, private readonly notifierService: NotifierService, private readonly configService: ConfigService) {}

  @Query(() => [Todo])
  @UseGuards(GoogleAuthGuard)
  async findTodoByAuthor(@GoogleUserInfo() userInfo: UserInfo) {
    return await this.todoService.findTodoByAuthor(userInfo.googleId);
  }

  @Query(() => [Todo], {nullable: true})
  @UseGuards(GoogleAuthGuard)
  async findTodoByAuthorIndex(@Args('index') index: number, @GoogleUserInfo() userInfo: UserInfo) {
    return await this.todoService.findTodoByAuthorIndex(userInfo.googleId, index);
  }

  @Mutation(() => Todo)
  @UseGuards(GoogleAuthGuard)
  async createTodo(@Args('input') todo: string, @GoogleUserInfo() userInfo: UserInfo) {

    let newItem = new CreateTodoInput()
    newItem.authorGoogleId = userInfo.googleId;
    newItem.item = todo;

    const errors = await validate(newItem)
    if (errors.length > 0){
        throw new BadRequestException();
    }
    else{
      newItem = await this.todoService.createTodo({item: todo, authorGoogleId: userInfo.googleId});
      return newItem;
    }
  }

  @Mutation(() => Boolean)
  @UseGuards(GoogleAuthGuard)
  async deleteTodo(@Args('id') id: string, @GoogleUserInfo() userInfo: UserInfo) {
    const todo = await this.todoService.findTodoById(id);
    if (todo.authorGoogleId !== userInfo.googleId) throw new UnauthorizedException();
    // delete the notifier iff not completed and not pass due date
    if(todo.dueDate !== null && todo.completed === false && todo.dueDate.valueOf() - new Date().valueOf() > 600000){
        await this.notifierService.deleteNotifierByTodo(id);
    }
    return await this.todoService.deleteTodo(id);
  }

  @Mutation(() => Todo)
  @UseGuards(GoogleAuthGuard)
  async completeTodo(@Args('id') id: string, @GoogleUserInfo() userInfo: UserInfo) {
    const todo = await this.todoService.findTodoById(id);
    if (todo.authorGoogleId !== userInfo.googleId) throw new UnauthorizedException();
    // turn off the notifier iff not pass due date
    if(todo.dueDate !== null && todo.dueDate.valueOf() - new Date().valueOf() > 600000){
        await this.notifierService.deleteNotifierByTodo(todo._id);
    }
    return await this.todoService.markComplete(todo._id);
  }

  @Mutation(() => Todo)
  @UseGuards(GoogleAuthGuard)
  async incompleteTodo(@Args('id') id: string, @GoogleUserInfo() userInfo: UserInfo) {
    const todo = await this.todoService.findTodoById(id);
    if (todo.authorGoogleId !== userInfo.googleId) throw new UnauthorizedException();
    return await this.todoService.markIncomplete(todo._id);
  }

  @Mutation(() => Todo)
  @UseGuards(GoogleAuthGuard)
  async setDueDate(@Args('input') updateTodoInput: UpdateTodoInput, @GoogleUserInfo() userInfo: UserInfo) {
    let todo = await this.todoService.findTodoById(updateTodoInput.id);
    if (todo.authorGoogleId !== userInfo.googleId) throw new UnauthorizedException();
    // turn on the notifier iff not completed
    if(todo.completed === false){
      todo = await this.todoService.setDueDate(updateTodoInput);
      await this.notifierService.createNotifierByTodo(todo, userInfo.email);//should be user.email
    }
    return todo;
  }

  
}
