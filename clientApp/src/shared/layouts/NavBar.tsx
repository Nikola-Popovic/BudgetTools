import React from 'react';
import styled from 'styled-components';
import { ColorConstants } from '../styling/ColorConstants';
import { FONT_FAMILLY, spacingS } from '../styling/StylingConstants';
import { useTranslation } from 'react-i18next';
import i18next from '../lang/i18next';

export const APP_BAR_HEIGHT = '5vh';

const Bar = styled.div<{isVisible: boolean}>`
    display: flex;
    flex-direction: row;
    width: 100%;
    padding: ${spacingS};
    height: ${APP_BAR_HEIGHT};
    min-height: 10px;
    align-items: center;
    justify-content: center;
    font-family: ${FONT_FAMILLY};
    background-color: ${ColorConstants.PrimaryAccent};
    visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
    animation: ${props => props.isVisible ? 'slideIn 1s ease-in-out' : 'slideOut 1s ease-in-out'};
`;

const NavLink = styled.a`
    display: block;
    position: relative;
    text-decoration: none;
    opacity: 0.6;
    padding: ${spacingS};
    margin: ${spacingS};
    color: ${ColorConstants.PrimaryAccent};
    color: white;
    font-size: 1.2em;
    overflow: hidden;
    &:hover {
        cursor: pointer;
        opacity: 1;
    }
    &::after {
        position: absolute;
        content: '';
        width: 100%;
        height: 0.1em;
        bottom: 0;
        left: 0;
        background-color: ${ColorConstants.PrimaryAccent};
        background-color: white;
        opacity: 1;
        transition: opacity 300ms, transform 300ms;
        transform: translate3d(-100%, 0, 0);
    }
    &:hover::after,
    &:focus::after {
        transform: translate3d(0, 0, 0);
    }
`;

export interface INavBarProps {
    isVisible: boolean;
}

export function NavBar(props : INavBarProps) {
  const { t } = useTranslation('translation', { i18n: i18next });
  return <Bar isVisible={props.isVisible}>
    <NavLink id='home' href='/'> {t('nav.home')} </NavLink>
    <NavLink id='receiptTracker' href='/receiptTracker'> {t('nav.receiptTracker')} </NavLink>
    <NavLink id='timeBudget' href='/timeBudget'> {t('nav.timeBudget')} </NavLink>
  </Bar>;
}