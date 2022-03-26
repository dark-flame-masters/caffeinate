import { UnauthorizedException } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateTodoInput, FindTodoInput, Todo, UpdateTodoInput } from './todo.schema';
import { TodoService } from './todo.service';

@Resolver()
export class TodoResolver {
    constructor(private readonly todoService: TodoService) {}

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
    return await this.todoService.createTodo({...todo});
  }

  @Mutation(() => Boolean)
  async deleteTodo(@Args('input') todo: UpdateTodoInput, @Context() context: { req: { session: { username: string; }; }; }) {
    if(context.req.session === undefined || context.req.session.username != todo.author) {throw new UnauthorizedException();}
    return await this.todoService.deleteTodo(todo._id);
  }

  @Mutation(() => Todo)
  async completeTodo(@Args('input') todo: UpdateTodoInput, @Context() context: { req: { session: { username: string; }; }; }) {
    if(context.req.session === undefined || context.req.session.username != todo.author) {throw new UnauthorizedException();}
    return await this.todoService.markComplete(todo._id);
  }

  @Mutation(() => Todo)
  async incompleteTodo(@Args('input') todo: UpdateTodoInput, @Context() context: { req: { session: { username: string; }; }; }) {
    if(context.req.session === undefined || context.req.session.username != todo.author) {throw new UnauthorizedException();}
    return await this.todoService.markIncomplete(todo._id);
  }
}
