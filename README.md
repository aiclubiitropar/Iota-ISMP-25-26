# 🤖 Human or Bot? | ISMP Freshers Chat App

An engaging anonymous chat app designed for IIT Ropar freshers during ISMP sessions — where participants are paired with either another student or an AI chatbot, and must guess who they were chatting with.

---

## 🧠 Concept

* Users click **Start Chat** and are randomly matched with either:

  * Another human (1 in 3 chance),
  * Or a Groq-API powered AI bot pretending to be a fresher.
* After 5 minutes of chatting, users are asked to **guess** whether their partner was human or bot.
* Scores are tracked and shown on a **leaderboard** — Exponentially decaying from 100 based on how fast you can tell the difference. The player gets a -50 for an incorrect answer.

---

## 🚀 Tech Stack

* **Frontend**: React (Next.js)
* **Backend**: API Routes with in-memory session management
* **Database**: MongoDB (for guesses, scores)
* **AI**: deepseek-r1-distill-llama-70b (acts as a convincing IIT Ropar fresher)
* **Deployment**: Vercel

---

## 📁 Project Structure

```
ismp/
├── app/
│   ├── api/
│   │   ├── check-guessed/
│   │   │   └── route.js
│   │   ├── get-result/
│   │   │   └── route.js
│   │   ├── leaderboard/
│   │   │   └── route.js
│   │   ├── match/
│   │   │   └── route.js
│   │   ├── register-user/
│   │   │   └── route.js
│   │   ├── room-info/
│   │   │   └── route.js
│   │   ├── send/
│   │   │   └── route.js
│   │   ├── submit-guess/
│   │   │   └── route.js
│   │   └── check-match/
│   │       └── route.js
│   ├── chat/
│   │   └── [roomId]/
│   │       └── page.jsx
│   ├── leaderboard/
│   │   └── page.jsx
│   ├── result/
│   │   ├── page.jsx
|   |   └── timer.jsx     # The Timer component for result page
│   ├── page.jsx         # Home page
│   └── globals.css      # (if using global styles)
├── app/lib/
│   ├── groq.js
│   ├── matchQueue.js
│   └── mongodb.js
├── public/
│   └── ...              # Static assets (images, etc.)
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

---

## 🛠️ Setup & Installation

### 1. Clone the Repo

```bash
git clone https://github.com/aiclubiitropar/Iota-ISMP-25-26.git
cd ismp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file:

```
MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
```

### 4. Run the App

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to use the app locally.

---

## 🥪 Testing the Flow

1. Go to home page → click **Start Chat**
2. Wait for a partner (or bot) → Chat
3. After 5 minutes → Guess page appears
4. Guess → See result → View leaderboard

---

## 📊 Features

* Anonymous chat pairing (real-time feel via polling)
* AI chatbot with believable personality
* Time-based chat session with auto redirection
* Guess feedback and scoring
* Leaderboard to show top guessers

---

## 🧹 Memory Management

* In-memory structures handle:

  * Queue of waiting users
  * User → Room mapping
  * Room start time
* These are cleaned up after the result page is loaded.

---

## 🎓 Context

This project was built for the **ISMP (Institute Student Mentorship Programme)** at **IIT Ropar**, to creatively engage incoming freshers and spark curiosity about AI and software systems.

---

## 📬 Contact

Brought to life by Team Iota Cluster.

If you'd like to contribute or replicate this for your own event, feel free to reach out.
