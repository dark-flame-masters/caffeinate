import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/users.schema';
import { JournalResolver } from './journal.resolver';
import { Journal, JournalSchema } from './journal.schema';
import { JournalService } from './journal.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Journal.name, schema: JournalSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [JournalResolver, JournalService],
  exports: [JournalService]
})
export class JournalModule {}
