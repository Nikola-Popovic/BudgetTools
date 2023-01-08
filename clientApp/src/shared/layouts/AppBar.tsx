import React from 'react';
import styled from 'styled-components';
import { ColorConstants } from '../styling/ColorConstants';
import { FONT_FAMILLY, spacingL, spacingM, spacingS, spacingXXL } from '../styling/StylingConstants';
import { useTranslation } from 'react-i18next';
import i18next from '../lang/i18next';
import { MenuItem, Select } from '@mui/material';

export const APP_BAR_COLLAPSE_HEIGHT = '4vh';
export const APP_BAR_HEIGHT = '5vh';
export const TITLE_WIDTH = '200px';

const Bar = styled.div`
    display: grid;
    grid-template-columns: calc(50% + ${TITLE_WIDTH}/2) 1fr;
    grid-direction: row;
    align-items: center;
    justify-items: flex-end;
    width: 100%;
    padding: ${spacingS};
    height: ${APP_BAR_HEIGHT};
    color: white;
    min-height: 10px;
    font-family: ${FONT_FAMILLY};
    background-color: ${ColorConstants.AppBarColor};
    height: ${APP_BAR_HEIGHT};
`;

const BarTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: ${TITLE_WIDTH};
`;

const AppTitle = styled.div`
  color: ${ColorConstants.PrimaryAccent};
  padding-left: 1vw;
  padding-right: 1vw;
  font-size: 1em;
`;

const SubTitle = styled.div`
  opacity: 0.8;
  font-size: 0.8em;
`;

const BarEnd = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: ${spacingXXL};
`;

const MatSelect = styled(Select)`
  margin: ${spacingS};
  color: white;
  height: calc(${APP_BAR_HEIGHT} - ${spacingS});
  & .MuiSelect-icon,
  & .MuiInputBase-input {
    color: white;
  }
  & .MuiOutlinedInput-notchedOutline,
  & .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
    border-color: white;
  }
`;

export function AppBar() {
  const { t } = useTranslation('translation', { i18n: i18next });
  const [lang, setLang] = React.useState(i18next.language);

  const handleLangChange = (event: React.ChangeEvent<{ value: string }>) => {
    setLang(event.target.value);
    i18next.changeLanguage(event.target.value);
  };

  return <Bar>
    <BarTitle>
      <AppTitle>
        {t('appBar.title')}
      </AppTitle>
      <SubTitle>
        {t('appBar.subtitle')}
      </SubTitle>
    </BarTitle>
    <BarEnd>
      <MatSelect
        id="language-select"
        value={lang}
        color="secondary"
        displayEmpty
        onChange={(e) => handleLangChange(e as React.ChangeEvent<{ value: string }>)}
      >
        {i18next.languages.map((lang) => <MenuItem key={lang} value={lang}>{lang}</MenuItem>)}
      </MatSelect>
    </BarEnd>
  </Bar>;
}