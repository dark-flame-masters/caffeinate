import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/users/users.schema";

@ObjectType()
export class LoginResponse{

    @Field(() => User)
    user: User;
}