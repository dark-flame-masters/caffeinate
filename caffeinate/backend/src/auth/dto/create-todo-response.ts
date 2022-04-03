import { Field, ObjectType } from "@nestjs/graphql";
import { ValidateNested } from "class-validator";
import { User } from "src/users/users.schema";
import { Todo } from "src/todo/todo.schema";

@ObjectType()
export class CreateTodoResponse {

    @Field(() => User)
    @ValidateNested()
    user: User;

    @Field(() => Todo)
    @ValidateNested()
    todo: Todo;
}