import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, Matches, ValidateNested } from 'class-validator';
import * as mongoose from 'mongoose';
import { User } from 'src/users/users.schema';

export type TodoDocument = Todo & mongoose.Document;

@Schema()
@ObjectType()
export class Todo {
    @Field()
    _id: String;

    @Prop()
    @Field()
    @Matches(/^[A-Za-z0-9\s]+$/)
    @IsNotEmpty()
    item: string;

    @Prop()
    @Field()
    dueDate: Date;

    @Prop()
    @Field()
    completed: boolean;

    @Prop()
    @Field()
    authorGoogleId: string;
  
}

@ObjectType()
export class CreateTodoInput {
  @Prop()
  @Field()
  @Matches(/^[A-Za-z0-9\s]+$/)
  @IsNotEmpty()
  item: string;
  
  @Field()
  @IsNotEmpty()
  authorGoogleId: string;
}
  
export const TodoSchema = SchemaFactory.createForClass(Todo);

@InputType()
export class UpdateTodoInput {
    @Prop()
    @Field()
    @IsNotEmpty()
    id: string;

    @Prop()
    @Field()
    dueDate: Date;

}

@ObjectType()
export class CreateTodoResponse {

    @Field(() => User)
    @ValidateNested()
    user: User;

    @Field(() => Todo)
    @ValidateNested()
    todo: Todo;
}