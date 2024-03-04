import styled from "styled-components";
import { ReactComponent as BurgerSortSVG } from '../icons/burgerSort.svg';
import { ReactComponent as SearchSVG } from '../icons/search.svg';
import { ReactComponent as ArrowSVG } from '../icons/arrow.svg';

import { ReactComponent as CircleGreenSVG} from "../icons/circleGreen.svg";
import { ReactComponent as CircleFioletEmptySVG} from "../icons/circleFioletEmpty.svg";
import {TreeChildrenProps, TreeIconProps, TreeNodeProps} from "./interface";


export const Layout = styled.div`
  background-color: #F2F4F6;
  height: 100vh;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  overflow: hidden;  
`;

export const Sidebar = styled.div`
  width: 300px;
  background-color: #FFF;
  box-sizing: border-box;
  overflow-y: hidden;
  height: 100vh;
`;


export const Content = styled.div`
  background-color: #ffffff;
  border-radius: 10px;
  width: 90%;
  max-width: 1800px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  margin-top: 20px;
  box-sizing: border-box;
  overflow: hidden;
  flex-direction: column;
  max-height: 85%;
  padding: 20px;
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




export const TreeIcon = styled.span<TreeIconProps>`
  margin-left: 2px;
  margin-right: 5px;
  display: ${props => props.hasChildren ? 'inline' : 'none'};
`;

export const TreeText = styled.span<TreeNodeProps>`
  font-family: 'Inter', sans-serif;
  font-size: ${props => props.level === 0 ? '18px' : '15px'};
  font-weight: ${props => props.level === 0 ? 600 : 400};
  line-height: 18px;
  letter-spacing: 0;
  text-align: left;
  flex-grow: 1;
`;


export const TreeChildren = styled.div<TreeChildrenProps>`
  display: ${({ collapsed }) => (collapsed ? 'none' : 'block')};
  max-height: 700px;
  overflow-y: hidden;
`;


export const StyledCircleGreenSVG = styled(CircleGreenSVG)`
  width: 21px; 
  height: 21px; 
  margin-right: 8px;
  flex-shrink: 0;
`;

export const StyledCircleFioletEmptySVG = styled(CircleFioletEmptySVG)`
  width: 21px; 
  height: 21px; 
  margin-right: 12px;
  flex-shrink: 0;
`;

export const TreeNode = styled.div<TreeNodeProps>`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
  background-color: ${props => props.level > 0 ? 'transparent' : '#f0f0f0'};
  margin-left: ${props => props.level * 20}px;

  &:hover {
    background-color: ${props => props.level > 0 ? 'transparent' : '#e0e0e0'};
  }
  
`;

export const ComplexContainer = styled.div`
  background-color: #f0f0f0;
  margin: 5px 0;
  border-radius: 5px;
  overflow-y: auto;
  max-height: 500px;

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
  scrollbar-color: rgba(114, 112, 112, 0.15) #f1f1f1 !important;
`;
