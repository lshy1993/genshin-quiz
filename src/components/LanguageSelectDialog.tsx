import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
} from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  availableLanguages: string[];
  addNewLanguage: (lang: string) => void;
}

export default function LanguageSelectDialog({
  open,
  onClose,
  availableLanguages,
  addNewLanguage,
}: Props) {
  const [selectedNewLang, setSelectedNewLang] = useState<string>('');

  // 每次打开时重置默认选中项
  useEffect(() => {
    if (open) {
      setSelectedNewLang(availableLanguages[0] || '');
    }
  }, [open, availableLanguages]);

  // 关键：availableLanguages 为空时，selectedNewLang 也要设为 ''
  useEffect(() => {
    if (!availableLanguages.includes(selectedNewLang)) {
      setSelectedNewLang(availableLanguages[0] || '');
    }
  }, [availableLanguages, selectedNewLang]);

  const handleAdd = () => {
    addNewLanguage(selectedNewLang);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>添加新语言</DialogTitle>
      <DialogContent>
        <Select
          value={selectedNewLang}
          onChange={(e) => setSelectedNewLang(e.target.value)}
          fullWidth
          sx={{ mt: 1 }}
        >
          {availableLanguages.map((lang) => (
            <MenuItem key={lang} value={lang}>
              {t(`languages.${lang}`)}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={handleAdd} variant="contained" disabled={!selectedNewLang}>
          添加
        </Button>
      </DialogActions>
    </Dialog>
  );
}
