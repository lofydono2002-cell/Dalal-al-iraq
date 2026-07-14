import { Link, useLocation } from "wouter";
import { Home, Search, Plus, MessageCircle, User, Bell, Moon, Sun, Globe } from "lucide-react";
import { api, getUser } from "@/lib/api";
import { LOGO_URL } from "@/lib/utils";
import { useTheme } from "@/lib/theme";
import { useI18n, useT, LANGS } from "@/lib/i18n";
import { useState, useEffect, useRef } from "react";

interface UserInfo { userId: string; phone: string; name: string; role: string }

export function Navigation() {
  const [location] = useLocation();
  const { theme, toggle } = useTheme();
  const { lang, setLang } = useI18n();
  const t = useT();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [unread, setUnread] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    setUser(getUser());
    const onStorage = () => setUser(getUser());
    window.addEventListener("storage", onStorage);
    window.addEventListener("auth-change", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth-change", onStorage);
    };
  }, []);

  useEffect(() => {
    if (!user) { setUnread(0); setUnreadMessages(0); return; }
    let active = true;
    const poll = () => {
      api.get<{ count: number }>("/notifications/unread-count")
        .then((d) => { if (active) setUnread(d.count); })
        .catch(() => {});
      api.get<{ count: number }>("/notifications/unread-count?type=message")
        .then((d) => { if (active) setUnreadMessages(d.count); })
        .catch(() => {});
    };
    poll();
    const interval = setInterval(poll, 30_000);
    const onRead = () => poll();
    window.addEventListener("notifications-read", onRead);
    return () => {
      active = false;
      clearInterval(interval);
      window.removeEventListener("notifications-read", onRead);
    };
  }, [user, location]);

  const nav = [
    { href: "/", icon: Home, label: t("nav.home") },
    { href: "/listings", icon: Search, label: t("nav.listings") },
    { href: "/add-listing", icon: Plus, label: t("nav.add") },
    { href: "/chat", icon: MessageCircle, label: t("nav.chat") },
    { href: "/profile", icon: User, label: t("nav.profile") },
  ];

  return (
    <>
      {/* Top bar */}
      <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-orange-500 flex items-center gap-2">
            <img src={LOGO_URL} alt="دلال العراق" className="w-9 h-9 rounded-lg object-cover" />
            دلال العراق
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link href="/notifications" className="relative text-gray-400 hover:text-orange-500 transition p-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800">
                  <Bell className="w-5 h-5" />
                  {unread > 0 && (
                    <span className="absolute top-0 left-0 bg-red-500 text-white text-[10px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </Link>
                <Link href="/profile" className="w-9 h-9 bg-orange-100 dark:bg-orange-950 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold text-sm hover:bg-orange-200 dark:hover:bg-orange-900 transition">
                  {user.name?.charAt(0) || user.phone?.slice(-2)}
                </Link>
              </>
            ) : (
              <>
                <div className="relative" ref={langRef}>
                  <button
                    type="button"
                    onClick={() => setLangOpen((o) => !o)}
                    aria-label={t("nav.language")}
                    className="text-gray-400 hover:text-orange-500 transition p-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 flex items-center gap-1"
                  >
                    <Globe className="w-5 h-5" />
                    <span className="text-xs font-medium uppercase">{lang}</span>
                  </button>
                  {langOpen && (
                    <div className="absolute end-0 mt-1 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-50">
                      {LANGS.map((l) => (
                        <button
                          key={l.code}
                          type="button"
                          onClick={() => { setLang(l.code); setLangOpen(false); }}
                          className={`w-full text-start px-3 py-2 text-sm flex items-center gap-2 hover:bg-orange-50 dark:hover:bg-gray-700 transition ${
                            lang === l.code ? "text-orange-500 font-semibold" : "text-gray-700 dark:text-gray-200"
                          }`}
                        >
                          <span>{l.flag}</span>
                          {l.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={toggle}
                  aria-label={t("nav.darkMode")}
                  className="text-gray-400 hover:text-orange-500 transition p-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800"
                >
                  {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <Link href="/login" className="bg-orange-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-orange-600 transition">
                  {t("nav.login")}
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 safe-area-inset-bottom">
        <div className="flex justify-around max-w-lg mx-auto">
          {nav.map(({ href, icon: Icon, label }) => {
            const active = location === href || (href !== "/" && location.startsWith(href));
            const showMsgDot = href === "/chat" && unreadMessages > 0 && user;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center py-2 px-2 flex-1 transition ${
                  active ? "text-orange-500" : "text-gray-400"
                }`}
              >
                {href === "/add-listing" ? (
                  <div className="w-11 h-11 bg-orange-500 rounded-full flex items-center justify-center -mt-5 shadow-lg shadow-orange-200">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <div className="relative">
                    <Icon className={`w-5 h-5 ${active ? "text-orange-500" : ""}`} />
                    {showMsgDot && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900" />
                    )}
                  </div>
                )}
                <span className={`text-xs mt-0.5 ${href === "/add-listing" ? "mt-1" : ""}`}>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
