import { Field, ObjectType, ID, InputType, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/users/users.schema';

export type SurveyDocument = Survey & mongoose.Document;

@Schema()
@ObjectType()
export class Survey {
    @Field()
    _id: number;
  
    @Prop()
    @Field()
    rate: number;

    @Prop()
    @Field()
    answer1: string;

    @Prop()
    @Field()
    answer2: string;

    @Prop()
    @Field()
    sentiment: string;

    @Prop()
    @Field()
    date: Date;

    @Prop()
    @Field()
    author: string;
  
}
  
export const SurveySchema = SchemaFactory.createForClass(Survey);

@InputType()
export class CreateSurveyInput {
    @Field()
    rate: number;

    @Field()
    answer1: string;

    @Field()
    answer2: string;

    @Field()
    sentiment: string;
  
    @Field()
    author: string;
}

@InputType()
export class FindSurveyInput {

  @Field()
  author: string;

  @Field()
  index: number;
}