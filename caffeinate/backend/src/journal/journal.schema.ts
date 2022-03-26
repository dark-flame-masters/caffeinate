import { Field, ObjectType, ID, InputType, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber, Matches } from 'class-validator';
import * as mongoose from 'mongoose';
import { User } from 'src/users/users.schema';

export type JournalDocument = Journal & mongoose.Document;

@Schema()
@ObjectType()
export class Journal {
    @Field(() => Int)
    _id: number;
  
    @Prop()
    @Field()
    content: string;

    @Prop()
    @Field()
    date: Date;

    /*@Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    @Field(() => User)
    author: User | number;*/
    @Prop()
    @Field()
    author: string;
  
}
  
export const JournalSchema = SchemaFactory.createForClass(Journal);

@InputType()
export class CreateJournalInput {
  @Field()
  @IsNotEmpty()
  @Matches(/^[\w\s\-':()!.,;?😁🙂😕😞😭😡]+$/) // to avoid front end injection
  content: string;
  
  @Field()
  @IsNotEmpty()
  @Matches(/^[\w\-]+$/)
  author: string;
}

@InputType()
export class FindJournalInput {

  @Field()
  @IsNotEmpty()
  @Matches(/^[\w\-]+$/)
  author: string;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  index: number;
}