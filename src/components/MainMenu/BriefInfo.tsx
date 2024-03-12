import React from "react";
import {BriefInfoProps} from "./interface";
import {BriefInfoContainer, BriefInfoContent, BriefInfoText, BriefInfoTitle} from "./styleMapAndInfo";

export const BRIEF_INFO_URL = "";
export const BriefInfo: React.FC<BriefInfoProps> = ({ info }) => {
    return (
        <BriefInfoContainer>
            <BriefInfoTitle>Краткая справка по выделенным зонам</BriefInfoTitle>
            <BriefInfoContent>
                {info ? (
                    <>
                        <BriefInfoText>Зоны: {info.zoneNumbers}</BriefInfoText>
                        <BriefInfoText>Тип: {info.type}</BriefInfoText>
                        <BriefInfoText>Статус: {info.status}</BriefInfoText>
                        <BriefInfoText>Измеритель: {info.measurement}</BriefInfoText>
                        <BriefInfoText>Единицы измерения: {info.measurementUnit}</BriefInfoText>
                        <BriefInfoText>Подразделение-пользователь: {info.userCategory}</BriefInfoText>
                    </>
                ) : (
                    <div style={{ flex: 1 }}></div>
                )}
            </BriefInfoContent>

        </BriefInfoContainer>
    );
};