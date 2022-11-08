import React from 'react';
import styled from 'styled-components';
import { ColorConstants } from '../styling/ColorConstants';
import { FONT_FAMILLY, spacingS } from '../styling/StylingConstants';
import { useTranslation } from 'react-i18next';
import i18next from '../lang/i18next';

export const APP_BAR_HEIGHT = '5vh';

const Bar = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: ${spacingS};
    height: ${APP_BAR_HEIGHT};
    color: white;
    min-height: 10px;
    align-items: center;
    justify-content: center;
    font-family: ${FONT_FAMILLY};
    background-color: ${ColorConstants.AppBarColor};
`;

const AppTitle = styled.div`
    color: ${ColorConstants.PrimaryAccent};
    padding-left: 1vw;
    padding:right: 1vw;
`;

export function AppBar() {
  const { t } = useTranslation('translation', { i18n: i18next });
  return <Bar>
    <AppTitle>
      {t('appBar.title')}
    </AppTitle>
    {t('appBar.subtitle')}
  </Bar>;
}