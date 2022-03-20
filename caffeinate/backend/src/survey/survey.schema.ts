import { Field, ObjectType, ID, InputType, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, Matches } from 'class-validator';
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
    @Matches(/([A-Za-z0-9\s\-':()!.,;?])+/g)
    answer1: string;

    @Prop()
    @Field()
    @Matches(/([A-Za-z0-9\s\-':()!.,;?])+/g)
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
    @IsNotEmpty()
    rate: number;

    @Field()
    @IsNotEmpty()
    @Matches(/([A-Za-z0-9\s\-':()!.,;?])+/)
    answer1: string;

    @Field()
    @IsNotEmpty()
    @Matches(/([A-Za-z0-9\s\-':()!.,;?])+/)
    answer2: string;

    @Field()
    @IsNotEmpty()
    sentiment: string;
  
    @Field()
    @IsNotEmpty()
    author: string;
}

@InputType()
export class FindSurveyInput {

  @Field()
  author: string;

  @Field()
  index: number;
}