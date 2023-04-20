import React, { useState } from "react";
import { Storage } from "aws-amplify";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Paper } from "@mui/material";
import { Person, SportsRugbySharp } from "@mui/icons-material";
import TreeView from "@mui/lab/TreeView";
import TreeItem, { TreeItemProps, treeItemClasses } from "@mui/lab/TreeItem";
import Label from "@mui/icons-material/Label";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import dummyMetadata from "../MapTab/dummy_metadata.json";
import { DataGrid } from "@mui/x-data-grid";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { nodeWrapper, nodeName } from "./styles";

function MapTab() {
  const [rows, setRows] = React.useState([]);
  const [isTransmissionModalOpen, setIsTransmissionModalOpen] = useState(false);
  const [rowsLoaded, setRowsLoaded] = React.useState(false);
  const theme = useTheme();
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

  const buttonStyle = {
    textTransform: "none",
    fontWeight: 500,
    fontSize: "14px",
  };

  const infoButtonStyle = {
    color: theme.palette.primary,
  };

  const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
    color: theme.palette.text.secondary,
    [`& .${treeItemClasses.content}`]: {
      color: theme.palette.text.secondary,
      borderTopRightRadius: theme.spacing(2),
      borderBottomRightRadius: theme.spacing(2),
      paddingRight: theme.spacing(1),
      fontWeight: theme.typography.fontWeightMedium,
      "&.Mui-expanded": {
        fontWeight: theme.typography.fontWeightRegular,
      },
      "&:hover": {
        backgroundColor: theme.palette.action.hover,
      },
      "&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
        backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
        color: "var(--tree-view-color)",
      },
      [`& .${treeItemClasses.label}`]: {
        fontWeight: "inherit",
        color: "inherit",
      },
    },
    [`& .${treeItemClasses.group}`]: {
      marginLeft: 0,
      [`& .${treeItemClasses.content}`]: {
        paddingLeft: theme.spacing(2),
      },
    },
  }));

  function StyledTreeItem(props) {
    const {
      bgColor,
      color,
      labelIcon: LabelIcon,
      labelInfo,
      labelText,
      ...other
    } = props;

    return (
      <StyledTreeItemRoot
        label={
          <Box sx={{ display: "flex", alignItems: "center", p: 0.5, pr: 0 }}>
            <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
            <Typography
              variant="body2"
              sx={{ fontWeight: "inherit", flexGrow: 1 }}
            >
              {labelText}
            </Typography>
            <Typography variant="caption" color="inherit">
              {labelInfo}
            </Typography>
          </Box>
        }
        style={{
          "--tree-view-color": color,
          "--tree-view-bg-color": bgColor,
        }}
        {...other}
      />
    );
  }

  StyledTreeItem.propTypes = {
    bgColor: PropTypes.string,
    color: PropTypes.string,
    labelIcon: PropTypes.elementType.isRequired,
    labelInfo: PropTypes.string,
    labelText: PropTypes.string.isRequired,
  };

  function convertDateFormat(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  const severityRefs = ["Low", "Medium", "High"];

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "disease", headerName: "Pathogen", flex: 1 },
    { field: "mitigation", headerName: "Mitigation", flex: 1 },
    {
      field: "severity",
      headerName: "Severity",
      flex: 1,
      sortingOrder: ["desc", "asc"],
      renderCell: (props) => {
        return <>{severityRefs[props.row.severity]}</>;
      },
    },
    { field: "date", headerName: "Date", flex: 1 },
  ];

  React.useEffect(() => {
    if (!rowsLoaded) {
      let rowEntries = [];
      Object.keys(dummyMetadata).map((entry, index) => {
        if (
          dummyMetadata[index].type === "infected" ||
          dummyMetadata[index].type === "room"
        ) {
          rowEntries.push({ id: String(index), ...dummyMetadata[index] });
        }
        return entry;
      });
      setRows(rowEntries);
      setRowsLoaded(true);
    }
  });

  const orgChart = {
    name: "Jane Smith",
    number: "(123 123 1234)",
    confirmed: "Confirmed Case",

    children: [
      {
        name: "Jane Smith",
        number: "(123 123 1234)",
        confirmed: "Confirmed Case",
      },
      {
        name: "Jane Smith",
        number: "(123 123 1234)",
        confirmed: "Confirmed Case",
      },
    ],
  };

  const renderForeignObjectNode = ({
    nodeDatum,
    toggleNode,
    foreignObjectProps,
  }) => (
    <g>
      {/* `foreignObject` requires width & height to be explicitly set. */}
      <foreignObject {...foreignObjectProps}>
        <div style={nodeWrapper}>
          <div style={nodeName}>
            {nodeDatum.name?.match(/\b(\w)/g).join("")}
          </div>
          <div>
            <div style={{ textDecoration: "underline" }}>{nodeDatum.name}</div>
            <div style={{ textDecoration: "underline" }}>
              {nodeDatum.number}
            </div>
            <div
              style={{
                backgroundColor: "#EE817E",
                padding: "0.5rem",
                color: "black",
                fontSize: "0.8rem",
                marginTop: "0.5rem",
              }}
            >
              {nodeDatum.confirmed}
            </div>
          </div>
        </div>
      </foreignObject>
    </g>
    // <g>
    //   <foreignObject {...foreignObjectProps}>
    //     <div
    //       style={{
    //         width: '1rem',
    //         height: '1rem',
    //         backgroundColor: 'black',
    //       }}
    //     ></div>
    //   </foreignObject>
    // </g>
  );

  const nodeSize = { x: 200, y: 200 };
  const foreignObjectProps = {
    width: nodeSize.x,
    height: nodeSize.y,
    x: -100,
    y: -50,
  };

  return (
    <div
      style={{
        position: "relative",
        marginTop: "130px",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <div
            className="search-field box-shadow rounded-sm"
            style={{ marginLeft: 10, marginBottom: 30 }}
          >
            <div className="search-icon-wrapper">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search for keywords"
              style={{
                outline: "none",
                height: "100%",
                width: "100%",
                border: "none",
              }}
            />
          </div>
        </Grid>
        <Grid item xs={12} md={2}>
          <div style={{ marginTop: 10, marginLeft: 20 }}>
            <Select
              sx={{ height: "30px" }}
              value={"All cases"}
              onChange={() => {}}
            >
              <MenuItem value={"All cases"}>All cases</MenuItem>
              <MenuItem value={"Past 24 hours"}>Past 24 hours</MenuItem>
              <MenuItem value={"Past 7 days"}>Past 7 days</MenuItem>
              <MenuItem value={"Past month"}>Past month</MenuItem>
            </Select>
          </div>
        </Grid>
      </Grid>
      <div className="subdued-text capitalized" style={{ marginLeft: "20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={2}>
            Date
          </Grid>
          <Grid item xs={12} md={2}>
            Name
          </Grid>
          <Grid item xs={12} md={2}>
            Role
          </Grid>
          <Grid item xs={12} md={2}>
            Pathogen
          </Grid>
          <Grid item xs={12} md={2}>
            Contacts | contaminations
          </Grid>
        </Grid>
      </div>
      {data?.map((incident, index) => (
        <div className="incident-box">
          {/* <div className="incident-title">
            <div className="incident-title-text">
              Incident ID: {incident.id}
            </div>
            <Button
              sx={{ ...infoButtonStyle, ...buttonStyle }}
              variant="contained"
              color="info"
              onClick={() => setIsTransmissionModalOpen(true)}
            >
              See transmission chain
            </Button>
            <Modal
              open={isTransmissionModalOpen}
              onClose={() => {
                setIsTransmissionModalOpen(false);
              }}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box style={modalStyle}>
                <Box style={modalHeaderBoxStyle}>
                  <span style={{ fontWeight: "bold" }}>
                    QE-BA-DAR1: Jane Smith (111 123 1234)
                  </span>
                  <button
                    onClick={() => {
                      setIsTransmissionModalOpen(false);
                    }}
                    style={modalCloseButtonStyle}
                  >
                    Close
                  </button>
                </Box>
                <Box style={modalContent}>
                  <Box style={modalLeftStyle}>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      C.difficile Tree
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                      Created Sun, 24 July 2022, 5:06p.m
                    </Typography>
                  </Box>
                  <Box style={modalRightStyle}>
                    <Tree
                      data={orgChart}
                      pathFunc={"step"}
                      depthFactor={300}
                      translate={{ x: 166, y: 223 }}
                      // orientation='vertical'
                      zoom={1}
                      renderCustomNodeElement={(rd3tProps) =>
                        renderForeignObjectNode({
                          ...rd3tProps,
                          foreignObjectProps,
                        })
                      }
                    />
                  </Box>
                </Box>

                <Box style={modalFooter}>
                  <button style={modalConsequences}>See consequences</button>
                </Box>
              </Box>
            </Modal>
          </div> */}

          <div
            className="incident-content rounded-sm with-margins padded box-shadow"
            style={{ backgroundColor: "#fff" }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={2}>
                <div className="date">{convertDateFormat(incident.date)}</div>
              </Grid>
              <Grid item xs={12} md={2}>
                <div className="name blue">
                  {incident.index.name} ({incident.index.id})
                </div>
              </Grid>
              <Grid item xs={12} md={2}>
                <div className="role">{incident.role}</div>
              </Grid>
              <Grid item xs={12} md={2}>
                <div className="pathogen">{incident.pathogen}</div>
              </Grid>
              <Grid item xs={12} md={2}>
                <div className="exposures">
                  {incident &&
                    incident.exposures.filter(
                      (exposure) => exposure.type === "person"
                    ).length}{" "}
                  |
                  {incident &&
                    incident.exposures.filter(
                      (exposure) => exposure.type === "room"
                    ).length}
                  {/* {incident.exposures.map((exposure, length) => (
                      <div className="exposure">
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={2}>
                            <div className="label high-exposure">
                              {exposure.level}
                            </div>
                          </Grid>
                          <Grid item xs={12} md={2}>
                            <div className="who">
                              <div className="icon">
                                {exposure.type === "person" ? (
                                  <PersonIcon />
                                ) : (
                                  <></>
                                )}
                                {exposure.type === "room" ? (
                                  <LocationOnIcon />
                                ) : (
                                  <></>
                                )}
                              </div>
                              <div className="name-box">
                                <div className="name blue">{exposure.name}</div>
                                <div className="exposure-id blue">
                                  {exposure.id ? `(${exposure.id})` : <></>}
                                </div>
                                <div className="exposure-heatmap-link blue">
                                  {exposure.type === "room" ? (
                                    `(See heatmap)`
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Grid>
                          <Grid item xs={12} md={8}>
                            <div className="mitigations">
                              {exposure &&
                                exposure.mitigations.map(
                                  (mitigation, index) => (
                                    <>
                                      <div className="mitigation">
                                        <Grid container spacing={2}>
                                          <Grid
                                            item
                                            xs={12}
                                            md={8}
                                            sx={{ display: "flex" }}
                                          >
                                            <FormControl
                                              sx={{ padding: "11px" }}
                                              fullWidth
                                            >
                                              <Select
                                                id={`mitigation-${index}`}
                                                value={mitigation}
                                                onChange={() => {}}
                                              >
                                                <MenuItem
                                                  value={`order-pathology-test`}
                                                >
                                                  Order pathology test
                                                </MenuItem>
                                                <MenuItem
                                                  value={"self-isolate"}
                                                >
                                                  Move to isolation room
                                                </MenuItem>
                                                <MenuItem
                                                  value={
                                                    "request-cleaning-service"
                                                  }
                                                >
                                                  Request cleaning service
                                                </MenuItem>
                                              </Select>
                                            </FormControl>
                                          </Grid>
                                          <Grid
                                            item
                                            xs={12}
                                            md={2}
                                            sx={{ display: "flex" }}
                                          >
                                            {index ===
                                            exposure.mitigations.length - 1 ? (
                                              <Button
                                                variant="text"
                                                sx={{ color: "#4198D0" }}
                                              >
                                                Add more
                                              </Button>
                                            ) : (
                                              <></>
                                            )}
                                          </Grid>
                                          <Grid
                                            item
                                            xs={12}
                                            md={2}
                                            sx={{ display: "flex" }}
                                          >
                                            <FormControl
                                              fullWidth
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                alignContent: "center",
                                                alignSelf: "center",
                                              }}
                                            >
                                              <Select
                                                id="mitigation-status-1"
                                                className="mitigation-status"
                                                value={"ongoing"}
                                                onChange={() => {}}
                                                sx={{
                                                  borderRadius: "30px",
                                                  color: "#4D6879",
                                                  fontWeight: 600,
                                                  fontSize: "14px",
                                                }}
                                              >
                                                <MenuItem value={"ongoing"}>
                                                  Ongoing
                                                </MenuItem>
                                                <MenuItem value={"resolved"}>
                                                  Resolved
                                                </MenuItem>
                                              </Select>
                                            </FormControl>
                                          </Grid>
                                        </Grid>
                                      </div>
                                    </>
                                  )
                                )}
                            </div>
                          </Grid>
                        </Grid>
                      </div>
                    ))} */}
                </div>
              </Grid>
              <Grid item xs={12} md={2}>
                <a className="name blue" href={`/case/${incident.id}/detail`}>
                  See contacts & contaminations
                </a>
              </Grid>
            </Grid>
          </div>
        </div>
      ))}

      {/* <div style={{ height: 900, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={100}
              rowsPerPageOptions={[5, 10, 30, 50, 75, 100]}
              checkboxSelection
              initialState={{
                sorting: {
                  sortModel: [{field: 'severity', sort: 'desc'}]
                }
              }}
            />
          </div> */}
    </div>
  );
}

export default MapTab;
