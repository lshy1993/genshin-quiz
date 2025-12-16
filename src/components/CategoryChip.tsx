import type { ChipProps } from '@mui/material';
import { Chip } from '@mui/material';
import { getCategoryColor, getCategoryLabel } from '@/util/utils';

interface CategoryChipProps {
  category: string;
  size?: ChipProps['size'];
  variant?: ChipProps['variant'];
  color?: ChipProps['color'];
}

export default function CategoryChip({
  category,
  size = 'small',
  variant = 'filled',
  color,
}: CategoryChipProps) {
  const categoryColor = color || getCategoryColor(category);
  return (
    <Chip label={getCategoryLabel(category)} size={size} variant={variant} color={categoryColor} />
  );
}
