import React from 'react';
import styled from 'styled-components';
import AtmButton from '../atoms/AtmButton';
import { useTranslation } from '../../i18n/LanguageContext';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.medium};
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
`;

const HeaderTitle = styled.h2`
  margin: 0;
`;

const LayHeader = ({ onToggleLanguage }) => {
  const { t, toggleLanguage } = useTranslation();

  return (
    <HeaderContainer>
      <HeaderTitle>{t('app.title')}</HeaderTitle>
      <AtmButton
        label={t('button.toggleTheme')}
        onClick={onToggleLanguage || toggleLanguage}
      />
    </HeaderContainer>
  );
};

export default LayHeader;