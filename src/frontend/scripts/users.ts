let axios = require("../libs/axios.min.js");

export function createNewUser(username: string, email: string): Promise<any> {
    return new Promise((res, rej) => {
        axios
            .post("/users", {
                username: username,
                email: email
            })
            .then((response: any) => {
                res(response);
            });
    });
}

export function getUserName(email: string) {
    return new Promise((res, rej) => {
        axios.get("/users/email=" + email).then((response: any) => {
            res(response);
        });
    });
}
