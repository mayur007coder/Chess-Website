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
      {
        title: "Blunder Check",
        text:
          "Before releasing a piece, ask whether your king is safe, whether your queen or rook is hanging, and whether your opponent has a forcing reply.",
      },
      {
        title: "Simple Plans",
        text:
          "When no tactic is available, improve your worst piece, claim an open file, create a passed pawn, or trade into an endgame where your king is more active.",
      },
      {
        title: "Candidate Moves",
        text:
          "List at least two sensible choices before calculating. Begin with forcing moves, but include one quiet move that improves your position or prevents the opponent's plan.",
      },
      {
        title: "Pawn Structure",
        text:
          "Use pawn breaks to open lines for your pieces, not simply to gain space. Before pushing, check which squares become weak and whether the pawn can still be defended.",
      },
      {
        title: "Time Management",
        text:
          "Spend extra time when the position changes: after a surprising move, a central pawn break, a major exchange, or the appearance of a direct threat to either king.",
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
      "The project focuses on original interactive chess tools, clear navigation, and practical learning pages that support the main playing experience.",
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
      "This website may use Google AdSense or other advertising services. These services may use cookies, web beacons, device information, IP addresses, and similar technologies to show and measure ads according to their own policies.",
      "Visitors can control cookies through their browser settings. Some browser settings or extensions may limit advertising or measurement features.",
      "This website may collect basic technical information through hosting logs, such as browser type, device type, approximate region, pages visited, and error information. This information is used to keep the website reliable and improve the experience.",
      "Grandmaster Arena does not sell user accounts or require visitors to create an account before playing chess.",
      "Last updated: May 31, 2026.",
    ],
  },
  contact: {
    title: "Contact",
    description: "Contact the owner of Grandmaster Arena.",
    eyebrow: "Contact",
    heading: "Contact The Site Owner",
    intro:
      "For questions, suggestions, chess feature ideas, or website issues, contact the owner through the GitHub project or email.",
    paragraphs: [
      "GitHub: https://github.com/mayur007coder/Chess-Website",
      "mayurdhongders@gmail.com",
      "Helpful reports include your browser, device type, the page you were using, and what happened before the issue appeared.",
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
      <section class="page-copy lesson-copy" aria-labelledby="study-method-title">
        <h3 id="study-method-title">A Simple Study Method</h3>
        <p>Play one complete game at a time and avoid restarting after an early mistake. Finishing the position gives you experience defending worse games, converting advantages, and recognizing endgame patterns.</p>
        <p>During review, divide the game into opening, middlegame, and endgame. For each phase, identify one decision you understood and one decision you would change. Keep the lesson specific: develop before attacking, calculate the recapture, or activate the king before pushing pawns.</p>
        <p>Return to the same lesson in your next game. Improvement becomes visible when a useful idea changes a decision at the board, not when a long list of advice is merely remembered.</p>
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
