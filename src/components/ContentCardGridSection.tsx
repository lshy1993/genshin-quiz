import { Box, Grid, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

type GridSizeValue = {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
};

interface ContentCardGridSectionProps<T> {
  icon?: ReactNode;
  title: string;
  items: T[];
  getKey: (item: T) => string | number;
  renderCard: (item: T) => ReactNode;
  emptyText?: string;
  gridSize?: GridSizeValue;
  action?: ReactNode;
  spacing?: number;
}

export default function ContentCardGridSection<T>({
  icon,
  title,
  items,
  getKey,
  renderCard,
  emptyText,
  gridSize = { xs: 12, md: 4 },
  action,
  spacing = 3,
}: ContentCardGridSectionProps<T>) {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          {icon}
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Stack>
        {action}
      </Box>

      {items.length === 0 ? (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {emptyText ?? '暂无数据'}
        </Typography>
      ) : (
        <Grid container spacing={spacing}>
          {items.map((item) => (
            <Grid key={getKey(item)} size={gridSize}>
              {renderCard(item)}
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
