import { Field, ObjectType } from "@nestjs/graphql";
import { ValidateNested } from "class-validator";
import { User } from "src/users/users.schema";

@ObjectType()
export class LoginResponse{

    @Field(() => User)
    @ValidateNested()
    user: User;
}