import { InputType, Int, Field } from '@nestjs/graphql';
import { IsAlphanumeric } from 'class-validator';


@InputType()
export class CreateUserInput {
  /*@Field(() => Int)
  id: number;*/

  @Field()
  @IsAlphanumeric()
  username: string;

  @Field()
  password: string;

}
