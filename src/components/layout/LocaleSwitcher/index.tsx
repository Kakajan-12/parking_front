import { useLocale } from "next-intl";

import LanguageSwitcher from "./LanguageSwitcher";

const LocaleSwitcher = ({ className }: { className?: string }) => {
    const locale = useLocale();

    return <LanguageSwitcher className={className} defaultLocale={locale} />;
};

export default LocaleSwitcher;
