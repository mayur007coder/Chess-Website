import "./styles.css";

const pageContent = {
  learn: {
    title: "Learn Chess",
    description: "Build better chess habits with opening principles, tactical checks, and endgame basics.",
    eyebrow: "Chess Training",
    heading: "Improve One Move At A Time",
    intro:
      "Use these practical ideas before and after your games on Grandmaster Arena. The goal is simple: make fewer careless moves and understand your position faster.",
    cards: [
      {
        title: "Opening Principles",
        text:
          "Control the center, develop minor pieces early, castle before the position opens, connect your rooks, and avoid moving the same piece repeatedly without a clear reason.",
      },
      {
        title: "Tactical Checklist",
        text:
          "Before every move, scan for checks, captures, threats, loose pieces, back-rank weaknesses, pins, forks, skewers, and discovered attacks.",
      },
      {
        title: "Endgame Basics",
        text:
          "Activate your king, push passed pawns, place rooks behind passed pawns, cut off the enemy king, and trade pieces when you are ahead in material.",
      },
      {
        title: "How To Review",
        text:
          "After a game, find the first move where your plan changed. Ask what your opponent threatened, what you missed, and which candidate move was safer.",
      },
    ],
  },
  about: {
    title: "About Grandmaster Arena",
    description: "Learn about Grandmaster Arena, a browser chess site for playing and practicing chess.",
    eyebrow: "About",
    heading: "Grandmaster Arena",
    intro:
      "Grandmaster Arena is a browser chess website built for quick games, practice, and casual learning.",
    paragraphs: [
      "You can play against Stockfish, play over the board with a friend, review moves, and use training notes to build stronger chess habits.",
      "The site is designed to be simple, fast, and useful on both desktop and mobile devices.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    description: "Read the Grandmaster Arena privacy policy.",
    eyebrow: "Privacy Policy",
    heading: "Privacy Policy",
    intro:
      "Grandmaster Arena does not require an account to play chess and does not ask visitors to submit personal information inside the game.",
    paragraphs: [
      "If advertising, analytics, or embedded third-party services are added later, those services may use cookies or similar technologies according to their own policies. Visitors can control cookies through their browser settings.",
      "This website may collect basic technical information through hosting logs, such as browser type, device type, approximate region, pages visited, and error information. This information is used to keep the website reliable and improve the experience.",
      "Last updated: May 29, 2026.",
    ],
  },
  contact: {
    title: "Contact",
    description: "Contact the owner of Grandmaster Arena.",
    eyebrow: "Contact",
    heading: "Contact The Site Owner",
    intro:
      "For questions, suggestions, or website issues, contact the owner through the GitHub project.",
    paragraphs: [
      "GitHub: https://github.com/mayur007coder/Chess-Website",
      "mayurdhongders@gmail.com",
    ],
  },
};

const pageKey = document.body.dataset.page;
const page = pageContent[pageKey] || pageContent.about;
document.title = `${page.title} - Grandmaster Arena`;
document.querySelector('meta[name="description"]')?.setAttribute("content", page.description);

const app = document.querySelector("#app");
app.innerHTML = `
  <header class="topbar page-topbar">
    <a class="brand brand-link" href="/" aria-label="Grandmaster Arena home">
      <span class="brand-mark" aria-hidden="true">&#9812;</span>
      <div>
        <h1>Grandmaster Arena</h1>
        <p class="subtitle">CLASSICAL CHESS</p>
      </div>
    </a>
    <nav class="site-nav" aria-label="Site pages">
      <a href="/">Play</a>
      <a href="/learn.html">Learn</a>
      <a href="/about.html">About</a>
      <a href="/privacy.html">Privacy</a>
      <a href="/contact.html">Contact</a>
    </nav>
  </header>

  <main class="page-shell">
    <section class="page-hero">
      <span class="eyebrow">${page.eyebrow}</span>
      <h2>${page.heading}</h2>
      <p>${page.intro}</p>
    </section>
    ${renderPageBody(page)}
  </main>

  <footer class="site-footer">
    <span>Grandmaster Arena</span>
    <span>Play chess online and keep improving.</span>
  </footer>
`;

document.querySelector(`.site-nav a[href="/${pageKey}.html"]`)?.classList.add("active");

function renderPageBody(page) {
  if (page.cards) {
    return `
      <section class="learning-grid page-grid" aria-label="Chess lessons">
        ${page.cards
          .map(
            (card) => `
              <article>
                <h3>${card.title}</h3>
                <p>${card.text}</p>
              </article>
            `,
          )
          .join("")}
      </section>
    `;
  }

  return `
    <section class="page-copy">
      ${page.paragraphs.map((paragraph) => renderParagraph(paragraph)).join("")}
    </section>
  `;
}

function renderParagraph(paragraph) {
  if (paragraph.startsWith("GitHub: ")) {
    return `<p>GitHub: <a href="https://github.com/mayur007coder/Chess-Website" target="_blank" rel="noreferrer">mayur007coder/Chess-Website</a></p>`;
  }
  return `<p>${paragraph}</p>`;
}
