import { Chess } from "chess.js";
import {
  BORDER_TYPE,
  Chessboard,
  COLOR,
  INPUT_EVENT_TYPE,
} from "cm-chessboard";
import { Markers, MARKER_TYPE } from "cm-chessboard/src/extensions/markers/Markers.js";
import {
  PromotionDialog,
  PROMOTION_DIALOG_RESULT_TYPE,
} from "cm-chessboard/src/extensions/promotion-dialog/PromotionDialog.js";
import { Accessibility } from "cm-chessboard/src/extensions/accessibility/Accessibility.js";
import "cm-chessboard/assets/chessboard.css";
import "cm-chessboard/assets/extensions/markers/markers.css";
import "cm-chessboard/assets/extensions/promotion-dialog/promotion-dialog.css";
import "./styles.css";

const AI_TIME = { 1: 250, 2: 650, 3: 1200, 4: 2200, 5: 4200 };
const PIECE_SYMBOL = {
  wp: "\u2659",
  wn: "\u2658",
  wb: "\u2657",
  wr: "\u2656",
  wq: "\u2655",
  bp: "\u265F",
  bn: "\u265E",
  bb: "\u265D",
  br: "\u265C",
  bq: "\u265B",
};

const app = document.querySelector("#app");
app.innerHTML = `
  <header class="topbar">
    <div class="brand">
      <span class="brand-mark" aria-hidden="true">&#9812;</span>
      <div>
        <h1>Grandmaster Arena</h1>
        <p class="subtitle">CLASSICAL CHESS</p>
      </div>
    </div>
    <div class="engine-pill">
      <span class="engine-dot" id="engine-dot"></span>
      <span id="engine-state">Stockfish loading</span>
    </div>
    <nav class="site-nav" aria-label="Site pages">
      <a href="#play">Play</a>
      <a href="#learn">Learn</a>
      <a href="#about">About</a>
      <a href="#privacy">Privacy</a>
      <a href="#contact">Contact</a>
    </nav>
  </header>

  <main id="play" class="arena">
    <section class="board-column" aria-label="Chess match">
      <div class="player-rail" id="top-player"></div>
      <div class="board-frame">
        <div class="board-stage">
          <div class="check-alert" id="check-alert" role="alert" hidden>
            <span class="check-icon" aria-hidden="true">!</span>
            <strong>Check</strong>
            <span id="check-message"></span>
          </div>
          <div id="board" class="board" aria-label="Chess board"></div>
          <section class="result-overlay" id="result-overlay" aria-live="assertive" hidden>
            <div class="confetti" aria-hidden="true">
              <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
            </div>
            <div class="result-content">
              <span class="result-crown" id="result-crown" aria-hidden="true">&#9813;</span>
              <span class="result-label" id="result-label">Checkmate</span>
              <h2 id="result-title">White Wins</h2>
              <p id="result-message"></p>
              <div class="result-actions">
                <button class="primary" id="play-again" type="button">Play Again</button>
                <button id="review-board" type="button">Review Board</button>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div class="player-rail" id="bottom-player"></div>
    </section>

    <aside class="control-panel" aria-label="Match controls">
      <div class="status-block">
        <span class="turn-label" id="turn-label">WHITE TO MOVE</span>
        <h2 id="game-status">Your move</h2>
        <p id="status-detail" class="status-detail">Make your move on the board.</p>
      </div>

      <div class="section">
        <span class="control-label">Opponent</span>
        <div class="segmented" role="group" aria-label="Opponent">
          <button class="active" id="ai-mode" type="button">Stockfish</button>
          <button id="friend-mode" type="button">Friend</button>
        </div>
      </div>

      <div class="section ai-options" id="ai-options">
        <span class="control-label">Your Side</span>
        <div class="segmented" role="group" aria-label="Choose your side">
          <button class="active" id="play-white" type="button">White</button>
          <button id="play-black" type="button">Black</button>
        </div>
        <label class="range-head" for="strength">
          <span>AI Strength</span>
          <strong id="strength-name">Maximum</strong>
        </label>
        <input id="strength" type="range" min="1" max="5" value="5" />
      </div>

      <div class="actions" aria-label="Game actions">
        <button class="primary" id="new-game" type="button">New Game</button>
        <button id="undo" type="button">Undo</button>
        <button id="flip" type="button">Flip Board</button>
      </div>

      <section class="moves-section" aria-label="Move history">
        <div class="section-head">
          <span class="control-label">Moves</span>
          <span id="move-count">0 moves</span>
        </div>
        <div id="moves" class="moves empty">No moves yet</div>
      </section>
    </aside>
  </main>

  <section id="learn" class="content-band" aria-labelledby="learn-title">
    <div class="content-wrap">
      <span class="eyebrow">Chess Training</span>
      <h2 id="learn-title">Improve One Move At A Time</h2>
      <div class="learning-grid">
        <article>
          <h3>Opening Principles</h3>
          <p>Control the center, develop minor pieces early, castle before the position opens, and avoid moving the same piece repeatedly without a clear reason.</p>
        </article>
        <article>
          <h3>Tactical Checklist</h3>
          <p>Before every move, scan for checks, captures, threats, loose pieces, back-rank weaknesses, pins, forks, and discovered attacks.</p>
        </article>
        <article>
          <h3>Endgame Basics</h3>
          <p>Activate your king, push passed pawns, place rooks behind passed pawns, and trade pieces when ahead in material.</p>
        </article>
      </div>
    </div>
  </section>

  <section id="about" class="content-band muted-band" aria-labelledby="about-title">
    <div class="content-wrap split-content">
      <div>
        <span class="eyebrow">About</span>
        <h2 id="about-title">Grandmaster Arena</h2>
      </div>
      <p>Grandmaster Arena is a browser chess website built for quick games, practice, and casual learning. You can play against Stockfish, play over the board with a friend, review moves, and use the training notes to build stronger chess habits.</p>
    </div>
  </section>

  <section id="privacy" class="content-band" aria-labelledby="privacy-title">
    <div class="content-wrap policy-copy">
      <span class="eyebrow">Privacy Policy</span>
      <h2 id="privacy-title">Privacy Policy</h2>
      <p>Grandmaster Arena does not require an account to play chess and does not ask visitors to submit personal information inside the game.</p>
      <p>If advertising, analytics, or embedded third-party services are added later, those services may use cookies or similar technologies according to their own policies. Visitors can control cookies through their browser settings.</p>
      <p>This website may collect basic technical information through hosting logs, such as browser type, device type, approximate region, pages visited, and error information. This information is used to keep the website reliable and improve the experience.</p>
      <p>Last updated: May 29, 2026.</p>
    </div>
  </section>

  <section id="contact" class="content-band muted-band" aria-labelledby="contact-title">
    <div class="content-wrap split-content">
      <div>
        <span class="eyebrow">Contact</span>
        <h2 id="contact-title">Contact The Site Owner</h2>
      </div>
      <p>For questions, suggestions, or website issues, contact the owner through the GitHub project at <a href="https://github.com/mayur007coder/Chess-Website" target="_blank" rel="noreferrer">mayur007coder/Chess-Website</a>. Add a public email address here before applying for AdSense.</p>
    </div>
  </section>

  <footer class="site-footer">
    <span>Grandmaster Arena</span>
    <span>Play chess online and keep improving.</span>
  </footer>
`;

