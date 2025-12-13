import { Add as AddIcon } from '@mui/icons-material';
import { Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import type { VoteOption, VoteWithOption } from '@/api/dto';
import LanguageTabs from '@/components/LanguageTabs';
import { useLanguage } from '@/context/LanguageContext';
import CreateVoteOption from './CreateVoteOption';

interface Props {
  errors: Record<string, string | undefined>;
  form: VoteWithOption;
  setForm: React.Dispatch<React.SetStateAction<VoteWithOption>>;
  setTouchedField: (field: string) => void;
}

export default function CreateVoteOptionInfo({ errors, form, setForm, setTouchedField }: Props) {
  const { currentLanguage } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<string>(currentLanguage);

  const addOption = () => {
    const newOption: VoteOption = { type: 'text', text: { [currentLanguage]: '' } };
    setForm({ ...form, options: [...form.options, newOption] });
  };

  // 语言选择处理
  const handleLanguageChange = (_event: React.SyntheticEvent, newValue: string) => {
    setSelectedLang(newValue);
  };

  // 添加新语言
  const handleAddLanguage = (lang: string) => {
    if (!lang) return;
    // 为每个文本部分添加新的
    setForm((prev) => {
      const new_options = prev.options.map((opt) => ({
        ...opt,
        text: { ...opt.text, [lang]: '' },
      }));
      return {
        ...prev,
        title: { ...prev.title, [lang]: '' },
        description: { ...prev.description, [lang]: '' },
        options: new_options,
      };
    });
    setSelectedLang(lang);
  };

  const handleDeleteLanguage = (lang: string) => {
    // 至少保留一个语言
    if (Object.keys(form.title).length <= 1) return;

    // 如果删除的是当前语言，则切换到下一个
    if (selectedLang === lang) {
      const remainingLangs = Object.keys(form.title).filter((l) => l !== lang);
      setSelectedLang(remainingLangs[0]);
    }

    setForm((prev) => {
      // 删除 title 和 description 的该语言
      const { [lang]: _, ...new_title } = prev.title;
      const { [lang]: __, ...new_description } = prev.description || {};

      // 删除 options 里 text 的该语言
      const new_options = prev.options.map((opt) => {
        const { [lang]: ___, ...new_text } = opt.text || {};
        return { ...opt, text: new_text };
      });

      return {
        ...prev,
        title: new_title,
        description: new_description,
        options: new_options,
      };
    });
  };

  return (
    <Card variant="outlined">
      <LanguageTabs
        currentLang={selectedLang}
        handleLanguageChange={handleLanguageChange}
        selectedLanguages={Object.keys(form.title)}
        handleDeleteLanguage={handleDeleteLanguage}
        handleAddLanguage={handleAddLanguage}
      />
      <CardContent>
        <Stack direction="column" spacing={2}>
          {/* 投票标题 */}
          <TextField
            fullWidth
            label="投票标题"
            size="small"
            value={form.title[currentLanguage] || ''}
            onChange={(e) => {
              setTouchedField('title');
              setForm((prev) => ({
                ...prev,
                title: { ...prev.title, [currentLanguage]: e.target.value },
              }));
            }}
            error={!!errors?.title}
            helperText={errors?.title}
            required
          />
          {/* 投票描述 */}
          <TextField
            fullWidth
            multiline
            rows={3}
            size="small"
            label="投票描述"
            value={form.description?.[currentLanguage] || ''}
            onChange={(e) => {
              setTouchedField('description');
              setForm((prev) => ({
                ...prev,
                description: { ...prev.description, [currentLanguage]: e.target.value },
              }));
            }}
            error={!!errors?.description}
            helperText={errors?.description}
          />

          <Typography variant="h6" gutterBottom>
            投票选项
          </Typography>
          {form.options.map((option, index) => (
            <CreateVoteOption
              key={`${index}-${option.text?.[currentLanguage]}`}
              index={index}
              optionText={option.text?.[currentLanguage] ?? ''}
              updateOption={(i, str) => {
                const newOptions = [...form.options];
                newOptions[i].text = { ...newOptions[i].text, [currentLanguage]: str };
                setForm({ ...form, options: newOptions });
              }}
              removeOption={(i) => {
                const newOptions = form.options.filter((_, idx) => idx !== i);
                setForm({ ...form, options: newOptions });
              }}
              showDeleteIcon={form.options.length > 1}
              error={errors[`options.${index}.text.${currentLanguage}`]}
            />
          ))}
          <Button variant="outlined" startIcon={<AddIcon />} onClick={addOption}>
            添加选项
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
