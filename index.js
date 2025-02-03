let selectedModel;
let maxLines = 10;
const lineHeight = 20;
const messageArray = []; //in memory chat history --> to be upgraded to a session based one
const OLLAMA_BASE_URL = "http://localhost:11434"

async function fetchModels(selectElements){
    const response = await fetch(OLLAMA_BASE_URL + "/api/tags")
    const json = await response.json();
    updateModelDropDown(json.models, selectElements);
}

function updateModelDropDown(models, selectElement){
    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.name;
        option.textContent = model.model;
        if (model.name.toLowerCase().includes("mistral")) {
            option.selected = true;
            selectedModel = model.name;
        }
        selectElement.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', () => {

    const selectElement = document.getElementById('model-select');
    fetchModels(selectElement);

    selectElement.addEventListener('change', (event) => {
        selectedModel = event.target.value;
        console.log(selectedModel)
    })

    

    const textArea = document.getElementById('input')
    const sendBtn = document.getElementById('sendBtn');
    const clearBtn = document.getElementById('clearBtn');
    const outputDiv = document.getElementById('output');


    let isAtBottom = true;

    clearBtn.addEventListener("click", () => {
        textArea.value = "";
    });


    sendBtn.addEventListener("click", async () => {
        const inputEvent = new Event('input');
        isAtBottom = true
        const userMessageElement = createADialogue(textArea.value, true);

        // Append user message
        outputDiv.appendChild(userMessageElement);
        userMessageElement.dispatchEvent(inputEvent);


        messageArray.push({
            role: "user",
            content: document.getElementById('input').value
        });

        // Create bot message and append it
        const botMessage = createADialogue("Loading...", false);
        outputDiv.appendChild(botMessage);

        isAtBottom = outputDiv.scrollHeight - outputDiv.scrollTop === outputDiv.clientHeight;


        try {
            // Fetching Stream response.
            const response = await fetch(OLLAMA_BASE_URL + "/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    {
                        model: selectedModel,
                        messages: messageArray,
                        stream: true
                    }
                ),
            });

            const reader = response.body.getReader();
            let decoder = new TextDecoder();
            botMessage.value = ""; // Clear the initial text
            let thinking = false;
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const json = JSON.parse(decoder.decode(value, { stream: true }));

                if (json.message) {
                    if (!thinking) {
                        botMessage.value += json.message.content;
                    }
                    if (json.message.content.startsWith("<think>") && selectedModel.includes('deepseek')) { //deepseek has a think clause
                        thinking = true;
                        botMessage.value = "thinking...";
                    }
                    if (json.message.content.startsWith("</think>") && selectedModel.includes('deepseek')) { 
                        thinking = false;
                        botMessage.value = "";
                    }

                }


                const inputEvent = new Event('input');
                botMessage.dispatchEvent(inputEvent);

                if (isAtBottom) {
                    outputDiv.scrollTop = outputDiv.scrollHeight;
                }
            }

            messageArray.push({
                role: "assistance",
                content: botMessage.value
            });

        } catch (error) {
            botMessage.value = "Error getting response!";
        }


    });


    const adjustHeight = () => {
        let linesCount = textArea.value.split("\n").length;

        let newHight = Math.min(linesCount, maxLines) * lineHeight;
        if (newHight < 50) {
            textArea.style.height = 50 + "px";
        } else {
            textArea.style.height = newHight + "px";
        }
    };

    textArea.addEventListener("input", adjustHeight);



    const createADialogue = (message, isSelf) => {

        const divElement = document.createElement('textarea');
        divElement.classList.add(`${isSelf ? "user" : "bot"}-message`);
        divElement.value = message;
        divElement.readOnly = true;
        
        divElement.style.height = 'auto';
        divElement.style.height = divElement.scrollHeight + 'px';

        const adjustHeightTextArea = (event) => {
            if (hasLeadingWhitespace(event.target.value)) {
                event.target.value = event.target.value.trimStart();
            }
            event.target.style.height = (event.target.scrollHeight) + 'px';
        }

        const adjustHeightWhenScreenChanges = (event) => {
            event.target.style.height = 'auto';
            event.target.style.height =  event.target.scrollHeight + 'px';
        };

        divElement.addEventListener('input', adjustHeightTextArea);

        //Custom Event
        divElement.addEventListener('screenSizeChanged', adjustHeightWhenScreenChanges);

        if (isAtBottom) {
            outputDiv.scrollTop = outputDiv.scrollHeight;
        }

        return divElement;
    }

    //to check if the user has scrolled up while appending the response
    outputDiv.addEventListener('scroll', () => {
        const outputDiv = document.getElementById('output');
        isAtBottom = outputDiv.scrollHeight - outputDiv.scrollTop === outputDiv.clientHeight;
        if (!isAtBottom) {
            isAtBottom = false;
        } else {
            isAtBottom = true;
        }
    });

    
    //Custom event to triger when there is change in size of the window
    window.addEventListener('resize', () => {
        const event = new CustomEvent('screenSizeChanged');
        const children = Array.from(document.getElementById('output').children);
        children.forEach(element => {
            element.dispatchEvent(event)
        });
    })


    function hasLeadingWhitespace(str) {
        return /^\s/.test(str);
    }

})


