import { Field, InputType } from "@nestjs/graphql";
//import { User } from "src/users/entities/user.entity";
import { User } from "src/users/users.schema";

@InputType()
export class LoginUserInput{
    @Field()
    username: string;

    @Field()
    password: string;
}