const game = new Chess();
const state = {
  mode: "ai",
  humanColor: "w",
  strength: 5,
  orientation: COLOR.white,
  thinking: false,
  engineReady: false,
  engineError: false,
  activeSearchFen: null,
  reviewingResult: false,
};

const elements = {
  navLinks: document.querySelectorAll(".site-nav a"),
  aiMode: document.querySelector("#ai-mode"),
  friendMode: document.querySelector("#friend-mode"),
  aiOptions: document.querySelector("#ai-options"),
  playWhite: document.querySelector("#play-white"),
  playBlack: document.querySelector("#play-black"),
  strength: document.querySelector("#strength"),
  strengthName: document.querySelector("#strength-name"),
  newGame: document.querySelector("#new-game"),
  undo: document.querySelector("#undo"),
  flip: document.querySelector("#flip"),
  playAgain: document.querySelector("#play-again"),
  reviewBoard: document.querySelector("#review-board"),
  topPlayer: document.querySelector("#top-player"),
  bottomPlayer: document.querySelector("#bottom-player"),
  turnLabel: document.querySelector("#turn-label"),
  gameStatus: document.querySelector("#game-status"),
  statusDetail: document.querySelector("#status-detail"),
  checkAlert: document.querySelector("#check-alert"),
  checkMessage: document.querySelector("#check-message"),
  resultOverlay: document.querySelector("#result-overlay"),
  resultCrown: document.querySelector("#result-crown"),
  resultLabel: document.querySelector("#result-label"),
  resultTitle: document.querySelector("#result-title"),
  resultMessage: document.querySelector("#result-message"),
  moves: document.querySelector("#moves"),
  moveCount: document.querySelector("#move-count"),
  engineDot: document.querySelector("#engine-dot"),
  engineState: document.querySelector("#engine-state"),
};

