import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotifierService } from 'src/notifier/notifier.service';
import { UsersService } from 'src/users/users.service';
import { CreateTodoInput, FindTodoInput, Todo, UpdateTodoInput } from './todo.schema';
import { TodoService } from './todo.service';

@Resolver()
export class TodoResolver {
    constructor(private readonly todoService: TodoService, private readonly usersService: UsersService, private readonly notifierService: NotifierService, private readonly configService: ConfigService) {}

  @Query(() => [Todo])
  async findTodoByAuthor(@Args('input') author : string, @Context() context: { req: { session: { username: string; }; }; }) {
    if(context.req.session === undefined || context.req.session.username != author) {throw new UnauthorizedException();}
    return await this.todoService.findTodoByAuthor(author);
  }

  @Query(() => Todo, {nullable: true})
  async findTodoByAuthorIndex(@Args('input') { author, index }: FindTodoInput, @Context() context: { req: { session: { username: string; }; }; }) {
    if(context.req.session === undefined || context.req.session.username != author) {throw new UnauthorizedException();}
    return await this.todoService.findTodoByAuthorIndex(author, index);
  }

  @Mutation(() => Todo)
  async createTodo(@Args('input') todo: CreateTodoInput, @Context() context: { req: { session: { username: string; }; }; }) {
    if(context.req.session === undefined || context.req.session.username != todo.author) {throw new UnauthorizedException();}
    let newItem = await this.todoService.createTodo({...todo});
    return newItem;
  }

  @Mutation(() => Boolean)
  async deleteTodo(@Args('input') todo: UpdateTodoInput, @Context() context: { req: { session: { username: string; }; }; }) {
    if(context.req.session === undefined || context.req.session.username != todo.author) {throw new UnauthorizedException();}
    // delete the notifier
    if((await this.todoService.findTodoById(todo._id)).notifyMe === true){
        await this.notifierService.deleteNotifierByTodo(todo._id);
    }
    return await this.todoService.deleteTodo(todo._id);
  }

  @Mutation(() => Todo)
  async completeTodo(@Args('input') todo: UpdateTodoInput, @Context() context: { req: { session: { username: string; }; }; }) {
    if(context.req.session === undefined || context.req.session.username != todo.author) {throw new UnauthorizedException();}
    // turn off the notifier
    if((await this.todoService.findTodoById(todo._id)).notifyMe === true){
        await this.notifierService.deleteNotifierByTodo(todo._id);
    }
    return await this.todoService.markComplete(todo._id);
  }

  @Mutation(() => Todo)
  async incompleteTodo(@Args('input') todo: UpdateTodoInput, @Context() context: { req: { session: { username: string; }; }; }) {
    if(context.req.session === undefined || context.req.session.username != todo.author) {throw new UnauthorizedException();}
    return await this.todoService.markIncomplete(todo._id);
  }

  @Mutation(() => Todo)
  async notifyMeOn(@Args('input') todo: UpdateTodoInput, @Context() context: { req: { session: { username: string; }; }; }) {
    if(context.req.session === undefined || context.req.session.username != todo.author) {throw new UnauthorizedException();}
    // turn on the notifier
    let user = await this.usersService.findOne(todo.author);
    let item = await this.todoService.findTodoById(todo._id);
    await this.notifierService.createNotifierByTodo(item, this.configService.get<string>('CLIENT_EMAIL'));//should be user.email
    return await this.todoService.notifyMeOn(todo._id);
  }

  @Mutation(() => Todo)
  async notifyMeOff(@Args('input') todo: UpdateTodoInput, @Context() context: { req: { session: { username: string; }; }; }) {
    if(context.req.session === undefined || context.req.session.username != todo.author) {throw new UnauthorizedException();}
    // turn off the notifier
    await this.notifierService.deleteNotifierByTodo(todo._id);
    return await this.todoService.notifyMeOff(todo._id);
  }
}
