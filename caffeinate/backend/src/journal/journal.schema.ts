import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber, Matches } from 'class-validator';
import * as mongoose from 'mongoose';

export type JournalDocument = Journal & mongoose.Document;

@Schema()
@ObjectType()
export class Journal {
    @Field()
    _id: string;
  
    @Prop()
    @Field()
    @Matches(/^[\w\s\-':()!.,;?😁🙂😕😞😭😡]+$/)
    content: string;

    @Prop()
    @Field()
    date: Date;

    @Prop()
    @Field()
    sentiment: string;

    @Prop()
    @Field()
    authorGoogleId: string;
  
}
  
export const JournalSchema = SchemaFactory.createForClass(Journal);

@ObjectType()
export class CreateJournalInput {
  @Field()
  @IsNotEmpty()
  @Matches(/^[\w\s\-':()!.,;?😁🙂😕😞😭😡]+$/) // to avoid front end injection
  content: string;
  
  @Field()
  @IsNotEmpty()
  authorGoogleId: string;
}
