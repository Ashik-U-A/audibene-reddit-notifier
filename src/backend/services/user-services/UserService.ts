export class UserService {
    private static user_data: Array<{
        username: string;
        email: string;
    }> = [];

    public static createNewUser(username: string, email: string) {
        if (this.checkForUserInUserData(username, email)) {
            return false;
        } else {
            this.user_data.push({
                username: username,
                email: email
            });
            return true;
        }
    }

    public static getUserName(email: string) {
        let name = this.user_data.find(d => {
            return d.email === email;
        });
        if (name) {
            return name.username;
        } else return null;
    }

    private static checkForUserInUserData(username: string, email: string) {
        return this.user_data.find(x => {
            return x.username == username && x.email == email;
        }) !== undefined
            ? true
            : false;
    }
}
