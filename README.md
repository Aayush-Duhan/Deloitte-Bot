# 🧠 AI-Powered Order Automation System (Deloitte Project)

An intelligent, scalable order automation tool built for manufacturing workflows. This system processes email-based orders using AI-powered filtering (Langflow + OpenAI), generates real-time confirmations, and reduces manual intervention for B2B order fulfillment.


## 🚀 Features

- 🔍 **AI Email Parsing**: Extracts and validates order data using Langflow and OpenAI.
- ⚙️ **Automated Fulfillment**: Sends real-time order acknowledgments and error alerts via email.
- 📊 **Admin Dashboard**: View and manage order logs and system health in a clean React interface.
- 🧠 **Smart Filtering**: Identifies invalid or duplicate orders to prevent processing errors.
- 📈 **High Performance**: Processes 100+ concurrent orders with 60% faster execution.
- ✅ **Error Handling**: Robust fallback workflows and 99% data accuracy.

---

## 👥 Team

- [Aayush](https://github.com/Aayush-Duhan) - Full Stack Developer
- [Udit Sharma](https://github.com/UditSharma04) - Full Stack Developer

---

## 🧱 Tech Stack

**Backend:**
- Node.js, Express.js  
- Langflow + OpenAI (Email Understanding & Filtering)  
- Nodemailer (Email Automation)  
- MongoDB (Data Storage)

**Frontend (Admin Panel):**
- React.js, Vite  
- Tailwind CSS  
- React Router, React Icons, React Query, Hot Toast

---

## 🛠️ System Architecture
![Image](https://github.com/user-attachments/assets/7980b229-ce4c-4861-85ea-29b1a1abbf08)

## Folder Structure
```plsql
root/
├── client/        # Optional end-user UI
├── admin/         # React-based Admin Panel
└── server/        # Node.js backend with AI + Email processing
```


---

## ⚙️ Setup Instructions

### Backend
```bash
cd server
npm install
npm run dev
```
### Frontend (Admin Panel)
```bash
cd admin
npm install
npm run dev
```
### Client (Optional Public UI)
```bash
cd client
npm install
npm run dev
```
---

## 📊 Metrics
- 📥 75% reduction in manual processing
- ⚡ 60% faster execution time
- 🛡️ 99% data accuracy
- 🌐 100+ concurrent requests handled

---
🙌 Acknowledgements
Deloitte for providing the problem statement and review process

Langflow + OpenAI for the conversational AI foundation
