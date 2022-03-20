import { Field, ObjectType } from "@nestjs/graphql";
import { Journal } from "src/journal/journal.schema";
import { User } from "src/users/users.schema";

@ObjectType()
export class CreateJournalResponse{

    @Field(() => User)
    user: User;

    @Field(() => Journal)
    journal: Journal;
}