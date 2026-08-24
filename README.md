# 🔐 Hidey — Hide it. Share it. Reveal it.

![Hidey Banner](public/og-image.png)

> A free, private, browser-based secret message encoder, quiz maker, and question-lock tool. No account. No server. No data stored anywhere.

[![Live Site](https://img.shields.io/badge/Live%20Site-tryhidey.xyz-F472A8?style=for-the-badge&logo=vercel&logoColor=white)](https://tryhidey.xyz)

[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)

[![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

---

## About

Hidey is a completely client-side web app that lets you encode secret messages, create shareable quizzes, and lock content behind questions — all without any account, login, or server. Everything runs in your browser. Your data never leaves your device.

**Live at:** [tryhidey.xyz](https://tryhidey.xyz)

---

## Features

**🔐 Message Mode**

Encode any text using four patterns — Alnum Blocks, Symbol Stream, Caps Blast, Hex Weave. Add an optional passphrase for extra protection. Share via a formatted Share Card. Supports all languages and emoji up to 10,000 characters.

**🧩 Quiz Mode**

Create multiple choice quizzes up to 100 questions. Generate a compact HIDEYQ code to share. Recipients attempt the quiz and return a HIDEYS score code. Optional passphrase and Score Key protection.

**❓ Question Mode**

Lock a secret message behind a question. Only the correct answer reveals it. SHA-256 hashing verifies the answer. Challenge codes never expire.

**🌙 Dark Mode**

Full dark mode with system preference detection and localStorage persistence.

**📱 PWA**

Install on Android or iPhone home screen. Works offline after first load.

---

## Tech Stack

React 18 · TypeScript · Vite · Tailwind CSS · shadcn/ui · Radix UI · pako · Zod · React Router · Web Crypto API · qrcode.react · Lucide React · Sonner

---

## Security

- **100% Client-Side** — nothing ever sent to a server
- **SHA-256 Hashing** — via native Web Crypto API
- **Salted Hashing** — answer combined with question text prevents rainbow table attacks
- **Constant-Time Comparison** — prevents timing attacks
- **Zod Validation** — all decoded payloads validated before use
- **Payload Size Limits** — prevents zip bomb style attacks

> ⚠️ Hidey uses obfuscation — not cryptographic encryption. Do not use it for passwords, financial data, or genuinely sensitive information. Use Signal for that.

---

## PWA Install

**Android:** Open in Chrome → Menu → Add to Home Screen

**iPhone:** Open in Safari → Share → Add to Home Screen

---

## Contact

**Roshani Gusain**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/roshani-gusain/)
[![Website](https://img.shields.io/badge/Website-tryhidey.xyz-F472A8?style=for-the-badge&logo=vercel&logoColor=white)](https://tryhidey.xyz)

[tryhidey.xyz/contact](https://tryhidey.xyz/contact)

---

<div align="center">

**Built with ❤️ by Roshani Gusain**

[Website](https://tryhidey.xyz) · [Blog](https://tryhidey.xyz/blog) · [FAQ](https://tryhidey.xyz/faq) · [Contact](https://tryhidey.xyz/contact)

*Hide it. Share it. Reveal it.*  
🌍 Supports all languages — Chinese, Japanese, Spanish, French, and every other script and emoji.

</div>
