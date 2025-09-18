const API_KEY = " @@@"; // Replace with your actual API key
const MODEL_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const form = document.getElementById("ask-form");
const input = document.getElementById("question");
const chatBox = document.getElementById("chat-box");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const question = input.value.trim();
  if (!question) return;

  const userMsg = createMessage("user", question);
  chatBox.appendChild(userMsg);
  input.value = "";

  const botDiv = createMessage("bot", "Typing...");
  chatBox.appendChild(botDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  const body = {
    contents: [{ role: "user", parts: [{ text: question }] }],
    systemInstruction: {
      role: "system",
      parts: [{
        text: "You are a Data Structure and Algorithm Instructor. Only answer DSA-related queries. If the user asks anything unrelated, reply rudely."
      }]
    }
  };

  try {
    const res = await fetch(MODEL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "❌ No valid response.";

    botDiv.querySelector(".msg-content").textContent = "";
    typeEffect(botDiv.querySelector(".msg-content"), reply);
  } catch (err) {
    botDiv.querySelector(".msg-content").textContent = "❌ Error reaching Gemini API.";
  }
});

function createMessage(sender, text) {
  const div = document.createElement("div");
  div.className = `msg ${sender}-msg`;

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.style.backgroundImage = sender === "user"
    ? "url('https://cdn-icons-png.flaticon.com/512/1077/1077063.png')"
    : "url('https://cdn-icons-png.flaticon.com/512/4712/4712100.png')";

  const msgText = document.createElement("div");
  msgText.className = "msg-content";
  msgText.textContent = text;

  div.appendChild(avatar);
  div.appendChild(msgText);
  return div;
}

function typeEffect(element, text, speed = 25) {
  let i = 0;
  element.textContent = "";
  const interval = setInterval(() => {
    element.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
    chatBox.scrollTop = chatBox.scrollHeight;
  }, speed);
}