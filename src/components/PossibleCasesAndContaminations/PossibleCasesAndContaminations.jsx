import React from "react";
import { Grid, Typography } from "@mui/material";

function Cases() {
  const [data, setData] = React.useState();

  const fetchData = async () => {
    const resp = await fetch(
      `${process.env.REACT_APP_API_URL}/active_incidents_possible_cases_contaminations?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImlhdCI6MTYwMDk3MzUxMywiZXhwIjoxNjAxNTc4MzEzfQ.OymFrLMMYgFAnYpveZPTgJVg6shCMhducqmZ21oYzY8&ward=2`
    );
    const { data } = await resp.json();
    setData(data);
  };

  React.useEffect(() => {
    if (!data) {
      fetchData();
    }
  });

  return (
    <>
      <div className="cases">
        <Typography
          sx={{ margin: "25px 0px", fontSize: "19px", fontWeight: 600 }}
          color="primary"
          variant="h5"
          component="h5"
        >
          Possible cases and contaminations
        </Typography>
        <div className="cases-content">
          <Grid container spacing={2}>
            {data?.map((cases, index) => (
              <Grid item xs={12} lg={6} xl={4}>
                <div className="case">
                  <div className="case-number">{cases.count}</div>
                  <div className={`case-label label ${cases.type}-exposure`}>
                    {cases.type} exposure
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </>
  );
}

export default Cases;
