import React from 'react';
import styled from 'styled-components';
import { ColorConstants } from '../styling/ColorConstants';
import { FONT_FAMILLY, spacingS } from '../styling/StylingConstants';
import { useTranslation } from 'react-i18next';
import i18next from '../lang/i18next';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export const APP_BAR_COLLAPSE_HEIGHT = '4vh';
export const APP_BAR_HEIGHT = '5vh';
export const APP_BAR_GROW_HEIGHT = '6vh';

interface IBarProps {
  isCollapsed: boolean;
}

const Bar = styled.div<IBarProps>`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: ${spacingS};
    height: ${APP_BAR_HEIGHT};
    color: white;
    min-height: 10px;
    font-family: ${FONT_FAMILLY};
    background-color: ${ColorConstants.AppBarColor};
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    height: ${props => props.isCollapsed ? APP_BAR_COLLAPSE_HEIGHT : APP_BAR_HEIGHT};
    &:hover {
      height: ${(props) => props.isCollapsed ? APP_BAR_HEIGHT : APP_BAR_GROW_HEIGHT};
    }
`;

const AppTitle = styled.div<IBarProps>`
  color: ${ColorConstants.PrimaryAccent};
  padding-left: 1vw;
  padding-right: 1vw;
  font-size: 1em;
  transition: all 0.3s ease-in-out;
  transform: ${props => props.isCollapsed ? 'scale(0.9)' : 'scale(1)'};
`;

const SubTitle = styled.div<IBarProps>`
  opacity: 0.8;
  font-size: 0.8em;
  transition: all 0.3s ease-in-out;
  transform: ${props => props.isCollapsed ? 'scale(0.9)' : 'scale(1)'};
`;

const AlignCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

type ArrowProps = IBarProps & {
  isHovered: boolean;
}
const Arrow = styled(ArrowForwardIosIcon)<ArrowProps> `
  animation: fadeInOut 1s infinite;
  transition: all 1s ease-in-out;
  visibility: ${props => props.isHovered ? 'visible' : 'hidden'};
  transform: ${props => props.isCollapsed ? 'rotate(270deg)' : 'rotate(90deg)'};
`;

export interface IAppBarProps {
  onClick(): void;
}

export function AppBar(props : IAppBarProps) {
  const { t } = useTranslation('translation', { i18n: i18next });
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleClick = () : void =>{
    setIsCollapsed(!isCollapsed);
    props.onClick();
  };

  return <Bar isCollapsed={isCollapsed} onClick={() => handleClick()} 
    onMouseEnter={(_ => setIsHovered(true))} onMouseLeave={(_ => setIsHovered(false))}>
    <AlignCenter>
      <AppTitle isCollapsed={isCollapsed}>
        {t('appBar.title')}
      </AppTitle>
      <SubTitle isCollapsed={isCollapsed}>
        {t('appBar.subtitle')}
      </SubTitle>
    </AlignCenter>
    <Arrow isCollapsed={isCollapsed} isHovered={isHovered}/>
  </Bar>;
}