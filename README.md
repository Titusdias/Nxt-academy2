# NXT Academy website

The complete editable website project is in this folder.

## Run locally

Open a terminal in this folder and run:

```powershell
npm run dev
```

Open http://localhost:3000 in your browser. Press Ctrl+C in the terminal to stop.

Dependencies are already installed. If you move the project to another computer, install Node.js and run `npm ci` first.

## Project files

- `app/page.tsx`: main page and course cards
- `app/components/ReferenceHero.tsx`: header and hero
- `app/components/AcademySections.tsx`: academy sections
- `app/components/Experience.tsx`: contact and WhatsApp enquiry form
- `app/globals.css` and `app/reference.css`: styling and responsive layouts
- `public/`: logo and generated classroom images
- `package.json` and `package-lock.json`: scripts and dependencies
- `out/`: production static website from the latest build

Run `npm run build` to regenerate `out/`. This project uses static export; serve `out/` with a static web server rather than `npm start`.

Some illustrative gallery/course photos load from Unsplash and require internet access. The logo and generated classroom hero images are local. The enquiry form prepares a WhatsApp message; the visitor reviews and sends it through WhatsApp. There is no database or backend form submission.

Sites hosting configuration is in `.openai/hosting.json`. Local development does not require publishing or a Sites login.
