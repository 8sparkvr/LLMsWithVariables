
let useAI = true;
let OpenAI = null;
let openai = null;

function parseValue(value) {
    
    let type = 'string'
    const isNum = isNumeric(value);

    if (isNum) {
        try {
            if (!isNaN(parseInt(aiVars[key]))) {
                value = parseInt(aiVars[key]);
                type = 'int'
            }
        } catch(e) {}
        if (type != 'int') {
            try {
                if (!isNaN(parseFloat(aiVars[key]))) {
                    value = parseFloat(aiVars[key]);
                    type = 'float'
                }
            } catch(e) {}
        }
    }

    return value;
}

function readVariables(aiMessage, aiVariables, socket) {

    let numVarsFound = 0;
    try {
        let aiVars = JSON.parse(aiMessage);
        console.log("aiVars", aiVars);
        for (key in aiVars)
        {
            let found = false;
            for (let i = 0; i < aiVariables.length; i++)
            {
                console.log("key == aiVariables[i].name" + key + " == " + aiVariables[i].name);
                if (key == aiVariables[i].name) {
                    aiVariables[i].value = aiVars[key];
                    found = true;
                    break;
                }
            }

            if (!found) {
                let type = 'string';
                let value = aiVars[key];
                
                const isNum = isNumeric(value);

                if (isNum) {
                    try {
                        if (!isNaN(parseInt(aiVars[key]))) {
                            value = parseInt(aiVars[key]);
                            type = 'int'
                        }
                    } catch(e) {}
                    if (type != 'int') {
                        try {
                            if (!isNaN(parseFloat(aiVars[key]))) {
                                value = parseFloat(aiVars[key]);
                                type = 'float'
                            }
                        } catch(e) {}
                    }
                }

                aiVariables.push({name: key, type: type, value: value, defaultValue: value});
            }
            numVarsFound++;
        }
        
        if (numVarsFound == 0) {
            for (let i = 0; i < aiVariables.length; i++) {
                let foundIndex = aiMessage.indexOf(aiVariables[i].name);
                if (foundIndex != -1) {
                    foundIndex += aiVariables[i].name.length + 1;
                    let foundIndex2 = aiMessage.indexOf(",", foundIndex);
                    if (foundIndex2 == -1)
                        foundIndex2 = aiMessage.indexOf(" ", foundIndex);
                    if (foundIndex2 == -1)
                        foundIndex2 = aiMessage.indexOf("\n", foundIndex);
                    if (foundIndex2 == -1)
                        foundIndex2 = aiMessage.indexOf("{", foundIndex);
                    if (foundIndex2 == -1)
                        foundIndex2 = aiMessage.indexOf("}", foundIndex);
                    if (foundIndex2 == -1)
                        foundIndex2 = aiMessage.length;
                    if (foundIndex2 != -1)
                        aiVariables[i].value = parseValue(aiMessage.substring(foundIndex, foundIndex2));
                }
            }
        }

        socket.emit('getVars', aiVariables);

    } catch(e) {
        console.log(e);
    }

    return aiVariables;
}

function isNumeric(str) {
    return /^-?\d*\.?\d+$/.test(str);
}

if (useAI)
{
    OpenAI = require("openai");
    openai = new OpenAI();
}

async function doAI(messages) {
    if (!openai)
        return "No AI";

    const completion = await openai.chat.completions.create({
      messages: messages,
      model: "gpt-3.5-turbo",
    });
  
    console.log("AI Says: " + completion.choices[0].message.content)
    return completion.choices[0].message.content;
  }

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'dist')));


io.on('connection', (socket) => {

    let aiVariables = [];

    let chatLogs = [{"role": "system", "content": ""}];

    let aiBusy = false;
    // console.log('A user connected');
    
    socket.on('reste', (msg) => {
        chatLogs = [{"role": "system", "content": ""}];
    });

    socket.on('chat message', async(msg) => {

        if (aiBusy)
            return;
        aiBusy = true;

        socket.emit('you message', msg);

        let preString = "";
        let postString = "";
        
        preString += "{\n";
        postString += "{\n";

        if (aiVariables.length > 0)
        {
            for (key in aiVariables)
            {   
                let theVar = aiVariables[key];
                preString += "  (" + theVar.type + ") \"" + theVar.name + "\": " + theVar.value + ",\n";
                postString += "\"" + theVar.name + "\":...,\n";
            } 
        } else {
            preString += "(None)\n";
            postString += "\" (VariableName) \":...,\n";
        }

        postString += "}";
        preString += "}\n";

        if (preString.length > 0) {
            theString = "\n";
            theString += "Input variables:\n"
            theString += preString;
            theString += "Give a human text response first, then at the end of this response, append a json string that looks like this: (add new variables if you think the user should track new things)\n";
            theString += "Output variables:\n"
            theString += postString + "\n";
            // chatLogs[0].content = theString;
            // console.log(chatLogs)
            msg += theString;
        }
        console.log("User says: ", msg);
        chatLogs.push({"role": "user", "content": msg});

        let aiMessage = await doAI(chatLogs);
        chatLogs.push({"role": "assistant", "content": aiMessage});

        socket.emit('ai message', aiMessage);

        let searchToken = "Output variables:";
        let outputIndex = aiMessage.indexOf(searchToken);
        // console.log("outputIndex", outputIndex);
        if (outputIndex != -1) {
            aiMessage = aiMessage.substring(outputIndex + searchToken.length);
        }
        else
        {
            searchToken = "{";
            outputIndex = aiMessage.indexOf(searchToken);
            if (outputIndex != -1)
                aiMessage = aiMessage.substring(outputIndex);
        }
        aiVariables = readVariables(aiMessage, aiVariables, socket);
        aiBusy = false;
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('setVars', (msg) => {
        aiVariables = msg;
        // console.log(msg);
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));