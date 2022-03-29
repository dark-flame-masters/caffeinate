import { Field, ObjectType, InputType, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, Matches } from 'class-validator';
import * as mongoose from 'mongoose';
import { User } from 'src/users/users.schema';

export type JournalDocument = Journal & mongoose.Document;

@Schema()
@ObjectType()
export class Journal {
    @Field()
    _id: string;
  
    @Prop()
    @Field()
    content: string;

    @Prop()
    @Field()
    date: Date;

    @Prop()
    @Field()
    authorGoogleId: string;
  
}
  
export const JournalSchema = SchemaFactory.createForClass(Journal);

@InputType()
export class CreateJournalInput {
  @Field()
  @IsNotEmpty()
  @Matches(/[A-Za-z0-9\s\-':()!.,;?]+/) // to avoid front end injection
  content: string;
  
  @Field()
  @IsNotEmpty()
  authorGoogleId: string;
}

@InputType()
export class FindJournalInput {

  @Field()
  @IsNotEmpty()
  @Matches(/[A-Za-z0-9\s\-':()!.,;?]+/)
  authorGoogleId: string;

  @Field()
  @IsNotEmpty()
  index: number;
}