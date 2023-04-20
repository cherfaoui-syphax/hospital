/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import React from "react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { Text, View } from "@aws-amplify/ui-react";
export default function ButtonNormal(props) {
  const { overrides, ...rest } = props;
  return (
    <View
      width="120px"
      height="48px"
      position="relative"
      padding="0px 0px 0px 0px"
      {...rest}
      {...getOverrideProps(overrides, "ButtonNormal")}
    >
      <View
        position="absolute"
        top="0%"
        bottom="0%"
        left="0%"
        right="0%"
        borderRadius="50px 50px 50px 50px"
        padding="0px 0px 0px 0px"
        backgroundColor="rgba(11,111,255,1)"
        {...getOverrideProps(overrides, "Rectangle 6")}
      ></View>
      <Text
        fontFamily="Open Sans"
        fontSize="19px"
        fontWeight="700"
        color="rgba(255,255,255,1)"
        lineHeight="22.265625px"
        textAlign="left"
        display="flex"
        direction="column"
        justifyContent="flex-start"
        position="absolute"
        top="22.92%"
        bottom="29.17%"
        left="21.18%"
        right="-9.08%"
        padding="0px 0px 0px 0px"
        whiteSpace="pre-wrap"
        children="Submit"
        {...getOverrideProps(overrides, "Submit")}
      ></Text>
    </View>
  );
}
