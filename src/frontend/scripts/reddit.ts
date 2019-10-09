let axios = require("../libs/axios.min.js");

export function updateUserConfiguration(data: any) {
    axios.put("/reddit", data).then((r: any) => {
        console.log(r);
    });
}

export function getChannelDetails(email: string): Promise<any> {
    return axios.get("/reddit/email=" + email);
}
