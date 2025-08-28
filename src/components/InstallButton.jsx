import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslations } from '../contexts/TranslationContext';

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslations();

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('App installed');
      setIsVisible(false);
    }
  };

  return isVisible ? (
    <Button onClick={handleClick} style={{ marginLeft: 'auto' }} color="inherit">
      {t('common.install')}
    </Button>
  ) : null;
};

export default InstallButton;
