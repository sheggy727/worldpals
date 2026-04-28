"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const profiles = [
  { name: "Yuki", country: "Japan", flag: "🇯🇵", lang: "Japanese • English", interest: "Anime & Cooking", img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=400&fit=crop&crop=face" },
  { name: "Carlos", country: "Brazil", flag: "🇧🇷", lang: "Portuguese • Spanish", interest: "Football & Music", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop&crop=face" },
  { name: "Amira", country: "Egypt", flag: "🇪🇬", lang: "Arabic • French", interest: "History & Art", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=400&fit=crop&crop=face" },
  { name: "Lena", country: "Germany", flag: "🇩🇪", lang: "German • English", interest: "Tech & Travel", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=400&fit=crop&crop=face" },
  { name: "Raj", country: "India", flag: "🇮🇳", lang: "Hindi • English", interest: "Cricket & Yoga", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=400&fit=crop&crop=face" },
  { name: "Sofia", country: "Italy", flag: "🇮🇹", lang: "Italian • English", interest: "Fashion & Food", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=400&fit=crop&crop=face" },
];

const testimonials = [
  { name: "Maria K.", country: "Spain 🇪🇸", text: "I found my best friend in South Korea through WorldPals. We video call every week now!", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" },
  { name: "James T.", country: "USA 🇺🇸", text: "My Japanese has improved so much. My WorldPal teaches me and I teach him English!", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" },
  { name: "Priya R.", country: "India 🇮🇳", text: "WorldPals changed how I see the world. I now have friends in 12 different countries!", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face" },
];

const faqs = [
  { q: "Is WorldPals free?", a: "Yes! WorldPals is completely free to use. Create a profile, swipe, match, and chat with no hidden costs." },
  { q: "How does matching work?", a: "You swipe right on profiles you like. When both people swipe right on each other, it's a match and you can start chatting!" },
  { q: "Is it safe?", a: "We have community guidelines, reporting tools, and active moderation to keep everyone safe and comfortable." },
  { q: "What languages are supported?", a: "WorldPals supports 40+ languages. You can filter matches by language to find the perfect language exchange partner." },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, { threshold });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, inView };
}

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className}`}>
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [activeCard, setActiveCard] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [liked, setLiked] = useState<boolean | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % profiles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSwipe = (direction: boolean) => {
    setLiked(direction);
    setTimeout(() => {
      setLiked(null);
      setActiveCard((prev) => (prev + 1) % profiles.length);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Satoshi:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Satoshi', sans-serif; }
        .font-display { font-family: 'Clash Display', sans-serif; }
        .gradient-text { background: linear-gradient(135deg, #0066FF, #00B4FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .hero-bg { background: linear-gradient(135deg, #EBF4FF 0%, #F0F9FF 50%, #E0F2FE 100%); }
        .card-shadow { box-shadow: 0 20px 60px rgba(0, 102, 255, 0.15); }
        .btn-primary { background: linear-gradient(135deg, #0066FF, #00B4FF); transition: all 0.3s ease; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0, 102, 255, 0.4); }
        .stat-card { background: linear-gradient(135deg, #0066FF, #00B4FF); }
        .feature-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0, 102, 255, 0.1); }
        .profile-card { transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
        .swipe-left { transform: translateX(-150%) rotate(-20deg) !important; opacity: 0 !important; }
        .swipe-right { transform: translateX(150%) rotate(20deg) !important; opacity: 0 !important; }
        .nav-blur { backdrop-filter: blur(20px); background: rgba(255,255,255,0.9); }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 1; } 100% { transform: scale(2); opacity: 0; } }
        .floating { animation: float 3s ease-in-out infinite; }
        .pulse-dot::before { content: ''; position: absolute; inset: -4px; border-radius: 50%; background: #22c55e; animation: pulse-ring 1.5s ease-out infinite; }
      `}</style>

      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 nav-blur border-b border-blue-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl btn-primary flex items-center justify-center text-white font-bold text-sm">W</div>
            <span className="font-display font-700 text-xl text-gray-900">WorldPals</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how" className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">How it works</a>
            <a href="#community" className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">Community</a>
            <a href="#faq" className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Log in</Link>
            <Link href="/signup" className="btn-primary text-white text-sm font-medium px-5 py-2.5 rounded-full">Get started</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-bg min-h-screen pt-24 flex items-center relative overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30 floating" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-sky-200 rounded-full blur-3xl opacity-20 floating" style={{ animationDelay: "1s" }} />
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-2 text-sm text-blue-600 font-medium mb-8">
              <span className="w-2 h-2 bg-green-500 rounded-full relative pulse-dot" />
              &nbsp;2,400+ people online now
            </div>
            <h1 className="font-display text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
              Meet the<br />
              <span className="gradient-text">World.</span><br />
              Make Friends.
            </h1>
            <p className="text-xl text-gray-500 mb-10 leading-relaxed max-w-lg">
              Connect with real people from 150+ countries. Learn languages, share cultures, and build friendships that cross every border.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup" className="btn-primary text-white font-semibold px-8 py-4 rounded-2xl text-center text-lg">
                Start for free →
              </Link>
              <a href="#how" className="flex items-center justify-center gap-2 text-gray-600 font-medium px-8 py-4 rounded-2xl border-2 border-gray-200 hover:border-blue-300 transition-colors text-lg">
                See how it works
              </a>
            </div>
            <div className="flex items-center gap-6 mt-10">
              <div className="flex -space-x-3">
                {profiles.slice(0, 4).map((p, i) => (
                  <img key={i} src={p.img} className="w-10 h-10 rounded-full border-2 border-white object-cover" alt={p.name} />
                ))}
              </div>
              <p className="text-sm text-gray-500"><span className="font-semibold text-gray-900">50,000+</span> friends made worldwide</p>
            </div>
          </div>

          {/* Right — Swipe Cards */}
          <div className="flex justify-center items-center relative h-[520px]">
            {profiles.map((profile, i) => {
              const isActive = i === activeCard;
              const isNext = i === (activeCard + 1) % profiles.length;
              if (!isActive && !isNext) return null;
              return (
                <div
                  key={profile.name}
                  className={`profile-card absolute w-72 rounded-3xl overflow-hidden card-shadow ${
                    liked === true && isActive ? "swipe-right" :
                    liked === false && isActive ? "swipe-left" : ""
                  }`}
                  style={{
                    zIndex: isActive ? 10 : 5,
                    transform: isActive ? "scale(1) rotate(0deg)" : "scale(0.95) rotate(-3deg) translateY(20px)",
                    opacity: isActive ? 1 : 0.7,
                  }}
                >
                  <img src={profile.img} alt={profile.name} className="w-full h-80 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display font-bold text-2xl">{profile.name}</h3>
                      <span className="text-2xl">{profile.flag}</span>
                    </div>
                    <p className="text-sm text-white/80 mb-1">{profile.country}</p>
                    <p className="text-xs text-white/60 mb-3">🗣 {profile.lang}</p>
                    <p className="text-xs bg-white/20 backdrop-blur rounded-full px-3 py-1 inline-block">❤️ {profile.interest}</p>
                  </div>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 p-5 pt-0 flex gap-3 justify-center" style={{ paddingBottom: "1.25rem" }}>
                      <button onClick={() => handleSwipe(false)} className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform text-2xl mt-4">
                        ✕
                      </button>
                      <button onClick={() => handleSwipe(true)} className="w-14 h-14 bg-gradient-to-r from-blue-500 to-sky-400 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform text-2xl mt-4">
                        ♥
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            {liked === true && (
              <div className="absolute top-10 right-10 bg-blue-500 text-white font-bold text-2xl px-6 py-3 rounded-2xl rotate-12 z-20 shadow-xl">LIKE! ♥</div>
            )}
            {liked === false && (
              <div className="absolute top-10 left-10 bg-gray-200 text-gray-600 font-bold text-2xl px-6 py-3 rounded-2xl -rotate-12 z-20 shadow-xl">NOPE ✕</div>
            )}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: "150+", label: "Countries", emoji: "🌍" },
                { num: "50K+", label: "Users", emoji: "👥" },
                { num: "40+", label: "Languages", emoji: "🗣" },
                { num: "200K+", label: "Matches Made", emoji: "💙" },
              ].map((stat, i) => (
                <div key={i} className="stat-card rounded-3xl p-8 text-white text-center">
                  <div className="text-4xl mb-3">{stat.emoji}</div>
                  <div className="font-display font-bold text-4xl mb-1">{stat.num}</div>
                  <div className="text-blue-100 text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">How it works</p>
              <h2 className="font-display font-bold text-5xl text-gray-900">Three steps to your<br /><span className="gradient-text">first global friend</span></h2>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Build your profile", desc: "Tell the world who you are — your country, languages, interests, and the kind of people you want to meet.", icon: "✏️" },
              { step: "02", title: "Swipe & discover", desc: "Browse profiles from around the globe. Swipe right on people you'd love to connect with. Mutual swipes create a match!", icon: "🔍" },
              { step: "03", title: "Chat & connect", desc: "Start real conversations. Share culture, practice languages, swap recipes, or just make a genuine new friend.", icon: "💬" },
            ].map((item, i) => (
              <AnimatedSection key={i}>
                <div className="feature-card bg-white rounded-3xl p-8 transition-all duration-300 border border-gray-100">
                  <div className="text-5xl mb-6">{item.icon}</div>
                  <div className="text-blue-500 font-display font-bold text-sm mb-3">{item.step}</div>
                  <h3 className="font-display font-bold text-2xl text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section id="community" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Community</p>
              <h2 className="font-display font-bold text-5xl text-gray-900">Meet some of your<br /><span className="gradient-text">future friends</span></h2>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {profiles.map((p, i) => (
              <AnimatedSection key={i}>
                <div className="feature-card rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer border border-gray-100">
                  <img src={p.img} alt={p.name} className="w-full h-40 object-cover" />
                  <div className="p-3 text-center">
                    <p className="font-display font-bold text-sm text-gray-900">{p.name} {p.flag}</p>
                    <p className="text-xs text-gray-400 mt-1">{p.interest}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Stories</p>
              <h2 className="font-display font-bold text-5xl text-gray-900">Real friendships,<br /><span className="gradient-text">real stories</span></h2>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <AnimatedSection key={i}>
                <div className="feature-card bg-white rounded-3xl p-8 transition-all duration-300 border border-gray-100">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, j) => <span key={j} className="text-yellow-400">★</span>)}
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-6 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                      <p className="text-gray-400 text-xs">{t.country}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">FAQ</p>
              <h2 className="font-display font-bold text-5xl text-gray-900">Got <span className="gradient-text">questions?</span></h2>
            </div>
          </AnimatedSection>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <AnimatedSection key={i}>
                <div className="border border-gray-200 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-display font-semibold text-gray-900">{faq.q}</span>
                    <span className={`text-blue-500 transition-transform ${activeFaq === i ? "rotate-45" : ""}`}>+</span>
                  </button>
                  {activeFaq === i && (
                    <div className="px-6 pb-6 text-gray-500 leading-relaxed">{faq.a}</div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 btn-primary opacity-95" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="font-display font-bold text-6xl text-white mb-6">Ready to meet<br />the world?</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">Join thousands of curious people making real connections across every border. It's free, it's fun, and your next best friend is waiting.</p>
            <Link href="/signup" className="inline-block bg-white text-blue-600 font-bold text-lg px-12 py-5 rounded-2xl hover:scale-105 transition-transform shadow-2xl">
              Create your free profile →
            </Link>
            <p className="text-blue-200 text-sm mt-6">No credit card required • Free forever</p>
          </AnimatedSection>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl btn-primary flex items-center justify-center text-white font-bold text-sm">W</div>
            <span className="font-display font-bold text-white text-lg">WorldPals</span>
          </div>
          <p className="text-sm">© 2026 WorldPals. Made with ❤️ for the world.</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}