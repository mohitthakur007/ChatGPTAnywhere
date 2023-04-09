// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("consumer message");
  if (message.type === "ASK_CHATGPT") {
    let originalActiveElement;
    let text;

    // If there's an active text input
    if (
      document.activeElement &&
      (document.activeElement.isContentEditable ||
        document.activeElement.nodeName.toUpperCase() === "TEXTAREA" ||
        document.activeElement.nodeName.toUpperCase() === "INPUT")
    ) {
      // Set as original for later
      originalActiveElement = document.activeElement;
      // Use selected text or all text in the input
      text =
        document.getSelection().toString().trim() ||
        document.activeElement.textContent.trim();
    } else {
      // If no active text input use any selected text on page
      text = document.getSelection().toString().trim();
    }

    if (!text) {
      alert(
        "No text found. Select this option after right clicking on a textarea that contains text or on a selected portion of text."
      );
      return;
    }

    showLoadingCursor();

    // Send the text to the API endpoint
    const apiEndpoint = "https://api.openai.com/v1/completions";
    const apiKey = "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"; // replace with your own API key
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    };

    const requestBody = {
      model: "text-davinci-003",
      prompt: text,
      max_tokens: 500,
      temperature: 0
    };

    fetch(apiEndpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody)
    })
      .then((response) => response.json())
      .then(async (data) => {
        // Use original text element and fallback to current active text element
        const generatedText = data.choices[0].text;
        const activeElement =
          originalActiveElement ||
          (document.activeElement.isContentEditable && document.activeElement);

        if (activeElement) {
          if (
            activeElement.nodeName.toUpperCase() === "TEXTAREA" ||
            activeElement.nodeName.toUpperCase() === "INPUT"
          ) {
            // Insert after selection
            activeElement.value =
              activeElement.value.slice(0, activeElement.selectionEnd) +
              `\n\n${generatedText}` +
              activeElement.value.slice(
                activeElement.selectionEnd,
                activeElement.length
              );
          } else {
            // Special handling for contenteditable
            const replyNode = document.createTextNode(`\n\n${generatedText}`);
            const selection = window.getSelection();

            if (selection.rangeCount === 0) {
              selection.addRange(document.createRange());
              selection.getRangeAt(0).collapse(activeElement, 1);
            }

            const range = selection.getRangeAt(0);
            range.collapse(false);

            // Insert reply
            range.insertNode(replyNode);

            // Move the cursor to the end
            selection.collapse(replyNode, replyNode.length);
          }
        } else {
          // Alert reply since no active text area
          alert(`ChatGPT says: ${generatedText}`);
        }

        restoreCursor();
      })
      .catch((error) => {
        restoreCursor();
        alert(
          "Error. Make sure you're running the server by following the instructions on https://github.com/gragland/chatgpt-chrome-extension. Also make sure you don't have an adblocker preventing requests to localhost:3000."
        );
        throw new Error(error);
      });
  }
});

const showLoadingCursor = () => {
  const style = document.createElement("style");
  style.id = "cursor_wait";
  style.innerHTML = `* {cursor: wait;}`;
  document.head.insertBefore(style, null);
};

const restoreCursor = () => {
  document.getElementById("cursor_wait").remove();
};
