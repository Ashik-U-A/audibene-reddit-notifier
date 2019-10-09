import { updateUserConfiguration, getChannelDetails } from "./reddit";
import { getUserName } from "./users";

declare global {
    interface Window {
        api: any;
    }
}

let _list_of_channels: Array<string> = [];
let _newsletter: boolean = false;
let _user_details = {
    email:
        window.location.search.match(/\?(user=(.*))/).length > 2
            ? window.location.search.match(/\?(user=(.*))/)[2]
            : "",
    name: ""
};

function saveNewConfiguration() {
    let configuration = {
        user: window.location.search.match(/\?(user=(.*))/)[2],
        channels: _list_of_channels,
        newsletter: _newsletter
    };

    updateUserConfiguration(configuration);
}

function addChannelToList() {
    let channel = (<HTMLInputElement>document.getElementById("channelurl"))
        .value;
    if (
        channel.trim().length > 0 &&
        _list_of_channels.indexOf(channel) === -1
    ) {
        _list_of_channels.push(channel);
    }
    renderList();
}

function setNewsletterSubscription() {
    let subs = (<HTMLInputElement>document.getElementById("subscribe")).checked;
    _newsletter = subs;
}

function renderList() {
    let channelList = document.getElementById("channel-list");
    channelList.innerHTML = "";
    _list_of_channels.forEach(channel => {
        let listContainer = document.createElement("li");
        let channelLabel = document.createElement("label");
        channelLabel.innerHTML = channel;
        let deleteChannelButton = document.createElement("button");
        deleteChannelButton.innerHTML = "Delete Channel";
        deleteChannelButton.onclick = () => {
            _list_of_channels.splice(_list_of_channels.indexOf(channel), 1);
            renderList();
        };
        listContainer.appendChild(channelLabel);
        listContainer.appendChild(deleteChannelButton);
        channelList.appendChild(listContainer);
    });
}

function getUserDetails() {
    getUserName(_user_details.email).then((response: any) => {
        _user_details.name = response.data;
        getChannelDetails(_user_details.email).then((response: any) => {
            if (response.data) {
                _list_of_channels = response.data.channels;
                _newsletter = response.data.subscribe;
            }
            renderEverything();
        });
    });
}

function renderEverything() {
    let welcome = document.getElementById("welcome");
    welcome.innerHTML = "Hello, " + _user_details.name;
    (<HTMLInputElement>(
        document.getElementById("subscribe")
    )).checked = _newsletter;
    renderList();
}

window.api = {
    addChannelToList: addChannelToList,
    saveNewConfiguration: saveNewConfiguration,
    setNewsletterSubscription: setNewsletterSubscription
};

getUserDetails();
