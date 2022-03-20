import { Field, ObjectType, ID, InputType, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { IsAlphanumeric } from 'class-validator'

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

    @Prop()
    @Field()
    treeDate: Date;

    @Prop()
    @Field()
    treeStatus: number; //in [0, 1, 2, 3]
  
}
  
export const UserSchema = SchemaFactory.createForClass(User);

@InputType()
export class CreateUserInput {
  @Field()
  @IsAlphanumeric()
  username: string;
}