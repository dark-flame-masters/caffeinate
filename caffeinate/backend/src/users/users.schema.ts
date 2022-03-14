import { Field, ObjectType, ID, InputType, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = User & mongoose.Document;

@Schema()
@ObjectType()
export class User {
    @Field(() => Int)
    _id: number;
  
    @Prop()
    @Field()
    username: string;

    @Prop()
    @Field()
    password: string;
  
}
  
export const UserSchema = SchemaFactory.createForClass(User);

@InputType()
export class CreateUserInput {
  @Field()
  username: string;
}