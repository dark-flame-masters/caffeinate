import { Field, ObjectType, ID, InputType, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, Matches } from 'class-validator';
import * as mongoose from 'mongoose';

export type TodoDocument = Todo & mongoose.Document;

@Schema()
@ObjectType()
export class Todo {
    @Field()
    _id: String;

    @Prop()
    @Field()
    @Matches(/([A-Za-z0-9\s\-':()!.,;?])+/)
    item: string;

    @Prop()
    @Field()
    dueDate: Date;

    @Prop()
    @Field()
    completed: boolean;

    @Prop()
    @Field()
    @Matches(/([A-Za-z0-9\s\-':()!.,;?])+/)
    author: string;
  
}
  
export const TodoSchema = SchemaFactory.createForClass(Todo);

@InputType()
export class CreateTodoInput {
    @Prop()
    @Field()
    @Matches(/([A-Za-z0-9\s\-':()!.,;?])+/)
    item: string;

    @Prop()
    @Field()
    dueDate: Date;

    @Prop()
    @Field()
    @Matches(/([A-Za-z0-9\s\-':()!.,;?])+/)
    author: string;
}

@InputType()
export class FindTodoInput {

  @Field()
  @Matches(/([A-Za-z0-9\s\-':()!.,;?])+/)
  author: string;

  @Field()
  index: number;
}

@InputType()
export class UpdateTodoInput {
  @Field()
  _id: String;

  @Prop()
  @Field()
  @Matches(/([A-Za-z0-9\s\-':()!.,;?])+/)
  author: string;

}