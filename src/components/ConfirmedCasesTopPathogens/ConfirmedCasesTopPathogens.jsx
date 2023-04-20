import React from "react";
import {
  Paper,
  Input,
  Grid,
  TextField,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import moment from "moment";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

function ConfirmedCasesTopPathogens() {
  const [data, setData] = React.useState();

  const fetchData = async () => {
    const resp = await fetch(
      `${process.env.REACT_APP_API_URL}/confirmed_cases_top_pathogens?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImlhdCI6MTYwMDk3MzUxMywiZXhwIjoxNjAxNTc4MzEzfQ.OymFrLMMYgFAnYpveZPTgJVg6shCMhducqmZ21oYzY8&ward=2&dateRange='[243423,432423]'`
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
      <div className="top-pathogens">
        <div className="title">
          <Typography
            sx={{ margin: "25px 0px", fontSize: "19px", fontWeight: 600 }}
            color="primary"
            variant="h5"
            component="h5"
          >
            {moment(new Date(data?.startDate)).format("MMM D")} -{" "}
            {moment(new Date(data?.endDate)).format("MMM D")}
          </Typography>
          <Select
            id="top-pathogens-date-range"
            sx={{ height: "30px" }}
            value={"Past 7 days"}
            onChange={() => {}}
          >
            <MenuItem value={"Past 24 hours"}>Past 24 hours</MenuItem>
            <MenuItem value={"Past 7 days"}>Past 7 days</MenuItem>
            <MenuItem value={"Past month"}>Past month</MenuItem>
          </Select>
        </div>
        <div className="top-pathogens-content">
          {data?.content?.map((row, index) => (
            <>
              <div className="row">
                <div className="row-metadata">
                  <span className="pathogen">{row.pathogen}</span>
                  <span className="percentage">{row.percentage}%</span>
                </div>
                <div className="row-percentage">
                  <LinearProgress
                    variant="determinate"
                    value={row.percentage}
                  />
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
}

export default ConfirmedCasesTopPathogens;
