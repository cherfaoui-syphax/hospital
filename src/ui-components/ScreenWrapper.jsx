/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import React from "react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { Flex, Menu } from "@aws-amplify/ui-react";
import RightSideContent from "./RightSideContent";
export default function ScreenWrapper(props) {
  const { overrides, ...rest } = props;
  return (
    <Flex
      gap="0"
      direction="row"
      alignItems="flex-start"
      position="relative"
      padding="0px 0px 0px 0px"
      backgroundColor="rgba(217,217,217,0)"
      {...rest}
      {...getOverrideProps(overrides, "ScreenWrapper")}
    >
      <Menu
        width="192px"
        height="784px"
        shrink="0"
        position="relative"
        padding="0px 0px 0px 0px"
        backgroundImage="linear-gradient(-90deg, rgba(43,53,83,1), rgba(43,53,83,1), rgba(43,53,83,1), rgba(26,32,50,1))"
        {...getOverrideProps(overrides, "Sidebar")}
      ></Menu>
      <RightSideContent
        width="1174px"
        height="784px"
        shrink="0"
        position="relative"
        padding="0px 0px 0px 0px"
        {...getOverrideProps(overrides, "RightSideContent")}
      ></RightSideContent>
    </Flex>
  );
}