elements.navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    elements.navLinks.forEach((item) => item.classList.toggle("active", item === link));
  });
});

const board = new Chessboard(document.querySelector("#board"), {
  position: game.fen(),
  orientation: state.orientation,
  assetsUrl: "/",
  style: {
    cssClass: "chess-club",
    borderType: BORDER_TYPE.frame,
    showCoordinates: true,
    pieces: { file: "pieces/standard.svg" },
    animationDuration: 220,
  },
  extensions: [
    { class: Markers, props: { autoMarkers: MARKER_TYPE.square } },
    { class: PromotionDialog },
    { class: Accessibility, props: { visuallyHidden: true } },
  ],
});

let engine;
try {
  engine = new Worker("/stockfish/stockfish.wasm.js");
  engine.addEventListener("message", onEngineMessage);
  engine.addEventListener("error", onEngineFailure);
  engine.postMessage("uci");
} catch (error) {
  onEngineFailure(error);
}

function onEngineMessage(event) {
  const line = String(event.data);
  if (line === "uciok") {
    engine.postMessage("setoption name Skill Level value 20");
    engine.postMessage("setoption name Hash value 32");
    engine.postMessage("isready");
    return;
  }
  if (line === "readyok") {
    state.engineReady = true;
    render();
    maybeRequestAiMove();
    return;
  }
  if (!line.startsWith("bestmove ")) {
    return;
  }
  const moveText = line.split(" ")[1];
  if (!state.thinking || state.activeSearchFen !== game.fen() || moveText === "(none)") {
    return;
  }
  state.thinking = false;
  state.activeSearchFen = null;
  const move = game.move({
    from: moveText.slice(0, 2),
    to: moveText.slice(2, 4),
    promotion: moveText.slice(4, 5) || undefined,
  });
  if (move) {
    synchronizeBoard(move);
  }
}

function onEngineFailure() {
  state.engineError = true;
  state.engineReady = false;
  state.thinking = false;
  render();
}

