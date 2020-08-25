# MMM-GrocyLists

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

Integrate with a [Grocy](https://github.com/grocy/grocy) server to display information from various widgets.

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

## Widget Types
Currently only one widget type is in development.

### Chores
Show a list of upcoming chores due, or those overdue.
