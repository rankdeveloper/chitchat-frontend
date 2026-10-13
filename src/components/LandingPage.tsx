import {
  ArrowRight,
  EyeOff,
  MessageSquare,
  Mic,
  SendHorizontal,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  Video,
  Zap,
} from "lucide-react";

type Props = {
  onGetStarted: () => void;

  onVideoChat?: () => void;
};

function Sparkle({ style }: { style: React.CSSProperties }) {
  return (
    <svg
      className="lp-sparkle"
      viewBox="0 0 24 24"
      style={style}
      aria-hidden="true"
    >
      <path d="M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z" />
    </svg>
  );
}

const SPARKLES: React.CSSProperties[] = [
  { top: "14%", left: "6%", width: 38, opacity: 0.55 },
  { top: "8%", left: "40%", width: 14, opacity: 0.5 },
  { top: "44%", left: "44%", width: 18, opacity: 0.35 },
  { bottom: "10%", left: "36%", width: 26, opacity: 0.4 },
  { bottom: "12%", right: "4%", width: 34, opacity: 0.45 },
  { top: "10%", right: "8%", width: 12, opacity: 0.4 },
  { bottom: "26%", left: "3%", width: 10, opacity: 0.3 },
];

function Sparkles() {
  return (
    <>
      {SPARKLES.map((s, i) => (
        <Sparkle key={i} style={s} />
      ))}
    </>
  );
}

function Logo() {
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
      <defs>
        <linearGradient id="lpLogo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8b6cf6" />
          <stop offset="1" stopColor="#5b3fe0" />
        </linearGradient>
      </defs>
      <path d="M7 15 L9 3 L18 9Z M33 15 L31 3 L22 9Z" fill="#5b3fe0" />
      <circle cx="20" cy="22" r="16" fill="url(#lpLogo)" />
      <rect x="8" y="17" width="24" height="10" rx="5" fill="#fff" />
      <ellipse cx="14.5" cy="22" rx="3" ry="2.6" fill="#2b1b6b" />
      <ellipse cx="25.5" cy="22" rx="3" ry="2.6" fill="#2b1b6b" />
    </svg>
  );
}

type FaceProps = {
  id: string;
  bg1: string;
  bg2: string;
  skin: string;
  hair: string;
  shirt: string;
  curly?: boolean;
};

