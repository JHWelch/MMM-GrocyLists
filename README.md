# MMM-GrocyLists

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

Integrate with a [Grocy](https://github.com/grocy/grocy) server to display information from various widgets.

## Installation
### Setup the MagicMirror module
```bash
cd ~/MagicMirror/modules
git clone https://github.com/Bovive/MMM-GrocyLists
cd MMM-GrocyLists
npm install
```

## Updating
Go to the module’s folder inside MagicMirror modules folder and pull the latest version from GitHub and install:
```
git pull
```

## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [
        {
            module: 'MMM-GrocyLists',
            header: "Grocy", // Customize depending on Widget.
            config: {
                // See below for configurable options
            }
        }
    ]
}
```

## Configuration options

| Option           | Description
|----------------- |-----------
| `grocyURL`       | *Required* URL of your Grocy instance. **Do not** include trailing `/`.<br><br>**Type:** `string`
| `grocyAPIKey`    | *Required* API Key for your Grocy instance. Can be obtained off your instance at `[Instance URL]/manageapikeys`.<br><br>**Type:** `string`
| `widgetType`     | *Optional* The type of Widget to render. <br><br>**Type:** `string` <br>Default `chores`
| `proxyCORS`      | *Optional* Whether to use [cors-anywhere.herokuapp.com] to proxy for CORS purposes. Use if having trouble with API calls.  <br><br>**Type:** `boolean` <br>Default `false`
| `updateInterval` | *Optional* How often to update the Module. <br><br>**Type:** `int`(milliseconds)<br>Default 300000 milliseconds (5 Minutes).
| `retryDelay`     | *Optional* How long to wait to retry if error on API call.<br><br>**Type:** `int`(milliseconds) <br>Default 5000 milliseconds (5 minute).
| `tableClass`     | *Optional* Class applied to the table. Controls sizing <br><br> `string`<br> Default `small`
| `choreFilter`    | *Optional* Filters the number of days in the future to show chores. Zero for no filter. <br><br> `int`<br> Default `0`
| `timeOffset`     | *Optional* Offset the task due time by number of hours. May be used if your timezone is not being applied correctly. Zero for no offset. <br><br> `int`<br> Default `0`
| `showOverdue`    | *Optional* True to show overdue chores. False to hide them. <br><br> `boolean`<br> Default `true`

## Widget Types
Currently only one widget type.

### Chores
Show a list of upcoming chores due, or those overdue.

### Thanks
* Built with [MagicMirror Module Template](https://github.com/roramirez/MagicMirror-Module-Template)
