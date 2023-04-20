import React, { useState } from "react";
import { Sidebar } from "../../ui-components";
import HomeTemplate from "../../components/HomeTemplate/HomeTemplate";
import LiveMap from "../../components/LiveMap/LiveMap";
import IncidentsListTab from "../../components/IncidentsListTab/IncidentsListTab";
import { Paper, Input, Grid, TextField, Typography } from "@mui/material";
// import { Authenticator } from '@aws-amplify/ui-react';
import { Storage } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import InputBase from "@mui/material/InputBase";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Badge from "@mui/material/Badge";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import dummyMetadata from "../MapTab/dummy_metadata.json";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import NewIncident from "../NewIncident/NewIncident";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HelpIcon from "@mui/icons-material/Help";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import Avatar from "@mui/material/Avatar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CaseDetail from "../CaseDetail/CaseDetail";
import MapTab from "../MapTab/MapTab";

const drawerWidth = 240;

function MainContainer({ signOut }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [logoUrl, setLogoUrl] = useState();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeNavLink, setActiveNavLink] = useState("Home");
  const [alertsQty, setAlertsQty] = useState(12);
  const [mitigationsQty, setMitigationsQty] = useState(4);
  const [currentTab, setCurrentTab] = useState(
    location && location.pathname ? location.pathname : "/"
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mitigationText, setMitigationText] = useState("");
  const [mitigationInput1, setMitigationInput1] = useState("");
  const [mitigationInput2, setMitigationInput2] = useState("");
  const [mitigationInput3, setMitigationInput3] = useState("");
  const [mitigationInput4, setMitigationInput4] = useState("");
  const [incidentText, setIncidentText] = useState("");
  const [incidentInput1, setIncidentInput1] = useState("");
  const [incidentInput2, setIncidentInput2] = useState("");
  const [incidentInput3, setIncidentInput3] = useState(new Date());
  const [incidentInput4, setIncidentInput4] = useState("");
  const [wardsHovered, setWardsHovered] = useState(false);

  const theme = createTheme({
    palette: {
      primary: {
        main: "#1C54C1",
        contrastText: "#fff",
      },
      info: {
        main: "#fff",
        contrastText: "#666",
      },
    },
    components: {
      MuiToolbar: {
        styleOverrides: {
          dense: {
            height: 46,
            minHeight: 46,
          },
        },
      },
    },
    overrides: {
      MuiButton: {
        containedInfo: {
          color: "#4D6879",
        },
      },
    },
  });

  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    border: "1px solid #e1e1e1",
    borderRadius: "5px",
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "20ch",
      },
    },
  }));

  const tabStyles = {
    color: "#fff",
    display: "flex",
  };

  const buttonStyle = {
    textTransform: "none",
    fontWeight: 600,
    borderRadius: 30,
    padding: "5px 25px",
    color: "#1C54C1",
    fontSize: 13,
  };

  const plusIconStyle = {
    fontSize: 23,
    lineHeight: 1,
    fontWeight: 100,
    margin: "-4px 0px 0px 7px",
  };

  const infoButtonStyle = {
    color: theme.palette.primary,
  };

  const topNavIcon = {
    fontSize: "20px",
    color: "#fff",
    padding: "0px",
    minWidth: "39px",
    margin: "0px",
  };

  const lowerTabStyles = {
    display: "inline-block",
    fontWeight: 600,
    fontSize: "16px",
    textTransform: "none",
  };

  const tabContainerStyle = {
    display: "inline-block",
  };

  const topNavBarRight = {
    display: "flex",
    alignItems: "center",
  };

  const tabBoxStyle = {
    borderBottom: "none",
    borderColor: "divider",
    width: "100%",
    padding: "0px 0px 0px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const wardsMenuHidden = {
    display: "none",
  };

  const wardsMenuHovered = {
    display: "block",
    position: "absolute",
    top: "70px",
    boxShadow: "0px 1px 6px 1px rgba(0, 0, 0, 0.2)",
    color: "#666",
    padding: "20px",
    width: "165px",
    textTransform: "uppercase",
    fontSize: "13px",
    minHeight: "130px",
    backgroundColor: "#fff",
  };

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const openIncidentDialog = ({ name, disease, date }) => {
    navigate("/new-incident");

    // if (name) {
    //   setIncidentInput1(name);
    // }
    // if (disease) {
    //   setIncidentInput2(disease);
    // }
    // if (date) {
    //   setIncidentInput3(new Date(date));
    // }
    // setDialogOpen(true);
  };

  const sidebarStyles = {
    background:
      "linear-gradient(180deg, #2B3553 0%, #2B3553 29.69%, #2B3553 48.44%, #1A2032 100%)",
  };

  const sidebarTextStyles = {
    color: "#fff",
    lineHeight: "19px",
    fontSize: "14px",
  };

  const handleTabChange = (evt, tab) => {
    setCurrentTab(tab);

    navigate(tab);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getLogo = async () => {
    const logo = await Storage.get("logo_transparent.png", { level: "public" });

    setLogoUrl(logo);
  };

  const onChangeIncidentText = (evt) => {
    setIncidentText(evt.target.value);
  };

  const onChangeMitigationText = (evt) => {
    setMitigationText(evt.target.value);
  };

  React.useEffect(() => {
    if (location && location.pathname !== currentTab) {
      setCurrentTab(location.pathname);
    }

    if (!logoUrl) {
      getLogo();
    }
  });

  const drawer = (
    <div>
      <div class="logocontainer">
        {logoUrl ? (
          <a href="https://proxximos.com" style={{ border: 0, outline: 0 }}>
            <img src={logoUrl} style={{ height: "50px" }} alt="Proxximos" />
          </a>
        ) : (
          <></>
        )}
      </div>

      {/* <Toolbar /> */}
      <List>
        {[
          { text: "Home", link: "/" },
          { text: "Cases", link: "cases" },
          { text: "Live map", link: "map" },
          { text: "Alerts", link: "alerts" },
          { text: "Mitigations", link: "mitigations" },
          { text: "Users", link: "users" },
          { text: "Register device", link: "register-device" },
          { text: "Report an illness", link: "report-illness" },
          { text: "Sign out" },
        ].map((item, index) => (
          <ListItem key={item.text} disablePadding>
            {item.text === "Sign out" ? (
              <ListItemButton
                onClick={signOut}
                sx={[
                  activeNavLink === item.text
                    ? {
                        background: "rgba(0, 0, 0, 0.19)",
                      }
                    : {},
                  {
                    "&:hover": {
                      background: "rgba(193, 193, 194, 0.1)",
                    },
                  },
                ]}
              >
                {/* <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon> */}
                <ListItemText
                  primary={
                    <>
                      <span style={{ paddingRight: "20px" }}>
                        <strong>{item.text}</strong>
                      </span>
                      {item.text === "Alerts" && (
                        <Badge
                          badgeContent={<strong>{alertsQty}</strong>}
                          color="error"
                        />
                      )}
                      {item.text === "Mitigations" && (
                        <Badge
                          badgeContent={<strong>{mitigationsQty}</strong>}
                          color="error"
                        />
                      )}
                    </>
                  }
                  primaryTypographyProps={sidebarTextStyles}
                />
              </ListItemButton>
            ) : (
              <ListItemButton
                onClick={() => {
                  navigate(item.link);
                }}
                sx={[
                  activeNavLink === item.text
                    ? {
                        background: "rgba(0, 0, 0, 0.19)",
                      }
                    : {},
                  {
                    "&:hover": {
                      background: "rgba(193, 193, 194, 0.1)",
                    },
                  },
                ]}
              >
                {/* <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon> */}
                <ListItemText
                  primary={
                    <>
                      <span style={{ paddingRight: "20px" }}>{item.text}</span>
                      {item.text === "Alerts" && (
                        <Badge
                          badgeContent={<strong>{alertsQty}</strong>}
                          color="error"
                        />
                      )}
                      {item.text === "Mitigations" && (
                        <Badge
                          badgeContent={<strong>{mitigationsQty}</strong>}
                          color="error"
                        />
                      )}
                    </>
                  }
                  primaryTypographyProps={sidebarTextStyles}
                />
              </ListItemButton>
            )}
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{ display: "flex", position: "absolute", zIndex: 3, width: "100%" }}
      >
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            //width: { sm: `calc(100% - ${drawerWidth}px)` },
            // ml: { sm: `${drawerWidth}px` },
            // background: '#283555',
            background: "#1C54C1",
            color: "#fff",
            boxShadow: "none",
            zIndex: "1200",
          }}
        >
          <Toolbar>
            {/* <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' }, color: '#666666'}}
        >
          <MenuIcon />
        </IconButton> */}

            <div class="logocontainer">
              {logoUrl ? (
                <a
                  href="https://proxximos.com"
                  style={{ border: 0, outline: 0 }}
                >
                  <img
                    src={logoUrl}
                    style={{ height: "50px", width: "71px" }}
                    alt="Proxximos"
                  />
                </a>
              ) : (
                <></>
              )}
            </div>

            <Box sx={tabBoxStyle}>
              {/* The below tab only shows a dropdown, that's why the onChange method is empty */}
              <div
                style={{ display: "flex" }}
                onMouseEnter={(evt) => {
                  setWardsHovered(true);
                }}
                onMouseLeave={(evt) => {
                  setWardsHovered(false);
                }}
              >
                <Tabs
                  style={tabContainerStyle}
                  value={currentTab}
                  onChange={() => {}}
                  aria-label="Navbar"
                  indicatorColor="primary"
                  textColor="primary"
                >
                  {/* <Tab value="/wards" label="Wards" style={tabStyles} /> */}
                </Tabs>
                {/* <div style={wardsHovered ? wardsMenuHovered : wardsMenuHidden}>
                  <a href="#">Oncology Ward</a>
                </div> */}
              </div>
              <div style={topNavBarRight}>
                <Button
                  sx={{ ...infoButtonStyle, ...buttonStyle }}
                  variant="contained"
                  color="info"
                  onClick={openIncidentDialog}
                >
                  Add new case +
                </Button>
                {/* <Button sx={topNavIcon} variant="text" color="primary">
                <NotificationsIcon />
              </Button>
              <Button sx={topNavIcon} variant="text" color="primary">
                <HelpIcon />
              </Button> */}
                <Button
                  sx={{ minWidth: "60px", width: "50px" }}
                  variant="text"
                  color="primary"
                >
                  <Avatar>DM</Avatar>
                </Button>
              </div>
            </Box>
          </Toolbar>
        </AppBar>
        {/* <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, ...sidebarStyles },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        PaperProps={{
          sx: sidebarStyles
        }}
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box> */}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <AppBar
              position="fixed"
              sx={{
                //width: { sm: `calc(100% - ${drawerWidth}px)` },
                mt: { sm: `70px` },
                background: "#fff",
                color: "#666",
                boxShadow: "0px 1px 10px 0px rgb(0 0 0 / 15%)",
                borderBottom: "1px solid #e3e3e3",
              }}
            >
              <Toolbar variant="dense">
                <Box sx={tabBoxStyle}>
                  <Tabs
                    style={tabContainerStyle}
                    value={currentTab}
                    onChange={handleTabChange}
                    aria-label="Navbar"
                    indicatorColor="primary"
                    textColor="primary"
                  >
                    <Tab value="/" label="Home" style={lowerTabStyles} />
                    {/* <Tab 
                value="/new-incident"
                label="New Incident"
                style={lowerTabStyles}
              /> */}
                    <Tab value="/cases" label="Cases" style={lowerTabStyles} />
                    <Tab
                      value="/reports"
                      label="Reports"
                      style={lowerTabStyles}
                    />
                    <Tab value="/map" label="Map" style={lowerTabStyles} />
                  </Tabs>

                  {/* <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search> */}
                </Box>
              </Toolbar>
            </AppBar>
          </Grid>
          <Grid item xs={12}>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 0,
                /* width: { sm: `calc(100% - ${drawerWidth}px)` }*/
                // mt: "120px",
              }}
            >
              {/* <Toolbar /> */}

              {/* {location && location.pathname !== "/new-infections" && (
            <div style={{justifyContent: 'flex-end', display: 'flex', marginBottom: '40px'}}>
              <Button sx={{fontSize: '20px'}} variant="contained" color="error" onClick={openIncidentDialog}>
                +
              </Button>
            </div>
          )} */}

              <Routes>
                <Route path="/" element={<HomeTemplate />} />
                <Route path="cases" element={<IncidentsListTab />} />
                <Route
                  path="case/:incidentId/detail"
                  element={<CaseDetail />}
                />
                <Route
                  path="map"
                  element={<LiveMap openIncidentDialog={openIncidentDialog} />}
                />
                <Route path="new-incident" element={<NewIncident />} />
              </Routes>

              <Dialog
                open={dialogOpen}
                onClose={() => {
                  setDialogOpen(false);
                  setIncidentInput1("");
                  setIncidentInput2("");
                  setIncidentInput3("");
                  setIncidentInput4("");
                  setMitigationInput1("");
                  setMitigationInput2("");
                  setMitigationInput3("");
                  setMitigationInput4("");
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogContent dividers>
                  <div
                    style={{
                      color: "#000000",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    Enter incident
                  </div>
                  <FormControl
                    style={{ margin: "10px 10px 10px 0px" }}
                    fullWidth
                  >
                    <InputLabel id="demo-simple-select-label">Name</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={incidentInput1}
                      label="Placeholder"
                      onChange={(evt) => {
                        setIncidentInput1(evt.target.value);
                      }}
                    >
                      {Object.keys(dummyMetadata).map((marker, index) => (
                        <MenuItem value={dummyMetadata[index].name}>
                          {dummyMetadata[index].name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl
                    style={{ margin: "10px 10px 10px 0px" }}
                    fullWidth
                  >
                    <InputLabel id="demo-simple-select-label">
                      Disease
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={incidentInput2}
                      label="Placeholder"
                      onChange={(evt) => {
                        setIncidentInput2(evt.target.value);
                      }}
                    >
                      {Object.keys(dummyMetadata).map((marker, index) => (
                        <MenuItem value={dummyMetadata[index].disease}>
                          {dummyMetadata[index].disease}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl
                    style={{ margin: "10px 10px 10px 0px" }}
                    fullWidth
                  >
                    <MobileDatePicker
                      label="Date"
                      inputFormat="D MMM, YYYY"
                      value={incidentInput3}
                      onChange={setIncidentInput3}
                      renderInput={(params) => {
                        return (
                          <TextField
                            {...params}
                            InputLabelProps={{ shrink: true }}
                          />
                        );
                      }}
                    />
                  </FormControl>
                  <FormControl
                    style={{ margin: "10px 10px 10px 0px" }}
                    fullWidth
                  >
                    <InputLabel id="demo-simple-select-label">
                      Input 4
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={incidentInput4}
                      label="Placeholder"
                      onChange={(evt) => {
                        setIncidentInput4(evt.target.value);
                      }}
                    >
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl
                    style={{ margin: "10px 10px 10px 0px" }}
                    fullWidth
                  >
                    <TextField
                      id="mitigation-details"
                      label="Details"
                      multiline
                      rows={4}
                      value={incidentText}
                      onChange={onChangeIncidentText}
                    />
                  </FormControl>
                  <br />
                  <hr />
                  <br />
                  <DialogContentText id="alert-dialog-description">
                    <div
                      style={{
                        color: "#000000",
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                    >
                      Enter mitigation
                    </div>
                    <FormControl
                      style={{ margin: "10px 10px 10px 0px" }}
                      fullWidth
                    >
                      <InputLabel id="demo-simple-select-label">
                        Input 1
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={mitigationInput1}
                        label="Placeholder"
                        onChange={(evt) => {
                          setMitigationInput1(evt.target.value);
                        }}
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl
                      style={{ margin: "10px 10px 10px 0px" }}
                      fullWidth
                    >
                      {" "}
                      <InputLabel id="demo-simple-select-label">
                        Input 2
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={mitigationInput2}
                        label="Placeholder"
                        onChange={(evt) => {
                          setMitigationInput2(evt.target.value);
                        }}
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl
                      style={{ margin: "10px 10px 10px 0px" }}
                      fullWidth
                    >
                      {" "}
                      <InputLabel id="demo-simple-select-label">
                        Input 3
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={mitigationInput3}
                        label="Placeholder"
                        onChange={(evt) => {
                          setMitigationInput3(evt.target.value);
                        }}
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl
                      style={{ margin: "10px 10px 10px 0px" }}
                      fullWidth
                    >
                      {" "}
                      <InputLabel id="demo-simple-select-label">
                        Input 4
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={mitigationInput4}
                        label="Placeholder"
                        onChange={(evt) => {
                          setMitigationInput4(evt.target.value);
                        }}
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl
                      style={{ margin: "10px 10px 10px 0px" }}
                      fullWidth
                    >
                      <TextField
                        id="mitigation-details"
                        label="Details"
                        multiline
                        rows={4}
                        value={mitigationText}
                        onChange={onChangeMitigationText}
                      />
                    </FormControl>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => {
                      setDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setDialogOpen(false);
                    }}
                    autoFocus
                  >
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default withAuthenticator(MainContainer);
