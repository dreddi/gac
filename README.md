# gac - gunbot autoconfig compiler

Turns 

```js
{
    "update_tradinglimit": {
        "pairs": {
            "exclude": "",
            "include": "USDT-",
            "exchange": "binanceFutures"
        },
        "filters": {
            "long": {
                "type": "exact",
                "state": "LONG"
            },
        },
        "clearOverrides": false,
        "setPairVariable": {
        },
        "overrides": {
            "TRADING_LIMIT": function autotl(wallet) {

                if(wallet > 5000 && wallet <= 7000){
                    return 100;
                } else if(wallet > 7000 && wallet <= 10000){
                    return 120;
                } else if(wallet > 10000 && wallet < 15000){
                    return 150;
                }

                return 0;
            }(
                this.pair.balancesdata['USDT'].walletBalance
            ),
            "ROE": this.pair.leverage * 0.5
        },
        "schedule": "* * * * *",
        "type": "manageOverrides",
        "enabled": true,
        "debug": false
    }
}
````

into

```json
{
  "update_tradinglimit": {
    "pairs": {
      "exclude": "",
      "include": "USDT-",
      "exchange": "binanceFutures"
    },
    "filters": {
      "long": {
        "type": "exact",
        "state": "LONG"
      }
    },
    "clearOverrides": false,
    "setPairVariable": {},
    "overrides": {
      "TRADING_LIMIT": " function autotl(wallet) { if (wallet > 5000 && wallet <= 7000) { return 100; } else if (wallet > 7000 && wallet <= 10000) { return 120; } else if (wallet > 10000 && wallet < 15000) { return 150; } return 0; }(this.pair.balancesdata['USDT'].walletBalance)",
      "ROE": " this.pair.leverage * 0.5"
    },
    "schedule": "* * * * *",
    "type": "manageOverrides",
    "enabled": true,
    "debug": false
  }
}
```

## Installation

Requires `node v12+`

    npm install -g soccer193/gac


## Usage

    $ gac ~/autoconf.js
    New autoconfig written to /home/soccer193/autoconfig.json
