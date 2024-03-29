import React from 'react';
import styled, {createGlobalStyle} from 'styled-components';
import { ReactComponent as LogoSVG } from '../icons/logo.svg';
import { ReactComponent as BurgerSVG } from '../icons/burger.svg';
import { ReactComponent as SearchSVG } from '../icons/search.svg';
import { ReactComponent as EmailSVG} from '../icons/email.svg';

export const GlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    width: 100%;
    overflow-x: hidden;

    &::-webkit-scrollbar {
      width: 3px !important;
      border-radius: 20px !important;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1 !important;
      width: 3px !important;
      border-radius: 20px !important;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.6) !important;
      border-radius: 20px !important;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.6) !important;
      border-radius: 20px !important;
    }

    scrollbar-width: thin !important;
    scrollbar-color: rgba(114, 112, 112, 0.3) #f1f1f1;
  }
`;

const MenuContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 20px;
  height: 60px;
  background-color: #ffffff;
  width: 100vw;
`;

const LogoAndBurgerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;


const StyledBurgerSVG = styled(BurgerSVG)`
  width: 37px;
  height: 20px;
`;

const StyledLogoSVG = styled(LogoSVG)`
  width: 106px;
  height: 60px;
`;


const RightContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: 40px;
`;


export const StyledSearchSVG = styled(SearchSVG)`
  width: 30px;
  height: 20px;
`;

const SearchBarContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 50px;
`;


const SearchBar = styled.input`
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: none;
  width: 180px;
  font-size: 16px;
  color: #9D9D9D;
`;


const Icon = styled.span`
  position: absolute;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 30px;
`;

const StyledEmailSVG = styled(EmailSVG)`
  width: 40px;
  height: 30px;
`;

const TopMenu: React.FC = () => {
    return (
        <>
            <GlobalStyle/>
            <MenuContainer>
                <LogoAndBurgerContainer>
                    <StyledBurgerSVG />
                    <StyledLogoSVG />
                </LogoAndBurgerContainer>
                <RightContainer>
                    <SearchBarContainer>
                        <SearchBar type="text" />
                        <Icon>
                            <StyledSearchSVG />
                        </Icon>
                    </SearchBarContainer>
                    <Icon>
                        <StyledEmailSVG />
                    </Icon>
                </RightContainer>
            </MenuContainer>
        </>

    );
};


export default TopMenu;
