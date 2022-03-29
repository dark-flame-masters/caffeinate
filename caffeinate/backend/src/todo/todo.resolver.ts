import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GoogleAuthGuard } from 'src/auth/google.guard';
import { GoogleUserInfo, UserInfo } from 'src/auth/user-info.param';
import { NotifierService } from 'src/notifier/notifier.service';
import { UsersService } from 'src/users/users.service';
import { CreateTodoInput, Todo, UpdateTodoInput } from './todo.schema';
import { TodoService } from './todo.service';

@Resolver()
export class TodoResolver {
    constructor(private readonly todoService: TodoService, private readonly usersService: UsersService, private readonly notifierService: NotifierService, private readonly configService: ConfigService) {}

  @Query(() => [Todo])
  @UseGuards(GoogleAuthGuard)
  async findTodoByAuthor(@GoogleUserInfo() userInfo: UserInfo) {
    return await this.todoService.findTodoByAuthor(userInfo.googleId);
  }

  @Query(() => Todo, {nullable: true})
  @UseGuards(GoogleAuthGuard)
  async findTodoByAuthorIndex(@Args('index') index: number, @GoogleUserInfo() userInfo: UserInfo) {
    return await this.todoService.findTodoByAuthorIndex(userInfo.googleId, index);
  }

  @Mutation(() => Todo)
  @UseGuards(GoogleAuthGuard)
  async createTodo(@Args('input') todo: CreateTodoInput, @GoogleUserInfo() userInfo: UserInfo) {
    let newItem = await this.todoService.createTodo({...todo, authorGoogleId: userInfo.googleId});
    return newItem;
  }

  @Mutation(() => Boolean)
  @UseGuards(GoogleAuthGuard)
  async deleteTodo(@Args('id') id: string, @GoogleUserInfo() userInfo: UserInfo) {
    const todo = await this.todoService.findTodoById(id);
    if (todo.authorGoogleId !== userInfo.googleId) throw new UnauthorizedException();
    // delete the notifier
    if(todo.notifyMe === true){
        await this.notifierService.deleteNotifierByTodo(id);
    }
    return await this.todoService.deleteTodo(id);
  }

  @Mutation(() => Todo)
  @UseGuards(GoogleAuthGuard)
  async completeTodo(@Args('id') id: string, @GoogleUserInfo() userInfo: UserInfo) {
    const todo = await this.todoService.findTodoById(id);
    if (todo.authorGoogleId !== userInfo.googleId) throw new UnauthorizedException();
    // turn off the notifier
    if(todo.notifyMe === true){
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
  async notifyMeOn(@Args('id') id: string, @GoogleUserInfo() userInfo: UserInfo) {
    const todo = await this.todoService.findTodoById(id);
    if (todo.authorGoogleId !== userInfo.googleId) throw new UnauthorizedException();
    // turn on the notifier
    let user = await this.usersService.findOne(todo.authorGoogleId);
    let item = await this.todoService.findTodoById(todo._id);
    await this.notifierService.createNotifierByTodo(item, userInfo.email);//should be user.email
    return await this.todoService.notifyMeOn(todo._id);
  }

  @Mutation(() => Todo)
  @UseGuards(GoogleAuthGuard)
  async notifyMeOff(@Args('id') id: string, @GoogleUserInfo() userInfo: UserInfo) {
    const todo = await this.todoService.findTodoById(id);
    if (todo.authorGoogleId !== userInfo.googleId) throw new UnauthorizedException();
    // turn off the notifier
    await this.notifierService.deleteNotifierByTodo(todo._id);
    return await this.todoService.notifyMeOff(todo._id);
  }
}
