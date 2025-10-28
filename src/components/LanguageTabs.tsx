import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Box, IconButton, Tab, Tabs } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import { allLanguages } from '@/util/enum';
import LanguageSelectDialog from './LanguageSelectDialog';

interface Props {
  currentLang: string;
  handleLanguageChange: (event: React.SyntheticEvent, newValue: string) => void;
  selectedLanguages: string[];
  handleDeleteLanguage: (lang: string) => void;
  handleAddLanguage: (lang: string) => void;
}

export default function LanguageTabs({
  currentLang,
  handleLanguageChange,
  selectedLanguages,
  handleDeleteLanguage,
  handleAddLanguage,
}: Props) {
  const [isAddLangDialogOpen, setIsAddLangDialogOpen] = useState(false);

  // 获取可添加的语言列表
  const availableLanguages = allLanguages.filter((lang) => !selectedLanguages.includes(lang));

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 48,
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Tabs value={currentLang} onChange={handleLanguageChange} sx={{ flexGrow: 1 }}>
          {selectedLanguages.map((lang) => (
            <Tab
              key={lang}
              label={
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  {t(`languages.${lang}`)}
                  {selectedLanguages.length > 1 && (
                    <IconButton size="small" onClick={() => handleDeleteLanguage(lang)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              }
              value={lang}
            />
          ))}
        </Tabs>
        {availableLanguages.length > 0 && (
          <IconButton onClick={() => setIsAddLangDialogOpen(true)} size="small" sx={{ m: 2 }}>
            <AddIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      {/* 添加语言对话框 */}
      <LanguageSelectDialog
        open={isAddLangDialogOpen}
        onClose={() => setIsAddLangDialogOpen(false)}
        availableLanguages={availableLanguages}
        addNewLanguage={handleAddLanguage}
      />
    </>
  );
}
