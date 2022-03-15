import { Field, ObjectType } from "@nestjs/graphql";
//import { User } from "src/users/entities/user.entity";
import { User } from "src/users/users.schema";

@ObjectType()
export class LoginResponse{
    @Field()
    access_token: string;

    @Field(() => User)
    user: User;
}