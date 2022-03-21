import { Field, ObjectType } from "@nestjs/graphql";
import { Survey } from "src/survey/survey.schema";
import { User } from "src/users/users.schema";

@ObjectType()
export class CreateSurveyResponse{

    @Field(() => User)
    user: User;

    @Field(() => Survey)
    survey: Survey;
}