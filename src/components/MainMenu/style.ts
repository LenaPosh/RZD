import styled from "styled-components";
import { ReactComponent as BurgerSortSVG } from '../icons/burgerSort.svg';
import { ReactComponent as SearchSVG } from '../icons/search.svg';
import { ReactComponent as ArrowSVG } from '../icons/arrow.svg';



export const Layout = styled.div`
  background-color: #F2F4F6;
  height: 100vh;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  overflow-y: hidden;
`;

export const Sidebar = styled.div`
  width: 300px;
  background-color: #FFF;
  box-sizing: border-box;
  overflow-y: hidden;
  flex-shrink: 0;
`;


export const Content = styled.div`
  background-color: #ffffff;
  border-radius: 10px;
  width: 90%;
  max-width: 1800px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  margin-top: 20px;
  margin-right: 20px;
  margin-left: 20px;
  box-sizing: border-box;
  overflow: hidden;
  align-items: stretch;
  flex-direction: row;
  max-height: 85%;
  padding: 10px;
  //gap: 10px;
  flex-grow: 1;
  position: relative;
 
`;

export const SearchAndSortContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  background: #FFF;
  gap: 10px;
`;

export const SearchInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const SearchIDContainer = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-start;
  margin-top: 10px;
`;

export const SearchInput = styled.input`
  padding: 8px 8px 8px 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 12px;
  width: 70px;
`;

export const SearchIcon = styled(SearchSVG)`
  position: absolute;
  right: 16px;
  width: 20px;
  height: 20px;
`;

export const SortInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const SortInput = styled.input`
  padding: 8px 8px 8px 30px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 12px;
  width: 90px;
`;

export const StyledBurgerSortSVG = styled(BurgerSortSVG)`
  width: 40px;
  height: 30px;
`;

export const ArrowIcon = styled(ArrowSVG)`
  position: absolute;
  left: 10px;
  width: 20px;
  height: 20px;
`;

export const ZoomContainer = styled.div`
  position: absolute;
  top: 10px; 
  right: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #F5F5F7;
  border-radius: 10px;
  padding: 5px;
  gap: 5px;
`;

export const ModeSwitchContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
  bottom: 210px;
  right: 10px;
`;

export const IconWrapper = styled.div`
  cursor: pointer;
`;



