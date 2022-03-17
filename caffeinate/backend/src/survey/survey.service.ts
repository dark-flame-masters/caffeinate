import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Survey, SurveyDocument } from './survey.schema';

@Injectable()
export class SurveyService {
    constructor(
        @InjectModel(Survey.name) private surveyModel: Model<SurveyDocument>,
    ) {}

    async findSurveyByAuthor(username) {
      return await this.surveyModel.find({ author: username }).sort({date: -1}).lean();
    } 

    async findSurveyByAuthorIndex(username, idx) {
        return await this.surveyModel.find({ author: username }).sort({date: -1}).skip(idx).limit(1).findOne();
    }

    async createSurvey(input) {
        let newSurvey = await this.surveyModel.create(input);
        newSurvey.date = new Date();
        await newSurvey.save();
        return newSurvey;
    }
}
