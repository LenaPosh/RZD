import styled from "styled-components";
import { ReactComponent as CircleGreenSVG} from "../icons/circleGreen.svg";
import { ReactComponent as CircleVioletEmptySVG} from "../icons/circleVioletEmpty.svg";
import {TreeChildrenProps, TreeIconProps, TreeNodeProps} from "./interface";

export const TreeIcon = styled.span<TreeIconProps>`
  margin-left: 2px;
  display: ${props => props.$hasChildren ? 'inline' : 'none'};
`;

export const TreeText = styled.span<TreeNodeProps>`
  font-family: 'Inter', sans-serif;
  font-size: ${props => props.$level === 0 ? '17px' : '14px'};
  font-weight: ${props => props.$level === 0 ? 600 : 400};
  line-height: 18px;
  letter-spacing: 0;
  text-align: left;
  flex-grow: 1;
`;


export const TreeChildren = styled.div<TreeChildrenProps>`
  display: ${({ $collapsed }) => ($collapsed ? 'none' : 'block')};
  max-height: 850px;
  overflow-y: hidden;
`;


export const StyledCircleGreenSVG = styled(CircleGreenSVG)`
  width: 21px; 
  height: 21px; 
  margin-right: 8px;
  flex-shrink: 0;
`;

export const StyledCircleVioletEmptySVG = styled(CircleVioletEmptySVG)`
  width: 21px; 
  height: 21px; 
  margin-right: 12px;
  flex-shrink: 0;
`;

export const TreeNode = styled.div<TreeNodeProps>`
  display: flex;
  align-items: center;
  cursor: pointer;
  //padding: 5px;
  border-radius: 5px;
  color: ${props => (props.$isActive && props.$isFloor) ? '#5FC15D' : 'black'};
  margin-left: ${props => props.$level * 2}px;
  font-weight: ${props => props.$isFloor ? 'bold' : 'normal'};
  background-color: ${props => props.$isActive ? 'white' : 'transparent'};
  
  &:before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${props => (props.$isFloor ? (props.$isActive ? '#5FC15D' : 'grey') : 'transparent')};

    margin-right: 5px;
    
  }



`;





export const ComplexContainer = styled.div`
  background-color: #F5F5F7;
  margin: 5px 0;
  border-radius: 10px;
  overflow-y: auto;
  max-height: 610px;

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


export const TreeGroupContainer = styled.div<{ $isActive: boolean }>`
  border-radius: 5px;
  background-color: ${(props) => (props.$isActive ? 'white' : 'transparent')};
  padding: 5px;
`;

export const Button = styled.button`
  padding: 0;
  font-size: 10px;
  border: none;
  cursor: pointer;
  margin-right: 5px;
  display: flex;
  align-items: center;
  justify-content: center;

  //&:hover {
  //  background-color: #4eb14e;
  //}

  &:focus {
    outline: none;
  }

  //&:active {
  //  background-color: #449644;
  //}

  &:last-child {
    margin-right: 7px;
  }
`;

export const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0;
  margin-top: 4px;
  border-radius: 8px;
`;


export const TreeTextContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;


