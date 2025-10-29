import { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { allLanguages } from '@/util/enum';

interface LanguageContextType {
  currentLanguage: string;
  setCurrentLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'zh',
  setCurrentLanguage: () => {},
});

export function LanguageProvider({
  userLanguage,
  children,
}: React.PropsWithChildren<{ userLanguage?: string }>) {
  const { i18n } = useTranslation();

  // 获取首选语言的辅助函数
  const getPreferredLanguage = (userLanguage?: string): string => {
    // 1. 优先使用用户设置的语言
    if (userLanguage && allLanguages.includes(userLanguage)) {
      return userLanguage;
    }

    // 2. 使用浏览器语言
    const browserLang = navigator.language.split('-')[0]; // 'zh-CN' -> 'zh'
    if (allLanguages.includes(browserLang)) {
      return browserLang;
    }

    // 3. 使用浏览器语言列表
    for (const lang of navigator.languages) {
      const shortLang = lang.split('-')[0];
      if (allLanguages.includes(shortLang)) {
        return shortLang;
      }
    }

    // 4. 默认优先级：zh > en > 第一个可用语言
    if (allLanguages.includes('zh')) return 'zh';
    if (allLanguages.includes('en')) return 'en';

    // 5. 兜底：返回第一个可用语言或 'zh'
    return allLanguages[0] || 'zh';
  };

  const preferredLanguage = getPreferredLanguage(userLanguage);
  const [currentLanguage, setCurrentLanguage] = useState<string>(preferredLanguage);

  // 初始化时同步 i18n 语言
  useEffect(() => {
    if (i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage, i18n]);

  // 包装 setCurrentLanguage 来同步 i18n
  const handleSetCurrentLanguage = (lang: string) => {
    if (allLanguages.includes(lang)) {
      setCurrentLanguage(lang);
      i18n.changeLanguage(lang);
    }
  };

  return (
    <LanguageContext.Provider
      value={{ currentLanguage, setCurrentLanguage: handleSetCurrentLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// 添加 hook
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
