import { Fab, GlobalStyles } from '@mui/material';
import { useState } from 'react';

export default function DevHelperWrapper({ children }: { children: React.ReactNode }) {
  const [showPadding, setShowPadding] = useState(false);

  return (
    <>
      {showPadding && (
        <GlobalStyles
          styles={{
            '[class*="MuiBox-root"], [class*="MuiStack-root"], [class*="MuiPaper-root"], [class*="MuiButtonBase-root"], [class*="MuiChip-root"], [class*="MuiTextField-root"]':
              {
                outline: '2px dashed #1976d2',
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              },
            '[class*="MuiBox-root"][style*="margin"], [class*="MuiStack-root"][style*="margin"]': {
              boxShadow: '0 0 0 2px #d32f2f inset',
              backgroundColor: 'rgba(211, 47, 47, 0.04)',
            },
            'th, td': {
              border: '1px dashed #f44336',
              backgroundColor: 'rgba(255,0,0,0.04)',
            },
          }}
        />
      )}
      {/* 悬浮按钮 */}
      <Fab
        size="small"
        color={showPadding ? 'primary' : 'default'}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 2000,
          opacity: 0.8,
        }}
        onClick={() => setShowPadding((v) => !v)}
        title={showPadding ? '关闭辅助线' : '显示辅助线'}
      >
        {showPadding ? '关' : '开'}
      </Fab>
      {children}
    </>
  );
}
