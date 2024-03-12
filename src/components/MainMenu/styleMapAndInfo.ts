import styled from "styled-components";
import { ReactComponent as LegendSVG } from '../icons/legend.svg';

export const InfoAndLegendWrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-top: auto;
  z-index: 10;
`;

export const BriefInfoContainer = styled.div`
  background-color: #F5F5F7;
  border-radius: 10px;
  display: flex;
  height: 130px;
  width: 230px;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

export const BriefInfoContent = styled.div`
  background-color: rgba(255, 255, 255, 0.77);
  margin-bottom: 10px;
  border-radius: 8px;
  height: 145px;
  width: 200px;

`;


export const BriefInfoTitle = styled.h4`
  font-family: 'Inter', sans-serif;
  font-size: 9px;
  font-weight: 600;
  line-height: 8px;
  letter-spacing: 0;
  text-align: center;
  width: 100%;
`;

export const BriefInfoText = styled.div`
  font-size: 8px;
  color: #666;
`;


export const SearchLegendSVG = styled(LegendSVG)`
  width: 290px;
  height: 220px;
`;

export const MapAndInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin-left: 20px;
  width: 100%;

`;


export const MapContainer = styled.div`
  flex-grow: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80%;

`;