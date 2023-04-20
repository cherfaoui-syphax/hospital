import React, { useState } from "react";
import { Storage } from "aws-amplify";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MapTab from "../MapTab/MapTab";
import IncidentsListTab from "../IncidentsListTab/IncidentsListTab";
import { Paper } from "@mui/material";

function LiveMap({ openIncidentDialog }) {
  const [tabsValue, setTabsValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setTabsValue(newValue);
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <MapTab openIncidentDialog={openIncidentDialog} />
      </Box>
    </Box>
  );
}

export default LiveMap;
