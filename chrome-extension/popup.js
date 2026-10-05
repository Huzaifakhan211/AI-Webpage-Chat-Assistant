const readPageButton = document.getElementById("readPage");
const sendButton = document.getElementById("sendButton");
const questionInput = document.getElementById("question");

const chatContainer = document.getElementById("chatContainer");
const welcomeMessage = document.getElementById("welcomeMessage");

const pageTitle = document.getElementById("pageTitle");
const statusDot = document.getElementById("statusDot");

const loading = document.getElementById("loading");
const clearChatButton = document.getElementById("clearChat");

let pageLoaded = false;


// =========================
// GET CURRENT PAGE
// =========================

async function getCurrentPage() {

    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    return tab;
}


// =========================
// READ WEBPAGE
// =========================

readPageButton.addEventListener("click", async () => {

    try {

        readPageButton.disabled = true;
        readPageButton.innerText = "Reading...";

        const tab = await getCurrentPage();

        pageTitle.innerText =
            tab.title || "Current webpage";

        const results = await chrome.scripting.executeScript({
            target: {
                tabId: tab.id
            },

            func: () => document.body.innerText
        });

        const pageText = results[0].result;

        if (!pageText || pageText.trim().length === 0) {

            throw new Error(
                "Could not extract text from this webpage."
            );
        }


        // Send webpage to backend

        const response = await fetch(
            "http://127.0.0.1:8000/webpage",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    text: pageText
                })
            }
        );


        if (!response.ok) {

            throw new Error(
                "Backend error: " + response.status
            );
        }


        const data = await response.json();

        console.log("Backend response:", data);


        // Page successfully loaded

        pageLoaded = true;

        statusDot.classList.add("active");

        readPageButton.innerText = "Page Ready";

        readPageButton.disabled = false;


        // Remove welcome screen

        if (welcomeMessage) {
            welcomeMessage.remove();
        }


        addAIMessage(
            "The webpage has been successfully loaded. You can now ask questions about its content."
        );

    }

    catch (error) {

        console.error(error);

        readPageButton.innerText = "Read Page";
        readPageButton.disabled = false;

        addAIMessage(
            "Error: " + error.message
        );
    }

});


// =========================
// SEND QUESTION
// =========================

sendButton.addEventListener("click", sendQuestion);


questionInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();

        sendQuestion();
    }

});


// =========================
// ASK BACKEND
// =========================

async function sendQuestion() {

    const question = questionInput.value.trim();


    if (!question) {
        return;
    }


    if (!pageLoaded) {

        addAIMessage(
            "Please click 'Read Page' before asking questions."
        );

        return;
    }


    // Show user message

    addUserMessage(question);

    questionInput.value = "";

    sendButton.disabled = true;

    loading.classList.remove("hidden");


    try {

        const response = await fetch(
            "http://127.0.0.1:8000/ask",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    question: question
                })
            }
        );


        if (!response.ok) {

            throw new Error(
                "Backend error: " + response.status
            );
        }


        const data = await response.json();

        console.log("AI response:", data);


        addAIMessage(
            data.answer
        );

    }

    catch (error) {

        console.error(error);

        addAIMessage(
            "Sorry, something went wrong: " +
            error.message
        );

    }

    finally {

        loading.classList.add("hidden");

        sendButton.disabled = false;

        questionInput.focus();
    }

}


// =========================
// ADD USER MESSAGE
// =========================

function addUserMessage(message) {

    const messageElement =
        document.createElement("div");

    messageElement.className =
        "message user";


    messageElement.innerHTML = `
        <div class="message-content">
            ${escapeHTML(message)}
        </div>
    `;


    chatContainer.appendChild(
        messageElement
    );


    scrollToBottom();
}


// =========================
// ADD AI MESSAGE
// =========================

function addAIMessage(message) {

    const messageElement =
        document.createElement("div");

    messageElement.className =
        "message ai";


    messageElement.innerHTML = `
        <div class="message-content">
            ${escapeHTML(message)}
        </div>
    `;


    chatContainer.appendChild(
        messageElement
    );


    scrollToBottom();
}


// =========================
// CLEAR CHAT
// =========================

clearChatButton.addEventListener(
    "click",
    () => {

        chatContainer.innerHTML = "";

        addAIMessage(
            "Chat cleared. You can continue asking questions about the webpage."
        );

    }
);


// =========================
// SUGGESTION BUTTONS
// =========================

document.addEventListener(
    "click",
    function (event) {

        if (
            event.target.classList.contains(
                "suggestion"
            )
        ) {

            questionInput.value =
                event.target.innerText;

            sendQuestion();
        }

    }
);


// =========================
// AUTO SCROLL
// =========================

function scrollToBottom() {

    chatContainer.scrollTop =
        chatContainer.scrollHeight;
}


// =========================
// SECURITY
// =========================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}