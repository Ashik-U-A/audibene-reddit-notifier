import { get, post } from "request";

let _ACCESS_TOKEN = "";
let _headers = {
    Authorization: "bearer " + _ACCESS_TOKEN,
    "User-Agent":
        "node-js-server:NO-ID:v0.0 (This is just for personal knowledge)"
};

export class RedditService {
    private static reddit_user_data: Array<{
        user: string;
        channels: [];
        subscribe: boolean;
    }> = [];

    public static getTrendingSubreddits(): Promise<any> {
        //this.requestAccessToken();
        return this.sendGetRequestToRedditServer("https://www.reddit.com/best");
    }

    public static getDetails(
        email: string
    ): { channels: []; subscribe: boolean } {
        let ret = this.reddit_user_data.find(d => {
            return d.user === email;
        });
        if (ret) {
            return {
                channels: ret.channels,
                subscribe: ret.subscribe
            };
        } else {
            return null;
        }
    }

    public static addNewUserListing(email: string): void {
        this.reddit_user_data.push({
            user: email,
            channels: [],
            subscribe: false
        });
    }

    public static setConfigurationForUser(configuration: {
        user: string;
        channels: [];
        subscribe: boolean;
    }): any {
        console.log(configuration);
        let new_conf = this.reddit_user_data.find(r => {
            return r.user === configuration.user;
        });
        if (new_conf) {
            new_conf.channels = configuration.channels;
            new_conf.subscribe = configuration.subscribe;
            console.log(this.reddit_user_data);
            return {
                type: "INFO",
                message: "User Configuration Successful"
            };
        } else {
            return {
                type: "ERROR",
                message: "User not found / Invalid User"
            };
        }
    }

    private static requestAccessToken(): void {
        post(
            "https://www.reddit.com/api/v1/access_token",
            {
                auth: {
                    user: "_LBIrn6f75Iyhg",
                    pass: "7lF8sotdE1spyAdKz3gswXaHHns"
                },
                form: {
                    grant_type: "client_credentials"
                }
            },
            (error: any, response: any, body: any) => {
                if (!error && response.statusCode == 200) {
                    _ACCESS_TOKEN = JSON.parse(body).access_token;
                }
            }
        );
    }

    private static sendGetRequestToRedditServer(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            get(
                url,
                {
                    headers: _headers
                },
                (error: any, response: any, body: any) => {
                    if (!error && response.statusCode == 200) {
                        resolve(body);
                    } else {
                        reject(error || response.statusCode);
                    }
                }
            );
        });
    }

    private static sendPostRequestToRedditServer(
        url: string,
        body: any
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            post(
                url,
                {
                    headers: _headers,
                    form: body
                },
                (error: any, response: any, body: any) => {
                    if (!error && response.statusCode == 200) {
                        resolve(JSON.parse(body));
                    } else {
                        reject(error || response.statusCode);
                    }
                }
            );
        });
    }
}
