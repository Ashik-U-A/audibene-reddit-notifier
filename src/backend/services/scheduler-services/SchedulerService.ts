export class SchedulerService {
    public static all_schedules: Array<SchedulerService> = [];
    private scheduled_actions: Array<Function> = [];
    private schedule_timer: any;
    constructor(
        private time: {
            hours: number;
            minutes: number;
        }
    ) {
        this.schedule_timer = setInterval(() => {
            let time = new Date();

            if (
                time.getHours() === this.time.hours &&
                time.getMinutes() === this.time.minutes
            ) {
                this.scheduled_actions.forEach(action => {
                    action();
                });
            }
        }, 15000);
        SchedulerService.all_schedules.push(this);
    }

    public addAction(action: Function): void {
        this.scheduled_actions.push(action);
    }

    public destroy() {
        clearInterval(this.schedule_timer);
        SchedulerService.all_schedules.splice(
            SchedulerService.all_schedules.findIndex(x => x === this),
            1
        );
    }
}
