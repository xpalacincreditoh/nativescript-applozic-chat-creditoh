"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplozicChat = void 0;
var applozic_chat_common_1 = require("./applozic-chat.common");
var ApplozicChat = (function (_super) {
    __extends(ApplozicChat, _super);
    function ApplozicChat() {
        return _super.call(this) || this;
    }
    ApplozicChat.prototype.login = function (user, successCallback, errorCallback) {
        var _this = this;
        var alUser = ALUser.alloc().init();
        alUser.userId = user.userId;
        alUser.password = user.password;
        alUser.applicationId = user.applicationId;
        alUser.authenticationTypeId = user.authenticationTypeId;
        alUser.imageLink = user.imageLink;
        if (user.authenticationTypeId !== undefined) {
            ALUserDefaultsHandler.setUserAuthenticationTypeId(user.authenticationTypeId);
        }
        if (user.enableEncryption !== undefined) {
            ALUserDefaultsHandler.setEnableEncryption(user.enableEncryption);
        }
        var alChatLauncher = ALChatLauncher.alloc().initWithApplicationId(user.applicationId);
        var alRegisterUserClientService = ALRegisterUserClientService.alloc().init();
        alRegisterUserClientService.initWithCompletionWithCompletion(alUser, function (response, error) {
            _this.defaultSettings();
            if (response) {
                if (response.isRegisteredSuccessfully()) {
                    successCallback(response.dictionary());
                }
                else {
                    errorCallback(response.dictionary());
                }
            }
            else {
                errorCallback(JSON.stringify(error));
            }
        });
    };
    ApplozicChat.prototype.isLoggedIn = function (successCallback, errorCallback) {
        if (ALUserDefaultsHandler.isLoggedIn()) {
            successCallback('true');
        }
        else {
            successCallback('false');
        }
    };
    ApplozicChat.prototype.registerForPushNotification = function (successCallback, errorCallback) { };
    ApplozicChat.prototype.refreshToken = function (token, successCallback, errorCallback) {
        var alRegisterUserClientService = ALRegisterUserClientService.alloc().init();
        alRegisterUserClientService.updateApnDeviceTokenWithCompletionWithCompletion(token, function (response, error) {
            if (response) {
                successCallback(response.dictionary());
            }
            else {
                errorCallback(JSON.stringify(error));
            }
        });
    };
    ApplozicChat.prototype.proccessNotification = function (data) {
        var alPushNotificationService = ALPushNotificationService.alloc().init();
        alPushNotificationService.processPushNotificationUpdateUI(data, parseInt(data.foreground));
    };
    ApplozicChat.prototype.launchChat = function () {
        var alChatLauncher = ALChatLauncher.alloc().initWithApplicationId(ALUserDefaultsHandler.getApplicationKey());
        var alPushAssist = ALPushAssist.alloc().init();
        alChatLauncher.launchChatListAndViewControllerObject('Conversations', alPushAssist.topViewController);
    };
    ApplozicChat.prototype.launchChatWithUserId = function (userId) {
        var alChatLauncher = ALChatLauncher.alloc().initWithApplicationId(ALUserDefaultsHandler.getApplicationKey());
        var alPushAssist = ALPushAssist.alloc().init();
        alChatLauncher.launchIndividualChatWithGroupIdWithDisplayNameAndViewControllerObjectAndWithText(userId, null, null, alPushAssist.topViewController, null);
    };
    ApplozicChat.prototype.launchChatWithGroupId = function (groupId, successCallback, errorCallback) {
        var alChatLauncher = ALChatLauncher.alloc().initWithApplicationId(ALUserDefaultsHandler.getApplicationKey());
        var alPushAssist = ALPushAssist.alloc().init();
        var channelService = ALChannelService.alloc().init();
        channelService.getChannelInformationOrClientChannelKeyWithCompletion(groupId, null, function (alChannel) {
            if (alChannel !== null) {
                alChatLauncher.launchIndividualChatWithGroupIdWithDisplayNameAndViewControllerObjectAndWithText(null, groupId, null, alPushAssist.topViewController, null);
                successCallback('success');
            }
            else {
                errorCallback('Error in launching group');
            }
        });
    };
    ApplozicChat.prototype.logout = function (successCallback, errorCallback) {
        var alRegisterUserClientService = ALRegisterUserClientService.alloc().init();
        alRegisterUserClientService.logoutWithCompletionHandler(function (response, error) {
            if (!error && response.status === 'success') {
                console.log('Logout successful');
                successCallback(response.dictionary());
            }
            else {
                console.log('Logout failed: ' + response.response);
                successCallback(error);
            }
        });
    };
    ApplozicChat.prototype.createGroup = function (groupInfo, successCallback, errorCallback) {
        var alChannelService = ALChannelService.alloc().init();
        var groupMemberList = new NSMutableArray({ capacity: 0 });
        alChannelService.createChannelOrClientChannelKeyAndMembersListAndImageLinkChannelTypeAndMetaDataAdminUserWithGroupUsersWithCompletion(groupInfo.groupName, groupInfo.clientGroupId, groupMemberList, groupInfo.imageUrl, groupInfo.type, groupInfo.metadata, groupInfo.admin, groupInfo.users, function (alChannel, error) {
            if (alChannel !== null) {
                successCallback(alChannel.dictionary());
            }
            else if (error !== null) {
                errorCallback(error);
            }
        });
    };
    ApplozicChat.prototype.addContacts = function (contacts) {
        var alContactService = ALContactService.alloc().init();
        contacts.forEach(function (user) {
            if (user.imageUrl !== 'undefined' || user.imageUrl !== null) {
                user.contactImageUrl = user.imageUrl;
            }
            var contact = ALContact.alloc().initWithDict(user);
            if (user.hasOwnProperty('contactType')) {
                contact.contactType = user.contactType;
            }
            alContactService.updateOrInsert(contact);
        });
    };
    ApplozicChat.prototype.showAllRegisteredUsers = function (showAll) {
        ALApplozicSettings.setFilterContactsStatus(showAll);
    };
    ApplozicChat.prototype.showOnlyMyContacts = function (show) {
        ALApplozicSettings.setFilterContactsStatus(false);
        if (show) {
            ALApplozicSettings.setContactTypeToFilter([1]);
        }
        else {
            ALApplozicSettings.setContactTypeToFilter(null);
        }
    };
    ApplozicChat.prototype.getTotalUnreadCount = function (successCallback) {
        var alUserService = new ALUserService();
        var count = alUserService.getTotalUnreadCount();
        successCallback(count);
    };
    ApplozicChat.prototype.getUnreadCountForChannel = function (groupId, successCallback) {
        var alChannelService = new ALChannelService();
        var channel = alChannelService.getChannelByKey(groupId);
        if (channel !== null) {
            successCallback(channel.unreadCount);
        }
        else {
            successCallback(0);
        }
    };
    ApplozicChat.prototype.getUnreadCountForContact = function (contactId, successCallback) {
        var alContactService = new ALContactService();
        var contact = alContactService.loadContactByKeyValue('userId', contactId);
        if (contact !== null) {
            successCallback(contact.unreadCount);
        }
        else {
            successCallback(0);
        }
    };
    ApplozicChat.prototype.defaultSettings = function () {
        ALApplozicSettings.setStatusBarBGColor(UIColor.colorWithRedGreenBlueAlpha(66.0 / 255, 173.0 / 255, 247.0 / 255, 1));
        ALApplozicSettings.setColorForNavigation(UIColor.colorWithRedGreenBlueAlpha(66.0 / 255, 173.0 / 255, 247.0 / 255, 1));
        ALApplozicSettings.setColorForNavigationItem(UIColor.whiteColor);
        ALApplozicSettings.hideRefreshButton(false);
        ALUserDefaultsHandler.setNavigationRightButtonHidden(false);
        ALUserDefaultsHandler.setBottomTabBarHidden(false);
        ALApplozicSettings.setTitleForConversationScreen('Chats');
        ALApplozicSettings.setTitleForBackButtonMsgVC('Back');
        ALApplozicSettings.setTitleForBackButtonChatVC('Back');
        ALApplozicSettings.setSendMsgTextColor(UIColor.whiteColor);
        ALApplozicSettings.setReceiveMsgTextColor(UIColor.grayColor);
        ALApplozicSettings.setColorForReceiveMessages(UIColor.colorWithRedGreenBlueAlpha(255 / 255, 255 / 255, 255 / 255, 1));
        ALApplozicSettings.setColorForSendMessages(UIColor.colorWithRedGreenBlueAlpha(66.0 / 255, 173.0 / 255, 247.0 / 255, 1));
        ALApplozicSettings.setCustomMessageBackgroundColor(UIColor.lightGrayColor);
        ALApplozicSettings.setCustomMessageFont('Helvetica');
        ALApplozicSettings.setDateColor(UIColor.colorWithRedGreenBlueAlpha(51.0 / 255, 51.0 / 255, 51.0 / 255, 0.5));
        ALApplozicSettings.setMsgDateColor(UIColor.blackColor);
        ALApplozicSettings.enableMessageDeleteForAllOption(true);
        ALApplozicSettings.setAbuseWarningText('AVOID USE OF ABUSE WORDS');
        ALApplozicSettings.setMessageAbuseMode(true);
        ALApplozicSettings.setReceiverUserProfileOption(false);
        ALApplozicSettings.setMaxCompressionFactor(0.1);
        ALApplozicSettings.setMaxImageSizeForUploadInMB(3);
        ALApplozicSettings.setMultipleAttachmentMaxLimit(5);
        ALApplozicSettings.setGroupOption(true);
        ALApplozicSettings.setGroupInfoDisabled(false);
        ALApplozicSettings.setGroupInfoEditDisabled(true);
        ALApplozicSettings.setGroupExitOption(true);
        ALApplozicSettings.setGroupMemberAddOption(true);
        ALApplozicSettings.setGroupMemberRemoveOption(true);
        ALApplozicSettings.setVisibilityForNoMoreConversationMsgVC(false);
        ALApplozicSettings.setEmptyConversationText('You have no conversations yet');
        ALApplozicSettings.setVisibilityForOnlineIndicator(true);
        ALApplozicSettings.setColorForSendButton(UIColor.colorWithRedGreenBlueAlpha(66.0 / 255, 173.0 / 255, 247.0 / 255, 1));
        ALApplozicSettings.setColorForTypeMsgBackground(UIColor.clearColor);
        ALApplozicSettings.setMsgTextViewBGColor(UIColor.lightGrayColor);
        ALApplozicSettings.setPlaceHolderColor(UIColor.grayColor);
        ALApplozicSettings.setVisibilityNoConversationLabelChatVC(true);
        ALApplozicSettings.setBGColorForTypingLabel(UIColor.colorWithRedGreenBlueAlpha(242 / 255.0, 242 / 255.0, 242 / 255.0, 1));
        ALApplozicSettings.setTextColorForTypingLabel(UIColor.colorWithRedGreenBlueAlpha(51.0 / 255, 51.0 / 255, 51.0 / 255, 0.5));
        ALApplozicSettings.setColorForToastText(UIColor.blackColor);
        ALApplozicSettings.setColorForToastBackground(UIColor.grayColor);
        ALApplozicSettings.setUnreadCountLabelBGColor(UIColor.purpleColor);
        ALApplozicSettings.setCustomClassName('ALChatManager');
        ALUserDefaultsHandler.setFetchConversationPageSize(60);
        ALApplozicSettings.setMaxTextViewLines(4);
        ALUserDefaultsHandler.setDebugLogsRequire(true);
        ALApplozicSettings.setFontFace('Helvetica');
        ALApplozicSettings.replyOptionEnabled(true);
        ALUserDefaultsHandler.setGoogleMapAPIKey('AIzaSyBnWMTGs1uTFuf8fqQtsmLk-vsWM7OrIXk');
        ALApplozicSettings.setUserDeletedText('User has been deleted');
        ALApplozicSettings.setChatListTabIcon('');
        ALApplozicSettings.setChatListTabTitle('');
        ALApplozicSettings.setProfileTabTitle('');
    };
    return ApplozicChat;
}(applozic_chat_common_1.Common));
exports.ApplozicChat = ApplozicChat;
//# sourceMappingURL=applozic-chat.ios.js.map