function Face({ id, bg1, bg2, skin, hair, shirt, curly }: FaceProps) {
  return (
    <svg
      viewBox="0 0 200 240"
      className="lp-face"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={bg1} />
          <stop offset="1" stopColor={bg2} />
        </linearGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${id})`} />
      {curly ? (
        <g fill={hair}>
          <circle cx="68" cy="78" r="24" />
          <circle cx="92" cy="58" r="26" />
          <circle cx="120" cy="58" r="26" />
          <circle cx="140" cy="80" r="24" />
          <circle cx="62" cy="106" r="16" />
          <circle cx="146" cy="106" r="16" />
        </g>
      ) : (
        <path
          d="M46 150C34 70 76 28 100 28C130 28 168 66 154 150L156 210L46 210Z"
          fill={hair}
        />
      )}
      <path
        d="M14 240C20 192 58 176 100 176C142 176 180 192 186 240Z"
        fill={shirt}
      />
      <rect x="86" y="140" width="28" height="42" rx="12" fill={skin} />
      <ellipse cx="100" cy="106" rx="38" ry="46" fill={skin} />
      {curly ? (
        <g fill={hair}>
          <circle cx="78" cy="68" r="14" />
          <circle cx="100" cy="62" r="15" />
          <circle cx="124" cy="68" r="14" />
        </g>
      ) : (
        <path
          d="M60 102C62 56 138 52 140 102C126 80 84 76 60 102Z"
          fill={hair}
        />
      )}
      <circle cx="86" cy="110" r="3.6" fill="#2b1d1d" />
      <circle cx="114" cy="110" r="3.6" fill="#2b1d1d" />
      <path
        d="M88 130Q100 140 112 130"
        stroke="#2b1d1d"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

const FEATURES = [
  {
    icon: Zap,
    color: "#fbbf24",
    title: "Instant matching",
    text: "Press start and you're talking to someone within seconds. No waiting room.",
  },
  {
    icon: EyeOff,
    color: "#a78bfa",
    title: "Anonymous",
    text: "No profile and no personal details. Share only what you want to.",
  },
  {
    icon: SlidersHorizontal,
    color: "#6ee7b7",
    title: "Filter your way",
    text: "Match by interests, gender or region, or leave it open and see who shows up.",
  },
  {
    icon: MessageSquare,
    color: "#60a5fa",
    title: "Real-time chat",
    text: "Messages arrive instantly, with typing indicators so it feels like a real conversation.",
  },
  {
    icon: Users,
    color: "#f472b6",
    title: "Keep the good ones",
    text: "Had a great chat? Add them as a friend and pick it up later.",
  },
  {
    icon: ShieldCheck,
    color: "#fb923c",
    title: "Block and report",
    text: "Skip anyone, block them, or report them in one tap.",
  },
];

const STEPS = [
  {
    icon: SlidersHorizontal,
    title: "Pick your interests",
    text: "Or skip this and chat with anyone.",
  },
  {
    icon: Zap,
    title: "Get matched",
    text: "We pair you with someone who is online right now.",
  },
  {
    icon: MessageSquare,
    title: "Start talking",
    text: "Chat as long as it feels good. Skip when it doesn't.",
  },
];

export function LandingPage(p: Props) {
  return (
    <div className="lp">
      <header className="lp-nav">
        <a href="#top" className="lp-logo">
          <Logo />
          Chitchat
        </a>
        <nav className="lp-pills" aria-label="Main">
          <a href="#top" className="lp-pill is-active">
            Home
          </a>
          <a href="#about" className="lp-pill">
            About
          </a>
          <a href="#features" className="lp-pill">
            Features
          </a>
          <a href="#how" className="lp-pill">
            How it works
          </a>
        </nav>
        <div className="lp-nav-actions">
          <button
            type="button"
            aria-label="Start text chat"
            onClick={p.onGetStarted}
          >
            <MessageSquare size={20} />
          </button>
          {p.onVideoChat && (
            <>
              <span className="lp-divider" />
              <button
                type="button"
                aria-label="Start video chat"
                onClick={p.onVideoChat}
              >
                <Video size={20} />
              </button>
            </>
          )}
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="lp-hero">
          <Sparkles />
          <div className="lp-hero-copy">
            <h1>
              Talk to strangers,
              <br />
              Make friends!
            </h1>
            <p>
              Random chat with people from all over the world. Talk one on one,
              no account needed.
            </p>
            <div className="lp-hero-actions">
              <button
                type="button"
                className="lp-btn lp-btn-primary"
                onClick={p.onGetStarted}
              >
                <MessageSquare size={24} />
                Text Chat
              </button>
              {p.onVideoChat && (
                <button
                  type="button"
                  className="lp-btn lp-btn-light"
                  onClick={p.onVideoChat}
                >
                  <Video size={24} />
                  Video Chat
                </button>
              )}
            </div>
          </div>

          <div className="lp-collage" aria-hidden="true">
            <div className="lp-tiles">
              <div className="lp-tile">
                <Face
                  id="fa"
                  bg1="#4a3a63"
                  bg2="#1c1428"
                  skin="#f1c7a8"
                  hair="#173a46"
                  shirt="#2d2438"
                />
              </div>
              <div className="lp-tile">
                <Face
                  id="fb"
                  bg1="#2e3340"
                  bg2="#14161c"
                  skin="#e8b896"
                  hair="#4a2f22"
                  shirt="#11131a"
                  curly
                />
              </div>
            </div>
            <div className="lp-phone">
              <div className="lp-phone-head">
                <span className="lp-phone-avatar">
                  <Face
                    id="fc"
                    bg1="#4a3a63"
                    bg2="#1c1428"
                    skin="#f1c7a8"
                    hair="#173a46"
                    shirt="#2d2438"
                  />
                </span>
                <div>
                  <b>Chloe</b>
                  <small>online</small>
                </div>
              </div>
              <div className="lp-phone-body">
                <div className="lp-msg">
                  <span className="n-blue">Jacob</span>
                  <span>hey! where you from?</span>
                </div>
                <div className="lp-msg">
                  <span className="n-pink">Chloe</span>
                  <span>London, you?</span>
                </div>
                <div className="lp-msg">
                  <span className="n-blue">Jacob</span>
                  <span>no way, I visit soon</span>
                </div>
                <div className="lp-msg">
                  <span className="n-pink">Chloe</span>
                  <span className="lp-photo" />
                </div>
                <div className="lp-typing-note">Chloe is typing…</div>
              </div>
              <div className="lp-phone-input">
                <span>Type a message</span>
                <i>
                  <SendHorizontal size={12} />
                </i>
              </div>
            </div>
          </div>
        </section>

        {/* About, floating bubbles */}
        <section className="lp-about" id="about">
          <Sparkles />
          <div className="lp-bubbles" aria-hidden="true">
            <span
              className="lp-b lp-b-yellow"
              style={{
                left: "6%",
                top: "4%",
                ["--r" as string]: "-6deg",
                ["--d" as string]: "0s",
              }}
            >
              what's up
            </span>
            <span
              className="lp-b lp-b-white"
              style={{
                left: "56%",
                top: "6%",
                ["--r" as string]: "5deg",
                ["--d" as string]: "0.6s",
              }}
            >
              same!!
            </span>
            <span
              className="lp-b lp-b-hero"
              style={{
                left: "24%",
                top: "28%",
                ["--r" as string]: "-4deg",
                ["--d" as string]: "0.3s",
              }}
            >
              hey 👋
            </span>
            <span
              className="lp-b lp-b-mint"
              style={{
                left: "2%",
                top: "56%",
                ["--r" as string]: "4deg",
                ["--d" as string]: "0.9s",
              }}
            >
              haha true
            </span>
            <span
              className="lp-b lp-b-pink"
              style={{
                left: "54%",
                top: "64%",
                ["--r" as string]: "-6deg",
                ["--d" as string]: "0.2s",
              }}
            >
              no way
            </span>
            <span
              className="lp-b lp-b-typing"
              style={{
                left: "30%",
                top: "84%",
                ["--r" as string]: "0deg",
                ["--d" as string]: "0.5s",
              }}
            >
              <i />
              <i />
              <i />
            </span>
          </div>
          <div className="lp-about-copy">
            <h2>Chat with strangers, one at a time.</h2>
            <p>
              Start a chat, get matched with a random stranger and talk for as
              long as it feels good. Filter by interests, gender and region if
              you want. Or skip the second it doesn't.
            </p>
            <button
              type="button"
              className="lp-btn lp-btn-light lp-btn-sm"
              onClick={p.onGetStarted}
            >
              Start chatting <ArrowRight size={18} />
            </button>
          </div>
        </section>

        {/* Features */}
        <section className="lp-section" id="features">
          <div className="lp-head">
            <h2>Made for quick, easy conversations</h2>
            <p>Everything you need to meet someone new, nothing you don't.</p>
          </div>
          <div className="lp-features">
            {FEATURES.map(({ icon: Icon, color, title, text }) => (
              <article className="lp-feature" key={title}>
                <div
                  className="lp-feature-icon"
                  style={{ ["--c" as string]: color }}
                >
                  <Icon size={26} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* How */}
        <section className="lp-section" id="how">
          <div className="lp-head">
            <h2>Three steps to your first chat</h2>
          </div>
          <ol className="lp-steps">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li className="lp-step" key={title}>
                <div className="lp-step-icon">
                  <Icon size={28} />
                  <span>{i + 1}</span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* CTA */}
        <section className="lp-cta">
          <Sparkles />
          <h2>Ready to meet someone new?</h2>
          <p>It's free and takes one click.</p>
          <div className="lp-hero-actions lp-center">
            <button
              type="button"
              className="lp-btn lp-btn-primary"
              onClick={p.onGetStarted}
            >
              <MessageSquare size={22} />
              Text Chat
            </button>
            {p.onVideoChat && (
              <button
                type="button"
                className="lp-btn lp-btn-light"
                onClick={p.onVideoChat}
              >
                <Mic size={22} />
                Video Chat
              </button>
            )}
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <span>&copy; {new Date().getFullYear()} Chitchat</span>
        <nav>
          <a href="#terms">Terms</a>
          <a href="#privacy">Privacy</a>
          <a href="#guidelines">Guidelines</a>
          <a href="#contact">Contact</a>
        </nav>
      </footer>
    </div>
  );
}
