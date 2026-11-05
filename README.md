# Eren Ufuktepe

Source for my personal website: **[erenufuktepe.github.io](https://erenufuktepe.github.io)**

Software engineer working on backend, data and ML platforms. The site is my online resume: experience, education and skills.

Find me on [LinkedIn](https://www.linkedin.com/in/eren-ufuktepe-a20081145/).

---

### Notes for myself

- **Content** lives in `resume.json`. Edit it, push to `main`, and GitHub Pages redeploys.
- **Title changes** also go in the `<title>`, `description` and `og:` tags in `index.html` (link previews read those).
- **Colors** are tokens at the top of `assets/css/style.css`: `:root` for light, `:root[data-theme="dark"]` for dark.
- **Bullets:** `**text**` bolds a phrase. `"collapsed": true` hides an older entry's details. `"current": true` highlights the current role.
- **Projects section** appears only if `resume.json` has a `projects` list (`name`, `url`, `stack`, `description`).
- **Preview locally:** `python -m http.server 8000`, then open http://localhost:8000. Opening `index.html` directly won't load the content.

---

© Eren Ufuktepe. The content and photo are personal and not licensed for reuse.