function inputHandler(event) {
  if (event.type === INPUT_EVENT_TYPE.movingOverSquare) {
    return;
  }
  if (event.type !== INPUT_EVENT_TYPE.moveInputFinished) {
    board.removeLegalMovesMarkers();
  }
  if (event.type === INPUT_EVENT_TYPE.moveInputStarted) {
    if (!canCurrentPlayerMove()) {
      return false;
    }
    const moves = game.moves({ square: event.squareFrom, verbose: true });
    board.addLegalMovesMarkers(moves);
    return moves.length > 0;
  }
  if (event.type !== INPUT_EVENT_TYPE.validateMoveInput) {
    return;
  }
  const possibleMoves = game
    .moves({ square: event.squareFrom, verbose: true })
    .filter((move) => move.to === event.squareTo);
  if (!possibleMoves.length) {
    return false;
  }
  if (possibleMoves.some((move) => move.promotion)) {
    board.showPromotionDialog(
      event.squareTo,
      game.turn() === "w" ? COLOR.white : COLOR.black,
      (result) => {
        if (result.type === PROMOTION_DIALOG_RESULT_TYPE.pieceSelected) {
          const move = game.move({
            from: event.squareFrom,
            to: event.squareTo,
            promotion: result.piece.charAt(1),
          });
          synchronizeBoard(move);
        } else {
          board.setPosition(game.fen(), true);
          refreshInput();
        }
      },
    );
    return true;
  }
  const move = game.move({ from: event.squareFrom, to: event.squareTo });
  if (move) {
    event.chessboard.state.moveInputProcess.then(() => synchronizeBoard(move));
  }
  return Boolean(move);
}

async function synchronizeBoard(move) {
  if (!move) {
    return;
  }
  await board.setPosition(game.fen(), true);
  showPositionMarkers(move);
  render();
  maybeRequestAiMove();
}

function showPositionMarkers(move = game.history({ verbose: true }).at(-1)) {
  board.removeMarkers();
  if (move) {
    board.addMarker(MARKER_TYPE.framePrimary, move.from);
    board.addMarker(MARKER_TYPE.framePrimary, move.to);
  }
  if (game.isCheck()) {
    const checkedKing = findKingSquare(game.turn());
    if (checkedKing) {
      board.addMarker(MARKER_TYPE.circleDangerFilled, checkedKing);
    }
  }
}

function findKingSquare(color) {
  for (const row of game.board()) {
    const king = row.find((piece) => piece && piece.type === "k" && piece.color === color);
    if (king) {
      return king.square;
    }
  }
  return null;
}

function maybeRequestAiMove() {
  if (
    state.mode !== "ai" ||
    game.isGameOver() ||
    game.turn() === state.humanColor ||
    state.thinking
  ) {
    refreshInput();
    return;
  }
  if (!state.engineReady || !engine) {
    refreshInput();
    return;
  }
  state.thinking = true;
  state.activeSearchFen = game.fen();
  engine.postMessage("stop");
  engine.postMessage(`position fen ${state.activeSearchFen}`);
  engine.postMessage(`go movetime ${AI_TIME[state.strength]}`);
  render();
  refreshInput();
}

function canCurrentPlayerMove() {
  if (game.isGameOver() || state.thinking) {
    return false;
  }
  return state.mode === "friend" || game.turn() === state.humanColor;
}

function refreshInput() {
  board.disableMoveInput();
  if (!canCurrentPlayerMove()) {
    return;
  }
  if (state.mode === "friend") {
    board.enableMoveInput(inputHandler);
  } else {
    board.enableMoveInput(inputHandler, state.humanColor === "w" ? COLOR.white : COLOR.black);
  }
}

async function resetGame() {
  stopSearch();
  board.disableMoveInput();
  state.reviewingResult = false;
  game.reset();
  await board.setPosition(game.fen(), true);
  showPositionMarkers();
  render();
  maybeRequestAiMove();
}

function stopSearch() {
  if (engine && state.thinking) {
    engine.postMessage("stop");
  }
  state.thinking = false;
  state.activeSearchFen = null;
}

async function undoMove() {
  stopSearch();
  const count = game.history().length;
  if (!count) {
    return;
  }
  if (state.mode === "friend") {
    game.undo();
  } else if (game.turn() !== state.humanColor) {
    game.undo();
  } else if (count >= 2) {
    game.undo();
    game.undo();
  }
  state.reviewingResult = false;
  await board.setPosition(game.fen(), true);
  showPositionMarkers();
  render();
  refreshInput();
}

async function setMode(mode) {
  state.mode = mode;
  elements.aiMode.classList.toggle("active", mode === "ai");
  elements.friendMode.classList.toggle("active", mode === "friend");
  elements.aiOptions.hidden = mode !== "ai";
  await resetGame();
}

