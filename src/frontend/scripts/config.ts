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
let _time = {
    hours: 8,
    minutes: 0,
    timezoneoffset: 0
};

function saveNewConfiguration() {
    let configuration = {
        user: window.location.search.match(/\?(user=(.*))/)[2],
        channels: _list_of_channels,
        newsletter: _newsletter,
        time: {
            hours: _time.hours,
            minutes: _time.minutes,
            timezone_offset: _time.timezoneoffset
        }
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
                if (response.data.time) {
                    _time.hours = response.data.time.hours;
                    _time.minutes = response.data.time.minutes;
                    _time.timezoneoffset = response.data.time.offset_minutes;
                }
            }
            getCurrentTimeZone();
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

    let tz = document.getElementById("time") as HTMLInputElement;
    tz.value =
        (_time.hours < 10 ? "0" + _time.hours : _time.hours) +
        ":" +
        (_time.minutes < 10 ? "0" + _time.minutes : _time.minutes);

    renderList();
}

function getCurrentTimeZone() {
    let d = new Date();
    let offset_minutes = d.getTimezoneOffset();
    _time.timezoneoffset = offset_minutes;

    let tz = document.getElementById("timezone");
    tz.innerHTML = (() => {
        let t = offset_minutes < 0 ? "+" : "-";
        offset_minutes = Math.abs(offset_minutes);
        let _offset_hours = Math.floor(offset_minutes / 60);
        let _offset_minutes = offset_minutes % 60;

        t += _offset_hours < 10 ? "0" + _offset_hours : _offset_hours + "";
        t +=
            ":" +
            (offset_minutes < 10
                ? "0" + _offset_minutes
                : _offset_minutes + "");
        return t;
    })();
}

function getTime(input: HTMLInputElement) {
    let t = input.value.split(":");
    _time.hours = parseInt(t[0]);
    _time.minutes = parseInt(t[1]);
}

window.api = {
    addChannelToList: addChannelToList,
    saveNewConfiguration: saveNewConfiguration,
    setNewsletterSubscription: setNewsletterSubscription,
    getTime: getTime
};

getUserDetails();
getCurrentTimeZone();
