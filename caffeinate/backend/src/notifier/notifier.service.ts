import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Todo } from 'src/todo/todo.schema';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class NotifierService {
    constructor(private schedulerRegistry: SchedulerRegistry, private readonly configService: ConfigService) {}

    async createNotifierByTodo(todo: Todo, email: string) {

        //create a cron job
        const job = new CronJob((new Date((todo.dueDate).valueOf() - 600000)), () => { // 10 mins in advances
            // we begin the email flow
            this.triggerScheduleEmail(email, todo.item);
        });
        this.schedulerRegistry.addCronJob(String(todo._id), job);
        job.start();
    }

    async deleteNotifierByTodo(todoId: string) {
        const job = this.schedulerRegistry.getCronJob(String(todoId));
        job.stop();
        this.schedulerRegistry.deleteCronJob(String(todoId));
        console.log("deleted");
    }


    // helper function
    async triggerScheduleEmail(targetEmail: string, task: string){
        // we first configure the env variable
        let finaluser: string;
        let finalpw: string;
        if (
            !this.configService.get('EMAIL_USER') ||
            !this.configService.get('EMAIL_PASSWORD') ||
            !this.configService.get('TRANS_HOST') ||
            !this.configService.get('TRANS_PORT') 
        ) {
            throw new Error('please configure the email first');
        } 
        else {
            finaluser = this.configService.get<string>('EMAIL_USER');
            finalpw = this.configService.get<string>('EMAIL_PASSWORD');
            console.log(this.configService.get<string>('REJECT_UNAUTHORIZED') == 'false')
            console.log(finaluser,finalpw,this.configService.get<string>('TRANS_HOST'),this.configService.get<number>('TRANS_PORT'),this.configService.get<boolean>('REJECT_UNAUTHORIZED'))
        }


        const transporter = nodemailer.createTransport({
            host: this.configService.get<string>('TRANS_HOST'),
            port: this.configService.get<number>('TRANS_PORT'),
            //host: 'smtp.gmail.com',
            //port: 465,
            secure: true,
            auth: {
                user: finaluser,
                pass: finalpw,
            },
            tls : { rejectUnauthorized: !(this.configService.get<string>('REJECT_UNAUTHORIZED') == 'false') }
            //tls : { rejectUnauthorized: false }
        });
        // send mail with defined transport object
        try{ await transporter.sendMail({
            from: `"Caffeinate" <${this.configService.get<string>('EMAIL_USER')}>`,
            to: targetEmail, //could be list of receivers
            subject: `Caffeinate: Notification for your agenda`,
            html: `
            <p style="font-size: 14px; line-height: 140%;">
                Dear Caffeinate users,
                <br>
                You need to do your task:
                <br>
                <strong>
                    ${task} 
                </strong>
                <br>
                - Caffeinate
                <br>
            </p>
            `,
        });}catch(err){
            console.error(err);
        }
    }

}
