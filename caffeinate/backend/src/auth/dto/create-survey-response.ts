import { Field, ObjectType } from "@nestjs/graphql";
import { ValidateNested } from "class-validator";
import { Survey } from "src/survey/survey.schema";
import { User } from "src/users/users.schema";

@ObjectType()
export class CreateSurveyResponse{

    @Field(() => User)
    @ValidateNested()
    user: User;

    @Field(() => Survey)
    @ValidateNested()
    survey: Survey;
}