"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Common = void 0;
var observable_1 = require("tns-core-modules/data/observable");
var Common = (function (_super) {
    __extends(Common, _super);
    function Common() {
        return _super.call(this) || this;
    }
    Common.prototype.login = function (alUser, successCallback, errorCallback) { };
    Common.prototype.registerForPushNotification = function (successCallback, errorCallback) { };
    Common.prototype.isLoggedIn = function (successCallback, errorCallback) { };
    Common.prototype.launchChat = function () { };
    Common.prototype.launchChatWithUserId = function (userId) { };
    Common.prototype.launchChatWithGroupId = function (groupId, successCallback, errorCallback) { };
    Common.prototype.refreshToken = function (token, successCallback, errorCallback) { };
    Common.prototype.proccessNotification = function (data) { };
    Common.prototype.logout = function (successCallback, errorCallback) { };
    Common.prototype.showAllRegisteredUsers = function (showAll) { };
    Common.prototype.createGroup = function (groupInfo, successCallback, errorCallback) { };
    Common.prototype.addContacts = function (contacts, successCallback, errorCallback) { };
    Common.prototype.showOnlyMyContacts = function (show) { };
    Common.prototype.getTotalUnreadCount = function (successCallback) { };
    Common.prototype.getUnreadCountForChannel = function (groupId, successCallback) { };
    Common.prototype.getUnreadCountForContact = function (contactId, successCallback) { };
    return Common;
}(observable_1.Observable));
exports.Common = Common;
//# sourceMappingURL=applozic-chat.common.js.map