import styled from "styled-components";
import { ReactComponent as CircleGreenSVG} from "../icons/circleGreen.svg";
import { ReactComponent as CircleFioletEmptySVG} from "../icons/circleFioletEmpty.svg";
import {TreeChildrenProps, TreeIconProps, TreeNodeProps} from "./interface";

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
  background-color: ${props => props.level > 0 ? 'transparent' : '#F5F5F7'};
  margin-left: ${props => props.level * 20}px;

  &:hover {
    background-color: ${props => props.level > 0 ? 'transparent' : '#F5F5F7'};
  }
  
`;

export const ComplexContainer = styled.div`
  background-color: #F5F5F7;
  margin: 5px 0;
  border-radius: 10px;
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
