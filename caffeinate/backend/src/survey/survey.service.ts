import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Survey, SurveyDocument } from './survey.schema';

@Injectable()
export class SurveyService {
    constructor(
        @InjectModel(Survey.name) private surveyModel: Model<SurveyDocument>,
    ) {}

    async findSurveyByAuthor(username: string) {
      return await this.surveyModel.find({ author: username }).sort({date: -1}).lean();
    } 

    async findSurveyByAuthorIndex(username: string, idx: number) {
        return await this.surveyModel.find({ author: username }).sort({date: -1}).skip(idx).limit(1).findOne();
    }

    async createSurvey(input: { rate: number; answer1: string; answer2: string; author: string; }) {
        let newSurvey = await this.surveyModel.create(input);
        newSurvey.date = new Date();
        await newSurvey.save();
        return newSurvey;
    }

    async findRecentRatesByAuthor(username: string, startDate: number, endDate: number) {
        // this function returns a list of rate, at most five, that is within the given time slot
        let lst = await this.surveyModel.find({ author: username, date:{"$gte": startDate, "$lt": endDate} }).sort({date: -1}).limit(5);
        return lst;
    }

    /*async analyzeRateByAuthor(username: string) {
        let numOfR1 =  await this.surveyModel.find({ author: username, rate: 1}).count();
        console.log(numOfR1);
    }*/

    async find30ratesByAuthor(username: string) {
        return await this.surveyModel.find({ author: username }, {rate:1, date:1}).sort({date: -1}).limit(30).lean();
    } 
}
