"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplozicChat = void 0;
var app = require("tns-core-modules/application/application");
var applozic_chat_common_1 = require("./applozic-chat.common");
var ApplozicChat = (function (_super) {
    __extends(ApplozicChat, _super);
    function ApplozicChat() {
        return _super.call(this) || this;
    }
    ApplozicChat.prototype.login = function (alUser, successCallback, errorCallback) {
        var user = new com.applozic.mobicomkit.api.account.user.User();
        user.setUserId(alUser.userId);
        user.setPassword(alUser.password);
        user.setApplicationId(alUser.applicationId);
        user.setDisplayName(alUser.displayName);
        user.setContactNumber(alUser.contactNumber);
        user.setAuthenticationTypeId(new java.lang.Short(alUser.authenticationTypeId));
        user.setImageLink(alUser.imageLink);
        if (alUser.pushNotificationFormat > 0) {
            user.setPushNotificationFormat(new java.lang.Short(alUser.pushNotificationFormat));
        }
        else {
            user.setPushNotificationFormat(new java.lang.Short(0));
        }
        if (alUser.enableEncryption !== undefined) {
            user.setEnableEncryption(alUser.enableEncryption);
        }
        var User = com.applozic.mobicomkit.api.account.user.User;
        var RegistrationResponse = com.applozic.mobicomkit.api.account.register.RegistrationResponse;
        var arg;
        arg = null;
        var ctx = this._getAndroidContext();
        com.applozic.mobicomkit.Applozic.init(ctx, alUser.applicationId);
        var listener = new com.applozic.mobicomkit.api.account.user.UserLoginTask.TaskListener({
            onSuccess: function (registrationResponse, context) {
                com.applozic.mobicomkit.ApplozicClient.getInstance(context).hideChatListOnNotification();
                successCallback(registrationResponse);
                return true;
            },
            onFailure: function (response, exception) {
                if (response) {
                    errorCallback(response);
                }
                else {
                    errorCallback(exception);
                }
                return true;
            }
        });
        var task = new com.applozic.mobicomkit.api.account.user.UserLoginTask(user, listener, ctx);
        com.applozic.mobicommons.task.AlTask.execute(task);
    };
    ApplozicChat.prototype.registerForPushNotification = function (successCallback, errorCallback) {
        var ctx = this._getAndroidContext();
        var args = (java.lang.Void = null);
        var listener = new com.applozic.mobicomkit.api.account.user.PushNotificationTask.TaskListener({
            onSuccess: function (response) {
                successCallback(response);
            },
            onFailure: function (response, exception) {
                if (response) {
                    errorCallback(response);
                }
                else {
                    errorCallback(exception);
                }
            }
        });
        var task = new com.applozic.mobicomkit.api.account.user.PushNotificationTask(com.applozic.mobicomkit.Applozic.getInstance(ctx).getDeviceRegistrationId(), listener, ctx);
        com.applozic.mobicommons.task.AlTask.execute(task);
    };
    ApplozicChat.prototype.refreshToken = function (token, successCallback, errorCallback) {
        var ctx = this._getAndroidContext();
        var args = (java.lang.Void = null);
        var listener = new com.applozic.mobicomkit.api.account.user.PushNotificationTask.TaskListener({
            onSuccess: function (response) {
                successCallback(response);
            },
            onFailure: function (response, exception) {
                if (response) {
                    errorCallback(response);
                }
                else {
                    errorCallback(exception);
                }
            }
        });
        var task = new com.applozic.mobicomkit.api.account.user.PushNotificationTask(token, listener, ctx);
        com.applozic.mobicommons.task.AlTask.execute(task);
    };
    ApplozicChat.prototype.launchChat = function () {
        var ctx = this._getCurrentActivity();
        var intent = new android.content.Intent(ctx, com.applozic.mobicomkit.uiwidgets.conversation.activity.ConversationActivity.class);
        if (com.applozic.mobicomkit.ApplozicClient.getInstance(ctx).isContextBasedChat()) {
            intent.putExtra(com.applozic.mobicomkit.uiwidgets.conversation.ConversationUIService.CONTEXT_BASED_CHAT, true);
        }
        ctx.startActivity(intent);
    };
    ApplozicChat.prototype.isLoggedIn = function (successCallback, errorCallback) {
        var ctx = this._getAndroidContext();
        if (com.applozic.mobicomkit.api.account.user.MobiComUserPreference.getInstance(ctx).isLoggedIn()) {
            successCallback('true');
        }
        else {
            successCallback('false');
        }
    };
    ApplozicChat.prototype.launchChatWithUserId = function (userId) {
        var ctx = this._getCurrentActivity();
        var intent = new android.content.Intent(ctx, com.applozic.mobicomkit.uiwidgets.conversation.activity.ConversationActivity.class);
        intent.putExtra('userId', userId);
        intent.putExtra('takeOrder', true);
        ctx.startActivity(intent);
    };
    ApplozicChat.prototype.launchChatWithGroupId = function (groupId, successCallback, errorCallback) {
        var ctx = this._getAndroidContext();
        var activity = this._getCurrentActivity();
        var args = (java.lang.Void = null);
        var listener = new com.applozic.mobicomkit.uiwidgets.async.AlGroupInformationAsyncTask.GroupMemberListener({
            onSuccess: function (response, context) {
                var intent = new android.content.Intent(activity, com.applozic.mobicomkit.uiwidgets.conversation.activity.ConversationActivity.class);
                intent.putExtra('groupId', response.getKey().intValue());
                intent.putExtra('takeOrder', true);
                activity.startActivity(intent);
                successCallback('success');
            },
            onFailure: function (response, exception, context) {
                if (response === 'undefined' || response === null) {
                    errorCallback('Error in launching group');
                }
                else {
                    errorCallback('Error in launching group');
                }
            }
        });
        var task = new com.applozic.mobicomkit.uiwidgets.async.AlGroupInformationAsyncTask(ctx, new java.lang.Integer(groupId), listener);
        com.applozic.mobicommons.task.AlTask.execute(task);
    };
    ApplozicChat.prototype.proccessNotification = function (data) {
        var ctx = this._getAndroidContext();
        var gsonUtils = com.applozic.mobicommons.json.GsonUtils;
        var dataMap = gsonUtils.getObjectFromJson(data, java.util.HashMap.class);
        com.applozic.mobicomkit.api.notification.MobiComPushReceiver.processMessageAsync(ctx, dataMap);
    };
    ApplozicChat.prototype.logout = function (successCallback, errorCallback) {
        var ctx = this._getAndroidContext();
        var args = (java.lang.Void = null);
        var listener = new com.applozic.mobicomkit.api.account.user.UserLogoutTask.TaskListener({
            onSuccess: function (context) {
                successCallback('Successfully logged out');
            },
            onFailure: function (exception) {
                errorCallback('Failed to logout');
            }
        });
        var task = new com.applozic.mobicomkit.api.account.user.UserLogoutTask(listener, ctx);
        com.applozic.mobicommons.task.AlTask.execute(task);
    };
    ApplozicChat.prototype.showAllRegisteredUsers = function (showAll) {
        var ctx = this._getAndroidContext();
        if (showAll) {
            com.applozic.mobicomkit.uiwidgets.ApplozicSetting.getInstance(ctx).enableRegisteredUsersContactCall();
        }
    };
    ApplozicChat.prototype.createGroup = function (groupInfo, successCallback, errorCallback) {
        var ctx = this._getAndroidContext();
        var gsonUtils = com.applozic.mobicommons.json.GsonUtils;
        var channelInfo = com.applozic.mobicomkit.api.people.ChannelInfo;
        channelInfo = gsonUtils.getObjectFromJson(JSON.stringify(groupInfo), channelInfo.class);
        var group = com.applozic.mobicommons.people.channel.Channel;
        var listener = new com.applozic.mobicomkit.uiwidgets.async.AlChannelCreateAsyncTask.TaskListenerInterface({
            onSuccess: function (channel, context) {
                successCallback(gsonUtils.getJsonFromObject(channel, group.class));
            },
            onFailure: function (response, context) {
                errorCallback(gsonUtils.getJsonFromObject(response, com.applozic.mobicomkit.feed.ChannelFeedApiResponse.class));
            }
        });
        var task = new com.applozic.mobicomkit.uiwidgets.async.AlChannelCreateAsyncTask(ctx, channelInfo, listener);
        com.applozic.mobicommons.task.AlTask.execute(task);
    };
    ApplozicChat.prototype.addContacts = function (contacts) {
        var ctx = this._getAndroidContext();
        var gsonUtils = com.applozic.mobicommons.json.GsonUtils;
        contacts.forEach(function (user) {
            new com.applozic.mobicomkit.contact.AppContactService(ctx).upsert(gsonUtils.getObjectFromJson(JSON.stringify(user), com.applozic.mobicommons.people.contact.Contact.class));
        });
    };
    ApplozicChat.prototype.showOnlyMyContacts = function (show) {
        var ctx = this._getAndroidContext();
        if (show) {
            com.applozic.mobicomkit.ApplozicClient.getInstance(ctx).enableShowMyContacts();
        }
        else {
            com.applozic.mobicomkit.ApplozicClient.getInstance(ctx).disableShowMyContacts();
        }
    };
    ApplozicChat.prototype.getTotalUnreadCount = function (successCallback) {
        var ctx = this._getAndroidContext();
        var count = new com.applozic.mobicomkit.api.conversation.database.MessageDatabaseService(ctx).getTotalUnreadCount();
        successCallback(count);
    };
    ApplozicChat.prototype.getUnreadCountForChannel = function (groupId, successCallback) {
        var ctx = this._getAndroidContext();
        var count = new com.applozic.mobicomkit.api.conversation.database.MessageDatabaseService(ctx).getUnreadMessageCountForChannel(new java.lang.Integer(groupId));
        successCallback(count);
    };
    ApplozicChat.prototype.getUnreadCountForContact = function (contactId, successCallback) {
        var ctx = this._getAndroidContext();
        var count = new com.applozic.mobicomkit.api.conversation.database.MessageDatabaseService(ctx).getUnreadMessageCountForContact(contactId);
        successCallback(count);
    };
    ApplozicChat.prototype._getAndroidContext = function () {
        var _this = this;
        var ctx = app.android.context;
        if (ctx === null) {
            setTimeout(function () {
                _this._getAndroidContext();
            }, 200);
            return;
        }
        else {
            return ctx;
        }
    };
    ApplozicChat.prototype._getCurrentActivity = function () {
        var _this = this;
        var ctx = app.android.foregroundActivity;
        if (ctx === null) {
            setTimeout(function () {
                _this._getCurrentActivity();
            }, 200);
            return;
        }
        else {
            return ctx;
        }
    };
    return ApplozicChat;
}(applozic_chat_common_1.Common));
exports.ApplozicChat = ApplozicChat;
//# sourceMappingURL=applozic-chat.android.js.map