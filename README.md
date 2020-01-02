# 央央詩人
一位平時喜歡吟詩作對、文情雅致的央央才子，專門拯救央央那些不善言辭的理工男，讓他們可以用詩詞親近文院妹子。

- This bot has been created using [Bot Framework](https://dev.botframework.com), you can upload an image then this bot will write a poem for you.
- This bot using [小冰寫詩](https://poem.msxiaobing.com/) to write poem.
- You can talk to this Bot via Line. (Scan following QRcode):
![](https://i.imgur.com/dDAMtwO.png)


## Prerequisites
- [Node.js](https://nodejs.org) version 10.14 or higher
    ```bash
    # determine node version
    node --version
    ```
# To run the bot locally
- Download the bot code from the Build blade in the Azure Portal (make sure you click "Yes" when asked "Include app settings in the downloaded zip file?").
    - If you clicked "No" you will need to copy all the Application Settings properties from your App Service to your local .env file.
- Install modules
    ```bash
    npm install
    ```
- Run the bot
    ```bash
    npm start
    ```

# Testing the bot using Bot Framework Emulator
[Bot Framework Emulator](https://github.com/microsoft/botframework-emulator) is a desktop application that allows bot developers to test and debug their bots on localhost or running remotely through a tunnel.

- Install the Bot Framework Emulator version 4.5.2 or greater from [here](https://github.com/Microsoft/BotFramework-Emulator/releases)

## Connect to the bot using Bot Framework Emulator
- Launch Bot Framework Emulator
- File -> Open Bot
- Enter a Bot URL of `http://localhost:3978/api/messages`