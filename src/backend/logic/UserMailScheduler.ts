import { SchedulerService } from "../services/scheduler-services/SchedulerService";
import { MailContentGenerator } from "./MailContentGenerator";
import { MailService } from "../services/mail-services/MailService";

export class UserMailScheduler {
    public static _data: any = {};

    public static clearSchedule(user: string) {
        this._data[user].scheduler.destroy();
        this._data[user] = undefined;
    }

    public static schedule(user: string, channels: []) {
        if (this._data[user] !== undefined) {
            this._data[user].scheduler.destroy();
        }
        this._data[user] = {
            scheduler: new SchedulerService({ hours: 8, minutes: 0 }),
            action: () => {
                let content = new MailContentGenerator(
                    user,
                    (() => {
                        let _a: Array<{
                            channel_url: string;
                            limit: number;
                        }> = [];
                        channels.forEach(channel => {
                            _a.push({ channel_url: channel, limit: 3 });
                        });
                        return _a;
                    })()
                );

                content.generate().then(c => {
                    console.log(c);
                    console.log("-----");
                    MailService.sendMessage({
                        from: "the.reddit.notifier@audibene.de",
                        to: user,
                        subject: "Your Daily Bread of Reddit",
                        html: c
                    });
                });
            }
        };
        this._data[user].scheduler.addAction(this._data[user].action);
    }
}
