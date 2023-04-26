import * as d3 from "d3";
import React, { useEffect, useCallback, useRef, useState } from "react";
import Grid from "@mui/material/Grid";

const columnStyle = {
  borderStyle: "solid",
  borderWidth: "0px 1px 0px 0px",
  borderColor: "#33333333",
  padding: 20,
  paddingTop: 10,
};

const dummyData = {
  cases: {
    percentage_change: 0,
    nominal_change: 0,
    number: 0,
  },
  contacts: {
    percentage_change: 0,
    nominal_change: 0,
    number: 0,
  },
  contaminations: {
    percentage_change: 0,
    nominal_change: 0,
    number: 0,
  },
};

const PercentageChange = (props) => {
  if (props.nominal > 0) {
    return (
      <h3 style={{ color: "red" }}>
        ↑ {props.percentage}%{" "}
        <span style={{ color: "gray", paddingLeft: 10 }}>
          {props.nominal} this week
        </span>
      </h3>
    );
  }
  if (props.nominal < 0) {
    return (
      <h3 style={{ color: "green" }}>
        ↓ {props.percentage}%{" "}
        <span style={{ color: "gray", paddingLeft: 10 }}>
          {props.nominal} this week
        </span>
      </h3>
    );
  }
  if (props.nominal == 0) {
    return <h3>No change</h3>;
  }
};

function Overview() {
  const [overview, setOverview] = useState();

  const fetchData = async () => {
    const resp = await fetch(
      `${process.env.REACT_APP_API_URL}/overview_evolution?token=aabbcc`
    );

    const { data } = await resp.json();

    if (data) {
      setOverview(data);
    }
  };
  React.useEffect(() => {
    if (!overview) {
      fetchData();
    }
  });

  return (
    <>
      <Grid
        container
        className=" incident-box  rounded-sm with-margins padded box-shadow"
        style={{ backgroundColor: "white" }}
      >
        {overview && (
          <>
            <Grid itex xs={12} md={4} style={columnStyle}>
              <h2>Cases</h2>
              <h1>{overview && overview.cases.number}</h1>
              <PercentageChange
                percentage={overview.cases.percentage_change}
                nominal={overview.cases.nominal_change}
              ></PercentageChange>
            </Grid>
            <Grid itex xs={12} md={4} style={columnStyle}>
              <h2>Contacts</h2>
              <h1>{overview && overview.contacts.number}</h1>
              <PercentageChange
                percentage={overview.contacts.percentage_change}
                nominal={overview.contacts.nominal_change}
              ></PercentageChange>
            </Grid>
            <Grid itex xs={12} md={4} style={{ padding: 20, paddingTop: 10 }}>
              <h2>Contaminations</h2>
              <h1>{overview && overview.contaminations.number}</h1>
              <PercentageChange
                percentage={overview.contaminations.percentage_change}
                nominal={overview.contaminations.nominal_change}
              ></PercentageChange>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
}

export default Overview;
