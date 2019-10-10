import { RedditService } from "../services/reddit-services/RedditService";

export class MailContentGenerator {
    private counter: number = 0;
    private content: string = "";
    private generated_content_promise: Promise<any>;
    private generated_content_promise_resolution_object: any;

    constructor(
        private user: string,
        private content_information: Array<{
            channel_url: string;
            limit: number;
        }>
    ) {}

    public generate() {
        this.generated_content_promise = new Promise((resolve, reject) => {
            this.generated_content_promise_resolution_object = resolve;
            this._generate();
        });
        return this.generated_content_promise;
    }

    private _generate() {
        this.content_information.forEach(content_meta => {
            RedditService.getTopPosts(
                content_meta.channel_url,
                content_meta.limit
            )
                .then(data => {
                    data = data.data;
                    let channel_content = `<div class="channel-content" stye="display: block; padding: 10px;">`;
                    let post = "";
                    data.children.forEach((child: any) => {
                        post = `<div class="post-container" style="margin: 10px; padding: 10px; box-shadow:0 2px 5px rgba(0,0,0,0.3)">
                        <h4 style="margin-bottom: 20px;font-size: 1.2rem;font-weight: 700">${child.data.title}</h4>
                        <div class="image-container" style="display: block; ">
                            <img style="width: 100%" src="${child.data.thumbnail}">
                        </div>
                        <div class="permalink-container">
                            <p>To know more about it, <a href="https://www.reddit.com${child.data.permalink}">Click Here!</a></p>
                        </div>
                    </div>`;
                        channel_content += post;
                    });
                    channel_content += `</div>`;
                    this.start_consolidating(channel_content);
                })
                .catch(e => {
                    console.log(e);
                });
        });
    }

    private start_consolidating(channel_content: string) {
        this.counter++;
        this.content += channel_content;
        if (this.counter >= this.content_information.length) {
            this.content =
                "<div class='full-content'>" + this.content + "</div>";
            this.counter = 0;
            this.generated_content_promise_resolution_object(this.content);
        }
    }
}
