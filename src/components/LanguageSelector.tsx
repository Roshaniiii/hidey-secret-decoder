import { useEffect, useState } from "react";
import { Languages } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "zh-CN", label: "中文 (简体)" },
  { code: "zh-TW", label: "中文 (繁體)" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "hi", label: "हिन्दी" },
  { code: "ar", label: "العربية" },
  { code: "pt", label: "Português" },
  { code: "ru", label: "Русский" },
  { code: "it", label: "Italiano" },
  { code: "tr", label: "Türkçe" },
  { code: "id", label: "Bahasa Indonesia" },
];

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

function getCurrentLang(): string {
  const m = document.cookie.match(/(?:^|;\s*)googtrans=\/[^/]+\/([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "en";
}

function setTransCookie(code: string) {
  const host = window.location.hostname;
  const expire = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
  // clear on all scopes first
  document.cookie = `googtrans=; ${expire}; path=/`;
  document.cookie = `googtrans=; ${expire}; path=/; domain=${host}`;
  document.cookie = `googtrans=; ${expire}; path=/; domain=.${host}`;
  if (code !== "en") {
    const val = `/en/${code}`;
    document.cookie = `googtrans=${val}; path=/`;
    document.cookie = `googtrans=${val}; path=/; domain=.${host}`;
  }
}

export function LanguageSelector() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    setLang(getCurrentLang());
    if (document.getElementById("google-translate-script")) return;
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: "en", autoDisplay: false },
        "google_translate_element"
      );
    };
    const s = document.createElement("script");
    s.id = "google-translate-script";
    s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  const change = (code: string) => {
    setLang(code);
    setTransCookie(code);
    window.location.reload();
  };

  return (
    <>
      <div id="google_translate_element" className="hidden" />
      <Select value={lang} onValueChange={change}>
        <SelectTrigger
          className="notranslate h-9 w-auto gap-1.5 rounded-xl border-border px-2.5 text-sm"
          aria-label="Choose language"
        >
          <Languages className="h-4 w-4 text-muted-foreground" />
          <span className="hidden sm:inline">
            <SelectValue />
          </span>
        </SelectTrigger>
        <SelectContent className="notranslate">
          {LANGUAGES.map((l) => (
            <SelectItem key={l.code} value={l.code}>
              {l.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
