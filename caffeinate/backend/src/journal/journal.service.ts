import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { CreateJournalInput, Journal, JournalDocument } from './journal.schema';
import natural = require('natural');

@Injectable()
export class JournalService {
    constructor(@InjectModel(Journal.name) private journalModel: Model<JournalDocument>, private usersService: UsersService) {}
     
      async findJournalByAuthorIndex(authorGoogleId: string, idx: number) {
        return await this.journalModel.find({ authorGoogleId }).sort({date: -1}).skip(idx).limit(1).findOne();
      }

      async find30SentimentsByAuthor(googleId: string) {
        let veryHappyFreq = await this.journalModel.find({ authorGoogleId: googleId }).sort({date: -1}).limit(30).find({sentiment: 'very happy'}).count();
        let happyFreq = await this.journalModel.find({ authorGoogleId: googleId }).sort({date: -1}).limit(30).find({sentiment: 'happy'}).count();
        let neutralFreq = await this.journalModel.find({ authorGoogleId: googleId }).sort({date: -1}).limit(30).find({sentiment: 'neutral'}).count();
        let disappointedFreq = await this.journalModel.find({ authorGoogleId: googleId }).sort({date: -1}).limit(30).find({sentiment: 'disappointed'}).count();
        let angryFreq = await this.journalModel.find({ authorGoogleId: googleId }).sort({date: -1}).limit(30).find({sentiment: 'angry'}).count();
        return [veryHappyFreq, happyFreq, neutralFreq, disappointedFreq, angryFreq];
      } 

      async createJournal(input: CreateJournalInput) {
        //we first create the journal and save the journal
        let newJournal = await this.journalModel.create(input);
        newJournal.date = new Date();

        // then we add the sentiment to this journal
        var Analyzer = natural.SentimentAnalyzer;
        var stemmer = natural.PorterStemmer;
        var analyzer = new Analyzer("English", stemmer, "afinn");

        //Then we convert the content to a list of single words
        let wordLst = this.convertStringToWords(input.content);

        // getSentiment expects an array of strings
        var sentimentVal = analyzer.getSentiment(wordLst);
        if (sentimentVal >= 0.5) {
          newJournal.sentiment = "very happy";
        } else if (sentimentVal >= 0.25) {
          newJournal.sentiment = "happy";
        } else if (sentimentVal >= -0.25) {
          newJournal.sentiment = "neutral";
        } else if (sentimentVal >= -0.6) {
          newJournal.sentiment = "disappointed";
        } else {
          newJournal.sentiment = "angry";
        }

        //finally we save the journal
        await newJournal.save();


        // now we want to count the occurance of each item
        let user = await this.usersService.findOne(input.authorGoogleId);
        let wordCounts = JSON.parse(user.journalDict); // get the dictionary from user
        for (const item of wordLst) {
          //we want to limit the word length to 20 for wordcloud
          if(item.length>20) continue;
          wordCounts[item] = wordCounts[item] ? wordCounts[item] + 1 : 1;
        }
        // then we save the new dictionary to the user
        await this.usersService.updateJournalDict(input.authorGoogleId, JSON.stringify(wordCounts));
        //at last we return the journal
        return newJournal;
      }

      convertStringToWords(text: string){
        let alphaNumeric = text.toLowerCase().replace(/[^A-Za-z0-9]+/g, " ");
        let wordArr = alphaNumeric.trim().split(" ");
        return wordArr;
      }
}
