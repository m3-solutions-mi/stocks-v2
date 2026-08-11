async function askGeminiAboutPage() {
    // 1. Extract the current page text
    const pageText = document.body.innerText;
    const question = "Summarize the main points of this page.";

    // 2. Check if the prompt API is available
    if ('ai' in window && 'assistant' in window.ai) {
        try {
            // 3. Create a session with Gemini Nano
            const session = await window.ai.assistant.create();

            // 4. Send the prompt with the page content
            const prompt = `Based on the following content:\n\n${pageText}\n\nQuestion: ${question}`;
            const response = await session.prompt(prompt);

            console.log("Gemini Response:", response);
        } catch (error) {
            console.error("Error generating response:", error);
        }
    } else {
        console.log("Gemini Nano is not available in this browser.");
    }
}