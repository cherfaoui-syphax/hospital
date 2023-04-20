import * as d3 from "d3";
import React, { useEffect, useCallback, useRef, useState } from "react";
import Grid from "@mui/material/Grid";

const columnStyle={
    borderStyle: "solid",
    borderWidth: "0px 1px 0px 0px",
    borderColor: "#33333333",
    padding:20,
    paddingTop:10
}

const dummyData = {
    cases : {
        percentage : 20 , 
        nominal : 30 , 
        number : 20
    },
    contacts : {
        percentage : 20 , 
        nominal : -30 , 
        number : 15
    },
    contaminations : {
        percentage : 0 , 
        nominal : 0 , 
        number : 20
    }
}

const response = dummyData;

const PercentageChange = (props) =>{
    if(props.nominal > 0){
        return <h3 style={{color:"red"}}>↑ {props.percentage}% <span style={{color:"gray" , paddingLeft:10}}>{props.nominal} this week</span></h3>
    }
    if(props.nominal < 0){
        return <h3 style={{color:"green"}}>↓ {props.percentage}% <span style={{color:"gray" , paddingLeft:10}}>{props.nominal} this week</span></h3>
    }
    if(props.nominal == 0){
        return <h3>No change</h3>
    }
}

function Overview() {

  
    return (<>
        <Grid container className=" incident-box  rounded-sm with-margins padded box-shadow" style={{backgroundColor:"white"}} >
            <Grid itex xs={12} md={4} style={columnStyle}>
                <h2>Cases</h2>
                <h1>{response.cases.number}</h1>
                <PercentageChange percentage={response.cases.percentage} nominal={response.cases.nominal}></PercentageChange>
            </Grid>
            <Grid itex xs={12} md={4} style={columnStyle}  >
                <h2>Contacts</h2>
                <h1>{response.contacts.number}</h1>
                <PercentageChange percentage={response.contacts.percentage} nominal={response.contacts.nominal}></PercentageChange>
            </Grid>
            <Grid itex xs={12} md={4}  style={{padding:20, paddingTop:10}} >
                <h2>Contaminations</h2>
                <h1>{response.contaminations.number}</h1>
                <PercentageChange percentage={response.contaminations.percentage} nominal={response.contaminations.nominal}></PercentageChange>
            </Grid>

        </Grid>
    </>

    );
  }
  
  export default Overview;
  