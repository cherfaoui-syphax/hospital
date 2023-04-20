import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import PersonIcon from "@mui/icons-material/Person";
import PlaceIcon from '@mui/icons-material/Place';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const iconStyle = {
    marginBottom:"-6px", 
  };

export default function LastFiveCases() {
    const [data, setData] = React.useState();
    const fetchData = async () => {
      const resp = await fetch(
        `${process.env.REACT_APP_API_URL}/incidents?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImlhdCI6MTYwMDk3MzUxMywiZXhwIjoxNjAxNTc4MzEzfQ.OymFrLMMYgFAnYpveZPTgJVg6shCMhducqmZ21oYzY8&ward=2`
      );
      const { data } = await resp.json();
      setData(data);
    };
    React.useEffect(() => {
      if (!data) {
        fetchData();
      }
    });
    return <>
      {data?.slice(0,5).map((incident, index) => (
        <div className="incident-box" >
          <div
            className="incident-content rounded-sm with-margins padded box-shadow"
            style={{marginTop:0 , marginBottom : 0 , backgroundColor: "#fff" }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <div className="name blue">
                  {incident.index.name} <br/> ({incident.index.id})
                </div>
              </Grid>
              <Grid item xs={12} md={2}>
                <div className="role">{incident.role}</div>
              </Grid>
              <Grid item xs={12} md={2}>
                <div className="pathogen">{incident.pathogen}</div>
              </Grid>
              <Grid item xs={12} md={3}>
                <div className="exposures">
                {<PersonIcon style={{color:"black" , ...iconStyle}} > </PersonIcon>} {incident &&
                    incident.exposures.filter(
                      (exposure) => exposure.type === "person"
                    ).length}
                  <div style={{width:30,textAlign:"center",display:"inline-block"}}>|</div>
                  {<PlaceIcon style={{color:"black",...iconStyle}}></PlaceIcon>} {incident &&
                    (incident.exposures.filter(
                      (exposure) => exposure.type === "room"
                    ).length )}
                </div>
              </Grid>
              <Grid item xs={12} md={2}>
                <a className="name blue see-contacts" href={`/case/${incident.id}/detail`}>
                  <KeyboardArrowRightIcon style={iconStyle}></KeyboardArrowRightIcon>
                </a>
              </Grid>
            </Grid>
          </div>

        </div>
      ))}
    </>
}