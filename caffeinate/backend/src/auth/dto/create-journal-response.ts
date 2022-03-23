import { Field, ObjectType } from "@nestjs/graphql";
import { ValidateNested } from "class-validator";
import { Journal } from "src/journal/journal.schema";
import { User } from "src/users/users.schema";

@ObjectType()
export class CreateJournalResponse{

    @Field(() => User)
    @ValidateNested()
    user: User;

    @Field(() => Journal)
    @ValidateNested()
    journal: Journal;
}