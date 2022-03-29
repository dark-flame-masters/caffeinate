import { Field, ObjectType, ID, InputType, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { IsAlphanumeric } from 'class-validator'

export type UserDocument = User & mongoose.Document;

@Schema()
@ObjectType()
export class User {
    @Field()
    _id: string;

    @Prop()
    @Field()
    googleId: string;

    @Prop()
    @Field()
    email: string;

    @Prop()
    @Field()
    firstName: string;

    @Prop()
    @Field()
    treeDate: Date;

    @Prop()
    @Field()
    treeStatus: number; //in [0, 1, 2, 3]

    @Prop()
    @Field()
    journalCount: number;

    @Prop()
    @Field()
    surveyCount: number;

    @Prop()
    @Field()
    journalDict: string; // a dictionary in json
  
}
  
export const UserSchema = SchemaFactory.createForClass(User);

@ObjectType()
export class WordDictionaryResponse{

    @Field()
    text: string;

    @Field()
    value: number;
}