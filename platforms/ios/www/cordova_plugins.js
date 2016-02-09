cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/cordova-sqlite-storage/www/SQLitePlugin.js",
        "id": "cordova-sqlite-storage.SQLitePlugin",
        "clobbers": [
            "SQLitePlugin"
        ]
    },
    {
        "file": "plugins/de.appplant.cordova.plugin.local-notification-ios9-fix/www/local-notification.js",
        "id": "de.appplant.cordova.plugin.local-notification-ios9-fix.LocalNotification",
        "clobbers": [
            "cordova.plugins.notification.local",
            "plugin.notification.local"
        ]
    },
    {
        "file": "plugins/de.appplant.cordova.plugin.local-notification-ios9-fix/www/local-notification-core.js",
        "id": "de.appplant.cordova.plugin.local-notification-ios9-fix.LocalNotification.Core",
        "clobbers": [
            "cordova.plugins.notification.local.core",
            "plugin.notification.local.core"
        ]
    },
    {
        "file": "plugins/de.appplant.cordova.plugin.local-notification-ios9-fix/www/local-notification-util.js",
        "id": "de.appplant.cordova.plugin.local-notification-ios9-fix.LocalNotification.Util",
        "merges": [
            "cordova.plugins.notification.local.core",
            "plugin.notification.local.core"
        ]
    },
    {
        "file": "plugins/ionic-plugin-keyboard/www/ios/keyboard.js",
        "id": "ionic-plugin-keyboard.keyboard",
        "clobbers": [
            "cordova.plugins.Keyboard"
        ],
        "runs": true
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-device": "1.0.1",
    "cordova-plugin-whitelist": "1.0.0",
    "cordova-sqlite-storage": "0.7.11-dev",
    "de.appplant.cordova.plugin.local-notification-ios9-fix": "0.8.2",
    "ionic-plugin-keyboard": "1.0.8",
    "de.appplant.cordova.common.registerusernotificationsettings": "1.0.1"
}
// BOTTOM OF METADATA
});