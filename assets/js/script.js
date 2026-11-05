// ── Avatar helpers ────────────────────────────────────────────────────────────

const SKIP_WORDS = new Set(['of', 'and', 'the', 'for', 'at']);

// First letters of the first two meaningful words ("University of Missouri" → "UM").
function initials(name) {
  const words = name.trim().split(/[\s-]+/).filter(w => !SKIP_WORDS.has(w.toLowerCase()));
  return words.length >= 2
    ? (words[0][0] + words[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

// Monogram tile. `label` overrides the computed initials (e.g. "IYTE").
function avatarEl(name, label) {
  const div = document.createElement('div');
  div.className = 'entry-avatar';
  div.textContent = label || initials(name);
  div.setAttribute('aria-hidden', 'true');
  return div;
}

// ── Favicon & meta ────────────────────────────────────────────────────────────

function setFavicon(name) {
  const abbr = initials(name);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>`
    + `<rect width='100' height='100' rx='15' fill='%239a3412'/>`
    + `<text x='50' y='68' font-family='Arial' font-weight='bold' font-size='42' `
    + `text-anchor='middle' fill='white'>${abbr}</text></svg>`;
  document.getElementById('favicon').href = `data:image/svg+xml,${svg}`;
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

function renderPersonal(p) {
  document.title = `${p.name} — ${p.title}`;
  setFavicon(p.name);

  document.getElementById('name').textContent = p.name;
  document.getElementById('job-title').textContent = p.title;

  // Social icons
  const socialEl = document.getElementById('social-links');
  if (p.linkedin) {
    socialEl.insertAdjacentHTML('beforeend',
      `<a href="${p.linkedin}" target="_blank" aria-label="LinkedIn">
         <i class="fa-brands fa-linkedin"></i>
       </a>`);
  }
  if (p.github) {
    socialEl.insertAdjacentHTML('beforeend',
      `<a href="${p.github}" target="_blank" aria-label="GitHub">
         <i class="fa-brands fa-github"></i>
       </a>`);
  }

  // Contact lines
  const contactEl = document.getElementById('contact-info');
  const items = [
    p.location ? `<i class="fa-solid fa-location-dot"></i> ${p.location}` : null,
    p.email    ? `<i class="fa-solid fa-envelope"></i> ${p.email}`         : null,
    p.phone    ? `<i class="fa-solid fa-phone"></i> ${p.phone}`            : null,
  ].filter(Boolean);
  items.forEach(html => {
    contactEl.insertAdjacentHTML('beforeend', `<p class="location">${html}</p>`);
  });
}

function renderSummary(summary) {
  document.getElementById('intro-summary').textContent = summary;
}

function renderSkills(skills) {
  const el = document.getElementById('sidebar-skills');
  const groupsHTML = skills.map(g => `
    <div class="skill-group">
      <h3>${g.category}</h3>
      <div class="badges">
        ${g.items.map(item => `<span class="badge">${item}</span>`).join('')}
      </div>
    </div>`).join('');
  el.innerHTML = `<h2>SKILLS</h2>${groupsHTML}`;
}

function renderProjects(projects) {
  const section = document.getElementById('projects');
  const navLink = document.querySelector('.nav-link[href="#projects"]');
  if (!projects || projects.length === 0) {
    section.remove();
    if (navLink) navLink.remove();
    return;
  }
  document.getElementById('project-entries').innerHTML = projects.map(p => `
    <li class="project">
      <div class="project-head">
        <a href="${p.url}" target="_blank" rel="noopener noreferrer">${p.name}
          <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a>
        <span class="project-stack">${(p.stack || []).join(' · ')}</span>
      </div>
      <p>${p.description}</p>
    </li>`).join('');
}

// ── Entry cards ───────────────────────────────────────────────────────────────

function datePill(startDate, endDate, current) {
  const cls = current ? 'entry-date current' : 'entry-date';
  return `<p class="${cls}">${startDate} &ndash; ${endDate}</p>`;
}

// Bullets shown before the "Show more" toggle.
const VISIBLE_BULLETS = 3;

// Turns **text** into <strong>text</strong> so key results stand out.
function formatHighlight(text) {
  return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

// collapsed: hide every bullet behind the toggle (used for older roles).
function bulletList(highlights, collapsed) {
  if (!highlights || highlights.length === 0) return '';
  const visible = collapsed ? 0 : VISIBLE_BULLETS;
  const items = highlights.map((h, i) =>
    `<li${i >= visible ? ' class="extra"' : ''}>${formatHighlight(h)}</li>`).join('');
  const hidden = highlights.length - visible;
  if (hidden <= 0) return `<ul>${items}</ul>`;

  const label = collapsed ? 'Show details' : `Show ${hidden} more`;
  return `<ul class="is-collapsed">${items}</ul>
    <button type="button" class="toggle-more" aria-expanded="false" data-label="${label}">
      <span>${label}</span> <i class="fa-solid fa-chevron-down"></i>
    </button>`;
}

function initToggles() {
  document.querySelectorAll('.toggle-more').forEach(btn => {
    btn.addEventListener('click', () => {
      const list = btn.previousElementSibling;
      const expanded = list.classList.toggle('is-collapsed') === false;
      btn.setAttribute('aria-expanded', String(expanded));
      btn.querySelector('span').textContent = expanded ? 'Show less' : btn.dataset.label;
    });
  });
}

function buildEntryCard(orgName, subtitle, location, startDate, endDate, current, highlights, collapsed, label) {
  const card = document.createElement('div');
  card.className = 'entry';

  const body = document.createElement('div');
  body.className = 'entry-body';
  body.innerHTML = `
    <div class="entry-header">
      <div class="entry-title">
        <h3>${orgName}</h3>
        <p class="entry-subtitle">${subtitle}${location ? ` &bull; ${location}` : ''}</p>
      </div>
      ${datePill(startDate, endDate, current)}
    </div>
    ${bulletList(highlights, collapsed)}`;

  card.appendChild(avatarEl(orgName, label));
  card.appendChild(body);
  return card;
}

function renderEducation(education) {
  const container = document.getElementById('education-entries');
  education.forEach((edu, i) => {
    container.appendChild(
      buildEntryCard(edu.institution, edu.degree, null, edu.startDate, edu.endDate, false, edu.highlights, edu.collapsed, edu.initials)
    );
  });
}

function renderExperience(experience) {
  const container = document.getElementById('experience-entries');
  experience.forEach((exp, i) => {
    container.appendChild(
      buildEntryCard(exp.company, exp.role, exp.location, exp.startDate, exp.endDate, exp.current, exp.highlights, exp.collapsed, exp.initials)
    );
  });
}

// ── Scroll spy ────────────────────────────────────────────────────────────────

function initScrollSpy() {
  const sections = [...document.querySelectorAll('.content-section[id]')];
  const navLinks = [...document.querySelectorAll('.nav-link[href^="#"]')];

  const setActive = id => {
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
  };

  // Active = last section whose top has passed 30% of the viewport.
  // At the bottom of the page, the last section wins even if it is short
  // and its top never reaches that line.
  const update = () => {
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom) return setActive(sections[sections.length - 1].id);

    const line = window.innerHeight * 0.3;
    let current = sections[0];
    sections.forEach(s => { if (s.getBoundingClientRect().top <= line) current = s; });
    setActive(current.id);
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}

// ── Theme switch ──────────────────────────────────────────────────────────────
// Preference is 'system' | 'light' | 'dark'; data-theme holds the resolved value.

function initThemeSwitch() {
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const buttons = document.querySelectorAll('[data-theme-choice]');

  const apply = pref => {
    const dark = pref === 'dark' || (pref === 'system' && media.matches);
    root.dataset.theme = dark ? 'dark' : 'light';
    root.dataset.themePref = pref;
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.themeChoice === pref)));
  };

  buttons.forEach(b => b.addEventListener('click', () => {
    const pref = b.dataset.themeChoice;
    try { localStorage.setItem('theme', pref); } catch (e) { /* storage blocked: still applies for this visit */ }
    apply(pref);
  }));

  // Follow OS changes while on "System".
  media.addEventListener('change', () => {
    if (root.dataset.themePref === 'system') apply('system');
  });

  apply(root.dataset.themePref || 'system');
}

initThemeSwitch();

// ── Bootstrap ─────────────────────────────────────────────────────────────────

fetch('resume.json')
  .then(res => {
    if (!res.ok) throw new Error(`Could not load resume.json (${res.status})`);
    return res.json();
  })
  .then(data => {
    renderPersonal(data.personal);
    renderSummary(data.summary);
    renderSkills(data.skills);
    renderEducation(data.education);
    renderExperience(data.experience);
    renderProjects(data.projects);
    initToggles();
    initScrollSpy();
  })
  .catch(err => {
    console.error('Failed to load resume data:', err);
    document.getElementById('load-error').hidden = false;
    document.querySelectorAll('.content-section').forEach(s => { s.hidden = true; });
  });