async function setHumanColor(color) {
  stopSearch();
  board.disableMoveInput();
  state.humanColor = color;
  elements.playWhite.classList.toggle("active", color === "w");
  elements.playBlack.classList.toggle("active", color === "b");
  state.orientation = color === "w" ? COLOR.white : COLOR.black;
  await board.setOrientation(state.orientation, true);
  await resetGame();
}

async function flipBoard() {
  board.disableMoveInput();
  state.orientation = state.orientation === COLOR.white ? COLOR.black : COLOR.white;
  await board.setOrientation(state.orientation, true);
  renderPlayers();
  refreshInput();
}

function render() {
  renderStatus();
  renderResult();
  renderPlayers();
  renderMoves();
  renderEngine();
  refreshInput();
}

function renderStatus() {
  const turn = game.turn() === "w" ? "White" : "Black";
  const outcome = getOutcome();
  const statusBlock = document.querySelector(".status-block");
  elements.turnLabel.textContent = outcome ? "MATCH FINISHED" : `${turn.toUpperCase()} TO MOVE`;
  elements.checkAlert.hidden = !game.isCheck() || game.isCheckmate();
  elements.checkMessage.textContent = `${turn}'s king is under attack`;
  statusBlock.classList.toggle("warning", game.isCheck() && !game.isCheckmate());
  statusBlock.classList.toggle("finished", Boolean(outcome));
  if (game.isCheckmate()) {
    elements.gameStatus.textContent = `${outcome.winnerName} wins`;
    elements.statusDetail.textContent = "Checkmate. The king has no legal escape.";
  } else if (game.isDraw()) {
    elements.gameStatus.textContent = "Match drawn";
    elements.statusDetail.textContent = outcome.reason;
  } else if (game.isCheck()) {
    elements.gameStatus.textContent = "Check!";
    elements.statusDetail.textContent = `${turn} must defend the king now.`;
  } else if (state.thinking) {
    elements.gameStatus.textContent = "Stockfish is calculating";
    elements.statusDetail.textContent = "The engine is choosing its best response.";
  } else if (state.mode === "ai") {
    elements.gameStatus.textContent =
      game.turn() === state.humanColor ? "Your move" : "Waiting for Stockfish";
    elements.statusDetail.textContent =
      game.turn() === state.humanColor ? "Find your strongest continuation." : "Your opponent is on move.";
  } else {
    elements.gameStatus.textContent = `${turn} to move`;
    elements.statusDetail.textContent = `${playerName(game.turn())} is on move.`;
  }
}

function renderPlayers() {
  const white = playerRow("White", state.mode === "ai" && state.humanColor === "w" ? "You" : "Player 1", "w");
  const black = playerRow(
    "Black",
    state.mode === "ai" ? (state.humanColor === "b" ? "You" : "Stockfish") : "Player 2",
    "b",
  );
  const whiteOnBottom = state.orientation === COLOR.white;
  elements.topPlayer.innerHTML = whiteOnBottom ? black : white;
  elements.bottomPlayer.innerHTML = whiteOnBottom ? white : black;
}

function playerRow(colorName, name, color) {
  const captures = getCapturedPieces(color);
  const active = game.turn() === color && !game.isGameOver();
  const winner = game.isCheckmate() && game.turn() !== color;
  const checked = game.isCheck() && game.turn() === color;
  return `
    <div class="player ${active ? "active" : ""} ${winner ? "winner" : ""} ${checked ? "checked" : ""}">
      <span class="player-piece ${color}">${color === "w" ? "&#9812;" : "&#9818;"}</span>
      <div class="player-name"><strong>${name}</strong><span>${colorName}</span></div>
      ${winner ? '<span class="winner-tag">Winner</span>' : ""}
      ${checked && !game.isCheckmate() ? '<span class="check-tag">Check</span>' : ""}
      <div class="captures" aria-label="${colorName} captures">${captures}</div>
    </div>
  `;
}

