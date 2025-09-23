import React, { useRef, useState, useMemo } from "react";
import "./FoodSwipe.css";

export default function FoodSwipe() {
  const foods = useMemo(() => ([
    { id: 1, name: "Pizza",      image: "/images/pizza.jpg",  link: "https://www.ifood.com.br/" },
    { id: 2, name: "Hambúrguer", image: "/images/burger.jpg", link: "https://www.rappi.com.br/" },
    { id: 3, name: "Sushi",      image: "/images/sushi.jpg",  link: "https://www.ifood.com.br/" },
    { id: 4, name: "Açaí",       image: "/images/acai.jpg",   link: "https://www.rappi.com.br/" },
  ]), []);

  const [index, setIndex] = useState(0);
  const [dx, setDx] = useState(0);
  const [dy, setDy] = useState(0);
  const [anim, setAnim] = useState(null);

  const startX = useRef(0);
  const startY = useRef(0);
  const dragging = useRef(false);

  const SWIPE_LIMIT = 90;
  const SUPER_LIMIT = 120;
  const ROTATION_MAX = 18;

  const current = foods[index];
  const next1   = foods[(index + 1) % foods.length];
  const next2   = foods[(index + 2) % foods.length];

  const rotation = Math.max(-ROTATION_MAX, Math.min(ROTATION_MAX, dx / 10));

  const start = (x, y) => {
    dragging.current = true;
    startX.current = x;
    startY.current = y;
    setDx(0);
    setDy(0);
    setAnim(null);
  };

  const move = (x, y) => {
    if (!dragging.current) return;
    setDx(x - startX.current);
    setDy(y - startY.current);
  };

  const end = () => {
    if (!dragging.current) return;
    dragging.current = false;

    if (dy < -SUPER_LIMIT && Math.abs(dy) > Math.abs(dx) * 0.7) {
      setAnim("super");
      setTimeout(() => finish("super"), 220);
    } else if (dx > SWIPE_LIMIT) {
      setAnim("like");
      setTimeout(() => finish("like"), 220);
    } else if (dx < -SWIPE_LIMIT) {
      setAnim("nope");
      setTimeout(() => finish("nope"), 220);
    } else {
      setDx(0);
      setDy(0);
      setAnim(null);
    }
  };

  const finish = (kind) => {
    if ((kind === "like" || kind === "super") && current?.link) {
      window.open(current.link, "_blank", "noopener,noreferrer");
    }
    setIndex((i) => (i + 1) % foods.length);
    setDx(0);
    setDy(0);
    setAnim(null);
  };

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    if (e.pointerType === "touch") e.preventDefault();
    start(e.clientX, e.clientY);
  };
  const onPointerMove = (e) => move(e.clientX, e.clientY);
  const onPointerUp = () => end();

  const animClass =
    anim === "like"  ? "card--fly-right" :
    anim === "nope"  ? "card--fly-left"  :
    anim === "super" ? "card--fly-up"    : "";

  // Handlers nav (placeholders)
  const goHome = () => console.log("Home");
  const goMatches = () => console.log("Matches");
  const goChat = () => console.log("Chat");
  const goProfile = () => console.log("Profile");

  return (
    <div className="fs-page">
      {/* Header fixo com o nome */}
      <header className="fs-header">Munchly</header>

      <div className="fs-container">
        <div className="fs-stack">
          {next2 && (
            <div
              className="card card--ghost card--depth2"
              style={{ backgroundImage: `url(${next2.image})` }}
              aria-hidden
            />
          )}
          {next1 && (
            <div
              className="card card--ghost card--depth1"
              style={{ backgroundImage: `url(${next1.image})` }}
              aria-hidden
            />
          )}

          {current && (
            <div
              className={`card ${animClass}`}
              style={{
                backgroundImage: `url(${current.image})`,
                transform: `translate(${dx}px, ${dy}px) rotate(${rotation}deg)`,
              }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onContextMenu={(e) => e.preventDefault()}
            >
              <div
                className="badge badge--like"
                style={{ opacity: Math.min(Math.max(dx, 0) / 100, 1) }}
              >
                LIKE
              </div>
              <div
                className="badge badge--nope"
                style={{ opacity: Math.min(Math.max(-dx, 0) / 100, 1) }}
              >
                NOPE
              </div>
              <div
                className="badge badge--super"
                style={{ opacity: Math.min(Math.max(-dy, 0) / 120, 1) }}
              >
                SUPER LIKE
              </div>

              <div className="card__grad" />
              <h2 className="card__title">{current.name}</h2>
            </div>
          )}
        </div>

        <div className="fs-actions">
          <button className="btn btn--nope"  onClick={() => { setDx(-SWIPE_LIMIT - 1); setAnim("nope"); setTimeout(() => finish("nope"), 150); }} aria-label="Nope">❌</button>
          <button className="btn btn--super" onClick={() => { setDy(-SUPER_LIMIT - 1); setAnim("super"); setTimeout(() => finish("super"), 150); }} aria-label="Super Like">⭐</button>
          <button className="btn btn--like"  onClick={() => { setDx(SWIPE_LIMIT + 1); setAnim("like"); setTimeout(() => finish("like"), 150); }} aria-label="Like">❤️</button>
        </div>
      </div>

      {/* NAVBAR fixa com “carinha” de app */}
      <nav className="fs-navbar" aria-label="Navegação principal">
        <button className="nav-btn" onClick={goHome} aria-label="Início">
          {/* Home (coração) */}
          <svg viewBox="0 0 24 24" className="nav-ico" aria-hidden="true">
            <path d="M12 21s-6.716-4.07-9.192-7.09C.506 11.352 1.12 8.6 3.273 7.273 5.427 5.946 8.02 6.62 9.6 8.4L12 11l2.4-2.6c1.58-1.78 4.173-2.454 6.327-.127 2.153 1.327 2.767 4.079.465 6.637C18.716 16.93 12 21 12 21z" />
          </svg>
          <span>Início</span>
        </button>
        <button className="nav-btn" onClick={goMatches} aria-label="Combinações">
          {/* Matches (estrela) */}
          <svg viewBox="0 0 24 24" className="nav-ico" aria-hidden="true">
            <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l7.1-1.01L12 2z"/>
          </svg>
          <span>Matches</span>
        </button>

        {/* Botão central “plus” flutuante (opcional, só estético) */}
        <button className="nav-fab" onClick={goHome} aria-label="Explorar">
          <svg viewBox="0 0 24 24" className="nav-ico" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
        </button>

        <button className="nav-btn" onClick={goChat} aria-label="Chats">
          {/* Chat (balão) */}
          <svg viewBox="0 0 24 24" className="nav-ico" aria-hidden="true">
            <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z"/>
          </svg>
          <span>Chats</span>
        </button>
        <button className="nav-btn nav-btn--active" onClick={goProfile} aria-label="Perfil">
          {/* Profile (avatar) */}
          <svg viewBox="0 0 24 24" className="nav-ico" aria-hidden="true">
            <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-5.33 0-8 2.67-8 6v1h16v-1c0-3.33-2.67-6-8-6z"/>
          </svg>
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  );
}
