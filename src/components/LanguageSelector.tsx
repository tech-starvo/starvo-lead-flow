import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { LOCALE_NAMES, LOCALE_FLAGS, type LocaleCode } from "@/locales/translations";

const LOCALE_LIST: LocaleCode[] = ["id", "en", "zh", "ja", "ko", "pt", "ar"];

/** Flag + name as one string so Radix shows it in both trigger and dropdown */
function localeLabel(code: LocaleCode): string {
  return `${LOCALE_FLAGS[code]} ${LOCALE_NAMES[code]}`;
}

export default function LanguageSelector() {
  const { locale, setLocale } = useLanguage();

  return (
    <Select value={locale} onValueChange={(v) => setLocale(v as LocaleCode)}>
      <SelectTrigger className="w-[200px] h-9 border-input bg-card/80 text-sm">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {LOCALE_LIST.map((code) => (
          <SelectItem key={code} value={code}>
            {localeLabel(code)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