function playerName(color) {
  if (state.mode === "friend") {
    return color === "w" ? "Player 1" : "Player 2";
  }
  return color === state.humanColor ? "You" : "Stockfish";
}

function getOutcome() {
  if (game.isCheckmate()) {
    const winnerColor = game.turn() === "w" ? "b" : "w";
    const colorName = winnerColor === "w" ? "White" : "Black";
    const winnerName = playerName(winnerColor);
    return {
      type: "win",
      label: "Checkmate",
      winnerName,
      title: `${winnerName} Wins`,
      message: `${colorName} wins by checkmate.`,
    };
  }
  if (!game.isDraw()) {
    return null;
  }
  let reason = "The match ends in a draw.";
  if (game.isStalemate()) {
    reason = "Stalemate. The player to move has no legal move.";
  } else if (game.isThreefoldRepetition()) {
    reason = "Draw by threefold repetition.";
  } else if (game.isInsufficientMaterial()) {
    reason = "Draw by insufficient material.";
  } else if (game.isDrawByFiftyMoves()) {
    reason = "Draw by the fifty-move rule.";
  }
  return { type: "draw", label: "Game Over", title: "Draw", message: reason, reason };
}

function renderResult() {
  const outcome = getOutcome();
  elements.resultOverlay.hidden = !outcome || state.reviewingResult;
  if (!outcome) {
    return;
  }
  elements.resultOverlay.classList.toggle("draw", outcome.type === "draw");
  elements.resultCrown.innerHTML = outcome.type === "win" ? "&#9813;" : "&#189;";
  elements.resultLabel.textContent = outcome.label;
  elements.resultTitle.textContent = outcome.title;
  elements.resultMessage.textContent = outcome.message;
}

function getCapturedPieces(capturingColor) {
  const capturedColor = capturingColor === "w" ? "b" : "w";
  return game
    .history({ verbose: true })
    .filter((move) => move.color === capturingColor && move.captured)
    .map((move) => `<span>${PIECE_SYMBOL[`${capturedColor}${move.captured}`]}</span>`)
    .join("");
}

function renderMoves() {
  const moves = game.history();
  elements.moveCount.textContent = `${moves.length} ${moves.length === 1 ? "move" : "moves"}`;
  if (!moves.length) {
    elements.moves.className = "moves empty";
    elements.moves.textContent = "No moves yet";
    return;
  }
  const rows = [];
  for (let index = 0; index < moves.length; index += 2) {
    rows.push(`
      <div class="move-row">
        <span>${index / 2 + 1}</span>
        <strong>${moves[index]}</strong>
        <strong>${moves[index + 1] || ""}</strong>
      </div>
    `);
  }
  elements.moves.className = "moves";
  elements.moves.innerHTML = rows.join("");
  elements.moves.scrollTop = elements.moves.scrollHeight;
}

function renderEngine() {
  elements.engineDot.classList.toggle("ready", state.engineReady);
  elements.engineDot.classList.toggle("error", state.engineError);
  elements.engineState.textContent = state.engineError
    ? "Engine unavailable"
    : state.engineReady
      ? "Stockfish ready"
      : "Stockfish loading";
}

elements.aiMode.addEventListener("click", () => setMode("ai"));
elements.friendMode.addEventListener("click", () => setMode("friend"));
elements.playWhite.addEventListener("click", () => setHumanColor("w"));
elements.playBlack.addEventListener("click", () => setHumanColor("b"));
elements.newGame.addEventListener("click", resetGame);
elements.playAgain.addEventListener("click", resetGame);
elements.reviewBoard.addEventListener("click", () => {
  state.reviewingResult = true;
  renderResult();
});
elements.undo.addEventListener("click", undoMove);
elements.flip.addEventListener("click", flipBoard);
elements.strength.addEventListener("input", (event) => {
  state.strength = Number(event.target.value);
  elements.strengthName.textContent = ["", "Quick", "Strong", "Expert", "Elite", "Maximum"][state.strength];
});

render();
