import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber, Matches, ValidateNested } from 'class-validator';
import * as mongoose from 'mongoose';
import { User } from 'src/users/users.schema';

export type SurveyDocument = Survey & mongoose.Document;

@Schema()
@ObjectType()
export class Survey {
    @Field()
    _id?: string;
  
    @Prop()
    @Field()
    @IsNumber()
    rate: number;

    @Prop()
    @Field()
    @Matches(/^[A-Za-z0-9\s\-':()!.,;?]+$/)
    answer1: string;

    @Prop()
    @Field()
    @Matches(/^[A-Za-z0-9\s\-':()!.,;?]+$/)
    answer2: string;

    @Prop()
    @Field()
    date: Date;

    @Prop()
    @Field()
    authorGoogleId: string;
  
}
  
export const SurveySchema = SchemaFactory.createForClass(Survey);

@InputType()
export class CreateSurveyInput {
    @Field()
    @IsNotEmpty()
    @IsNumber()
    rate: number;

    @Field()
    @IsNotEmpty()
    @Matches(/^[A-Za-z0-9\s\-':()!.,;?]+$/)
    answer1: string;

    @Field()
    @IsNotEmpty()
    @Matches(/^[A-Za-z0-9\s\-':()!.,;?]+$/)
    answer2: string;
}

@ObjectType()
export class CreateSurveyResponse{

    @Field(() => User)
    @ValidateNested()
    user: User;

    @Field(() => Survey)
    @ValidateNested()
    survey: Survey;
}