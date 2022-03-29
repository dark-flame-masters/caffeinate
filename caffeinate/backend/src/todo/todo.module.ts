import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoResolver } from './todo.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from './todo.schema';
import { UsersModule } from 'src/users/users.module';
import { NotifierModule } from 'src/notifier/notifier.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Todo.name, schema: TodoSchema },
    ]),
    UsersModule,
    NotifierModule,
  ],
  providers: [TodoService, TodoResolver],
  exports: [TodoService]
})
export class TodoModule {}
