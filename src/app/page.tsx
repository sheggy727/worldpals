import Link from "next/link";
import { Globe, MessageCircle, Shield, Users, Star, Languages } from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: <Globe className="w-8 h-8 text-primary-600" />,
      title: "Global Connections",
      desc: "Meet people from 150+ countries who are just as curious about the world as you are.",
    },
    {
      icon: <Languages className="w-8 h-8 text-primary-600" />,
      title: "Language Exchange",
      desc: "Practice languages with native speakers and teach your own — learn together naturally.",
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-primary-600" />,
      title: "Real-time Chat",
      desc: "Instant messaging with your WorldPals to share stories, memes, and culture.",
    },
    {
      icon: <Shield className="w-8 h-8 text-primary-600" />,
      title: "Safe & Respectful",
      desc: "Community guidelines, reporting tools, and active moderation keep everyone comfortable.",
    },
    {
      icon: <Users className="w-8 h-8 text-primary-600" />,
      title: "Interest Matching",
      desc: "Connect with people who share your passions — travel, food, music, tech, and more.",
    },
    {
      icon: <Star className="w-8 h-8 text-primary-600" />,
      title: "Cultural Exchange",
      desc: "Discover traditions, recipes, festivals, and stories from every corner of the globe.",
    },
  ];

  const stats = [
    { value: "150+", label: "Countries" },
    { value: "40+", label: "Languages" },
    { value: "100%", label: "Free to use" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-gray-900" />
            </div>
            <span className="text-xl font-bold text-gray-900">WorldPals</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost text-sm">
              Log in
            </Link>
            <Link href="/signup" className="btn-primary text-sm py-2">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
            <Globe className="w-4 h-4" />
            <span>Make friends from every corner of the world</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
            Your world is{" "}
            <span className="relative">
              <span className="relative z-10 text-primary-600">bigger</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-primary-200 -rotate-1 z-0 rounded" />
            </span>{" "}
            than you think
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            WorldPals connects you with genuine people from every country for cultural exchange,
            language learning, and lifelong friendships. Swipe, match, chat.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl">
              Start connecting — it&apos;s free
            </Link>
            <Link href="/login" className="btn-secondary text-lg px-8 py-4">
              Already have an account
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 bg-primary-500">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-4xl font-extrabold text-gray-900">{s.value}</div>
              <div className="text-sm font-medium text-gray-800 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How WorldPals works
            </h2>
            <p className="text-gray-500 text-lg">Three simple steps to your first global friendship</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create your profile",
                desc: "Tell us about yourself — your country, languages, interests, and where in the world you want to connect.",
              },
              {
                step: "2",
                title: "Swipe & discover",
                desc: "Browse profiles from around the globe. Swipe right on people you'd love to learn from. When it's mutual — it's a match!",
              },
              {
                step: "3",
                title: "Chat & connect",
                desc: "Start real conversations. Share culture, practice languages, swap recipes, or just make a new friend.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="card text-center hover:shadow-card-hover transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-extrabold text-gray-900">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to connect
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="p-6 rounded-3xl border border-gray-100 hover:border-primary-200 hover:shadow-card transition-all">
                <div className="mb-4">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary-500">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to meet the world?
          </h2>
          <p className="text-gray-800 text-lg mb-8">
            Join thousands of curious people making real connections across borders.
          </p>
          <Link href="/signup" className="inline-block bg-gray-900 text-white font-semibold px-8 py-4 rounded-full text-lg hover:bg-gray-800 transition-colors">
            Create your free profile
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-500 rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-gray-900" />
            </div>
            <span className="font-bold text-gray-900">WorldPals</span>
          </div>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} WorldPals. Made with ❤️ for the world.
          </p>
        </div>
      </footer>
    </div>
  );
}
