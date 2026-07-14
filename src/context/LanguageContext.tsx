import { createContext, useContext, useEffect, useState } from 'react';
import i18n from '@/i18n'; // 直接导入 i18n 实例
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
  const [isInitialized, setIsInitialized] = useState(false);

  // 仅在用户资料语言变化时，同步到本地语言状态
  useEffect(() => {
    const newLanguage = getPreferredLanguage(userLanguage);

    if (!isInitialized || newLanguage !== i18n.language) {
      i18n
        .changeLanguage(newLanguage)
        .then(() => {
          setCurrentLanguage(newLanguage);
          setIsInitialized(true);
        })
        .catch(console.error);
    }
  }, [userLanguage, isInitialized]);

  // 手动切换语言时，立即同步 i18n
  const handleSetCurrentLanguage = (lang: string) => {
    if (allLanguages.includes(lang)) {
      i18n
        .changeLanguage(lang)
        .then(() => {
          setCurrentLanguage(lang);
        })
        .catch(console.error);
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
