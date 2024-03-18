import styled from "styled-components";
import { ReactComponent as CircleGreenSVG} from "../icons/circleGreen.svg";
import { ReactComponent as CircleVioletEmptySVG} from "../icons/circleVioletEmpty.svg";
import {TreeChildrenProps, TreeIconProps, TreeNodeProps} from "./interface";

export const TreeIcon = styled.span<TreeIconProps>`
  margin-left: 2px;
  margin-right: 5px;
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
  padding: 5px;
  border-radius: 5px;
  background-color: ${props => props.$isActive ? 'white' : '#F2F4F6'};
  color: ${props => (props.$isActive && props.$isFloor) ? '#5FC15D' : 'black'};
  margin-left: ${props => props.$level * 3}px;
  font-weight: ${props => props.$isFloor ? 'bold' : 'normal'};

  &:before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${props => (props.$isFloor ? (props.$isActive ? '#5FC15D' : 'grey') : 'transparent')};

    margin-right: 5px;
    
  }

  // &:hover {
  //   background-color: ${props => props.$isActive || props.$isParentActive ? 'white' : '#E8E8E8'};
  // }

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
  padding: 8px 10px;
  font-size: 10px;
  color: white;
  background-color: #5FC15D;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #4eb14e;
  }

  &:focus {
    outline: none;
  }

  &:active {
    background-color: #449644;
  }

  &:last-child {
    margin-right: 0;
  }
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 4px;
  margin-top: 4px;
  background-color: #F8F8F8;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  & > button {
    padding: 8px 10px;
    border: none;
    border-radius: 4px;
    background-color: #5FC15D;
    color: white;
    font-size: 10px;
    cursor: pointer;

    &:hover {
      background-color: #4eb14e;
    }
  }
`;
