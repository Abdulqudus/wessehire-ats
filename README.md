# Wessehire ATS

A local-first recruiter workspace built with React, TypeScript, and Vite.

## Run locally

Prerequisite: Node.js 22.12 or newer.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. The demo starts with sample candidates, clients, jobs, notes, and follow-up reminders. Records are saved in this browser's local storage; no account or cloud credentials are needed.

## Demo flow

1. Search with **Ctrl+K** across candidate records, resume text, notes, job orders, and client contacts. Terms are AND by default; `OR` and `NOT` are supported. Save a query and custom-field filters as a smart list.
2. Open **Candidates** to switch between list and board views, filter by stage, visa status, or availability, and select records for outreach drafts.
3. Upload the example at `public/sample-resume.txt`, paste resume/profile text, or upload PDF/DOCX/TXT. Extraction happens in the browser; review the suggested name, email, and phone. Existing email, phone, or profile URLs are checked for duplicates.
4. Open **Jobs** to move candidates across pipeline stages, inspect fee/split terms, and build a submission narrative with target compensation and a character count.
5. Open **Clients** for account contacts and relationship details. **Reports** exports a CSV with selectable fields.
6. The call panel shows the recording disclosure, a simulated dialpad, note type and tags, browser speech-to-text, a local summary helper, and read-aloud. Saying “submit” prompts for a note type and saves the note when one is spoken.

## Keyboard

- `Ctrl/Cmd+K`: focus global search.
- `Ctrl/Cmd+N`: add a candidate.
- `Ctrl/Cmd+Shift+M`: open call notes for the selected candidate.
- `Ctrl/Cmd+Shift+R`: create a reminder for the selected candidate.
- `Ctrl/Cmd+Shift+S`: build a submission for the selected candidate.
- `Ctrl/Cmd+Shift+E`: draft outreach for the selected candidate.
- `Ctrl/Cmd+Shift+1..9`: move the selected candidate to a pipeline stage.

## Demo limitations

The dialpad and call session are simulations. They do not place a phone call or record audio. The disclosure is a script for a recruiter to share, not evidence of consent. Browser speech recognition availability and processing depend on the browser and settings. The “Summarize” action is a local extractive demo helper, and fit estimates use role/resume keyword overlap; neither calls a live AI model. Outreach is saved as a local draft and is not emailed. Broadbean, email, LinkedIn, and API cards are integration previews and are not connected. Follow your organization's privacy and consent requirements before handling real candidate information.

## Production deployment

The current demo uses browser storage only. A production release would add authenticated team access and a managed database/file store (for example, Supabase), deploy the frontend (for example, Vercel), and integrate a telephony provider (for example, Twilio) for actual calls and recording. Recording controls, consent handling, access policies, and retention should be implemented and reviewed before using candidate data in production.

Planning estimate for a small deployment: about **$0–$25/month** for early hosting and managed data tiers, plus roughly **$10–$20/year** for a domain. Telephony, recording storage, transcription, and compliance needs are additional, usage-based, and region-dependent. Verify current provider pricing before deployment.