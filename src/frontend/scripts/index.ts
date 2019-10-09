import { createNewUser } from "./users";

declare global {
    interface Window {
        api: any;
    }
}

function createUserIfNew() {
    let username = (<HTMLInputElement>document.getElementById("username"))
        .value;
    let email = (<HTMLInputElement>document.getElementById("email")).value;
    createNewUser(username, email).then(() => {
        goToUserConfigScreen(email);
    });
}

function goToUserConfigScreen(email: string) {
    window.location.href = "/config-user?user=" + email;
}

window.api = {
    createUserIfNew: createUserIfNew
};
