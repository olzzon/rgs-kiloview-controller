# rgs-kiloview-controller
Controller for Kiloview NDI video source to follow RGS client selection

## Installation:
copy rgs-kiloview.exe from the packagefolder/release to the RGS client
auto start the rgs-kiloview.exe on the RGS client

## Usage:
The controller will listen to the RGS client and set the NDI video source in kiloview follow the RGS client

## Command line arguments:
```
rgs-kiloview.exe -ip="kiloview ip address" -user="kiloview user" -password="kiloview password" -rgshostlist="rgs/ndi port/ndi list"
```

## Config .json file:
```
[
    {
        "port": 5900,
        "NDIsource": {
            "name": "test",
            "url": "192.168.1.87:5900"
        }
    },
    {
        "port": 5500,
        "NDIsource": {
            "name": "test2",
            "url": "192.168.1.87:5900"
        }
    }
]
```
