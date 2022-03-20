import { ArgsType, Field, InputType } from "@nestjs/graphql";
import { IsAlphanumeric, IsEmpty, IsNotEmpty, Matches } from "class-validator";
//import { User } from "src/users/entities/user.entity";
import { User } from "src/users/users.schema";

@InputType()
@ArgsType()
export class LoginUserInput{
    @Field()
    @IsAlphanumeric()
    @IsNotEmpty()
    username: string;

    @Field()
    @IsNotEmpty()
    @Matches(/[^{}/]+/)
    password: string;
}