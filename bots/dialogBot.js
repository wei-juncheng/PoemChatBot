// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler } = require('botbuilder');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
var request = require('request');
var chineseConv = require('chinese-conv');


class DialogBot extends ActivityHandler {
    /**
     *
     * @param {ConversationState} conversationState
     * @param {UserState} userState
     * @param {Dialog} dialog
     */
    constructor(conversationState, userState, dialog) {
        super();
        if (!conversationState) throw new Error('[DialogBot]: Missing parameter. conversationState is required');
        if (!userState) throw new Error('[DialogBot]: Missing parameter. userState is required');
        if (!dialog) throw new Error('[DialogBot]: Missing parameter. dialog is required');

        this.conversationState = conversationState;
        this.userState = userState;
        this.dialog = dialog;
        this.dialogState = this.conversationState.createProperty('DialogState');

        this.onMessage(async(context, next) => {
            console.log('Running dialog with Message Activity.');

            // Run the Dialog with the new message Activity.
            // await this.dialog.run(context, this.dialogState);
            if (context.activity.attachments && context.activity.attachments.length > 0) {
                // The user sent an attachment and the bot should handle the incoming attachment.
                await this.handleIncomingAttachment(context);
            }

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onDialog(async(context, next) => {
            // Save any state changes. The load happened during the execution of the Dialog.
            await this.conversationState.saveChanges(context, false);
            await this.userState.saveChanges(context, false);

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }

    /**
     * Saves incoming attachments to disk by calling `this.downloadAttachmentAndWrite()` and
     * responds to the user with information about the saved attachment or an error.
     * @param {Object} turnContext
     */
    async handleIncomingAttachment(turnContext) {
        // Prepare Promises to download each attachment and then execute each Promise.
        const promises = turnContext.activity.attachments.map(this.downloadAttachmentAndWrite);
        const successfulSaves = await Promise.all(promises);

        // Replies back to the user with information about where the attachment is stored on the bot's server,
        // and what the name of the saved file is.
        async function replyForReceivedAttachments(poem_content) {
            if (poem_content) {
                // Because the TurnContext was bound to this function, the bot can call
                await this.sendActivity(`${ poem_content.content }`);
            } else {
                await this.sendActivity('等等，這有點太難了，換一張簡單的吧');
            }
        }

        // Prepare Promises to reply to the user with information about saved attachments.
        // The current TurnContext is bound so `replyForReceivedAttachments` can also send replies.
        const replyPromises = successfulSaves.map(replyForReceivedAttachments.bind(turnContext));
        await Promise.all(replyPromises);
    }

    /**
     * Downloads attachment to the disk.
     * @param {Object} attachment
     */
    async downloadAttachmentAndWrite(attachment) {

        // Retrieve the attachment via the attachment's contentUrl.
        const url = attachment.contentUrl;

        // Local file path for the bot to save the attachment.
        const localFileName = path.join(__dirname, attachment.name);

        try {
            // arraybuffer is necessary for images
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            // If user uploads JSON file, this prevents it from being written as "{"type":"Buffer","data":[123,13,10,32,32,34,108..."
            if (response.headers['content-type'] === 'application/json') {
                response.data = JSON.parse(response.data, (key, value) => {
                    return value && value.type === 'Buffer' ? Buffer.from(value.data) : value;
                });
            }

            const img_base64 = await new Buffer.from(response.data, 'binary').toString('base64');
            //傳送至小冰


            const xiaobin_res = await axios.post("https://poem.msxiaobing.com/api/upload", {
                image: img_base64,
                userid: "e5cd78f0-4808-4c43-9b54-4f468e6aba16",
                text: "恐龍",
                guid: "353c23e7-0442-4c78-8acd-87f4ec7469cc"
            });

            const traditional_poem = await chineseConv.tify(xiaobin_res.data.OpenPoems[1].PoemContent);
            console.log(traditional_poem);
            return {
                content: traditional_poem
            };

        } catch (error) {
            // console.log("aa");
            console.error(error);
            return undefined;
        }

    }
}

module.exports.DialogBot = DialogBot;