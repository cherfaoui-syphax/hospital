import React, { useState } from "react";
import CustomForm from "../CustomForm/CustomForm";
import {
  Paper,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  RadioGroup,
  Radio,
  MenuItem,
  Button,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import dummyMetadata from "../MapTab/dummy_metadata.json";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import IncidentsListTab from "../IncidentsListTab/IncidentsListTab";
import { DataGrid } from "@mui/x-data-grid";
import { tabContentStyle, paddedPaper } from "../styles/styles";
import { useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { randomInt } from "d3";

function NewIncident() {
  const navigate = useNavigate();
  const [savingIncident, setSavingIncident] = useState(false);
  const [mitigationsAvailable, setMitigationsAvailable] = useState(false);
  const [natureOfMitigations, setNatureOfMitigations] = useState([
    { label: "", value: "" },
    { label: "Room has been cleaned", value: "cleaned" },
    { label: "Patient has been moved to isolation", value: "isolation" },
  ]);
  const [date, setDate] = React.useState(dayjs());
  const [fullName, setFullName] = useState("");
  const [inputRole, setInputRole] = useState("");
  const [inputPathogenCategory, setInputPathogenCategory] = useState();
  const [inputPathogen, setInputPathogen] = useState();
  const [status, setStatus] = React.useState();
  const [details, setDetails] = useState("");
  const [pathogens, setPathogens] = useState();
  const [pathogenCategories, setPathogenCategories] = useState();
  const [roles, setRoles] = useState();

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  const fetchPathogens = async () => {
    const resp = await fetch(`${process.env.REACT_APP_API_URL}/pathogens`);
    const { data } = await resp.json();
    setPathogens(data);
  };

  const fetchCategories = async () => {
    const data = [
      { id: 0, name: "Bloodstream" },
      { id: 1, name: "Gastrointestinal" },
      { id: 2, name: "Respiratory" },
      { id: 3, name: "Surgical Site" },
      { id: 4, name: "UTI" },
    ];
    setPathogenCategories(data);
  };
  const fetchRoles = async () => {
    const data = [
      { role_id: 1, role_name: "Surgeon" },
      { role_id: 2, role_name: "Nurse" },
      { role_id: 3, role_name: "Janitor" },
    ];
    setRoles(data);
  };

  const submitIncident = (evt) => {
    evt.preventDefault();
    setSavingIncident(true);
    addNewIncident();
    // setTimeout(() => {
    //   setSavingIncident(false);
    //   navigate("/cases");
    // }, 1000);
  };

  const addNewIncident = async () => {
    const rand_id = getRandomInt(100);
    let beaconId;
    Object.keys(dummyMetadata).forEach((key) => {
      if (dummyMetadata[key].name === fullName) {
        beaconId = key;
      }
    });
    await fetch(
      `${process.env.REACT_APP_API_URL}/newincident?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImlhdCI6MTYwMDk3MzUxMywiZXhwIjoxNjAxNTc4MzEzfQ.OymFrLMMYgFAnYpveZPTgJVg6shCMhducqmZ21oYzY8&ward=2`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Item: {
            incident_id: rand_id,
            id: beaconId,
            index: {
              name: fullName,
              id: beaconId,
            },
            pathogen: inputPathogen,
            pathogenCategory: inputPathogenCategory,
            date,
            role: inputRole,
            notes: [details],
          },
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setSavingIncident(false);
        navigate("/cases");
      })
      .catch((error) => console.error(error));
  };

  React.useEffect(() => {
    if (!pathogens) {
      fetchPathogens();
    }
    if (!pathogenCategories) {
      fetchCategories();
    }
    if (!roles) {
      fetchRoles();
    }
  });

  return (
    <div id="new-incident-page">
      {" "}
      <div
        className="box-shadow box-shadow-white padded"
        style={{
          margin: "130px 40px 40px 40px",
        }}
      >
        <form
          onSubmit={(evt) => submitIncident(evt)}
          style={{ color: "#526878" }}
        >
          <Grid container>
            <Grid
              xs={2}
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div className="subdued-text capitalized">Date and Time of Symptom Onset</div>
            </Grid>
            <Grid xs={5}>
              <FormControl style={{ margin: "10px 10px 10px 0px" }} fullWidth>
                <DateTimePicker
                  label="Date and Time of Symptom Onset"
                  inputFormat="D MMM, YYYY hh:mm a"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
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
            </Grid>
          </Grid>

          <Grid container>
            <Grid
              xs={2}
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div className="subdued-text capitalized">Full Name</div>
            </Grid>
            <Grid xs={5}>
              <FormControl style={{ margin: "10px 10px 10px 0px" }}  fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Select patient or staff
                </InputLabel>
                <Select
                  required
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={fullName}
                  label="Placeholder"
                  MenuProps={{ PaperProps: { sx: { maxHeight: "50%" } } }}
                  onChange={(evt) => {
                    setFullName(evt.target.value);
                  }}
                >
                  {Object.keys(dummyMetadata).map((marker, index) => (
                    <MenuItem value={dummyMetadata[index].name}>
                      {dummyMetadata[index].name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container>
            <Grid
              xs={2}
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div className="subdued-text capitalized">Role</div>
            </Grid>
            <Grid xs={5}>
              <FormControl style={{ margin: "10px 10px 10px 0px" }} fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Select occupied role{" "}
                </InputLabel>
                <Select
                  required
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={inputRole}
                  label="Placeholder"
                  onChange={(evt) => {
                    setInputRole(evt.target.value);
                  }}
                >
                  {roles ? (
                    roles.map((role, index) =>
                      role ? (
                        <MenuItem value={role.role_name}>
                          {role.role_name}
                        </MenuItem>
                      ) : (
                        <></>
                      )
                    )
                  ) : (
                    <></>
                  )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container>
            {" "}
            <Grid
              xs={2}
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div className="subdued-text capitalized">Infection site</div>{" "}
            </Grid>
            <Grid xs={5}>
              <FormControl style={{ margin: "10px 10px 10px 0px" }} fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Select infection site
                </InputLabel>
                <Select
                  required
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={inputPathogenCategory}
                  label="Placeholder"
                  onChange={(evt) => {
                    setInputPathogenCategory(evt.target.value);
                  }}
                >
                  {pathogenCategories ? (
                    pathogenCategories.map((pathogenCat, index) =>
                      pathogenCat ? (
                        <MenuItem value={pathogenCat.name}>
                          {pathogenCat.name}
                        </MenuItem>
                      ) : (
                        <></>
                      )
                    )
                  ) : (
                    <></>
                  )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container>
            <Grid
              xs={2}
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div className="subdued-text capitalized">Pathogen</div>{" "}
            </Grid>
            <Grid xs={5}>
              <FormControl style={{ margin: "10px 10px 10px 0px" }} fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Select pathogen{" "}
                </InputLabel>
                <Select
                  required
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={inputPathogen}
                  label="Placeholder"
                  onChange={(evt) => {
                    setInputPathogen(evt.target.value);
                  }}
                >
                  {pathogens ? (
                    pathogens.map((pathogen, index) =>
                      pathogen ? (
                        <MenuItem value={pathogen.pathogen_name}>
                          {pathogen.pathogen_name}
                        </MenuItem>
                      ) : (
                        <></>
                      )
                    )
                  ) : (
                    <></>
                  )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container space>
            {" "}
            <Grid
              xs={2}
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div className="subdued-text capitalized">Status</div>{" "}
            </Grid>
            <Grid xs={5}>
              <FormControl
                style={{
                  margin: "10px 10px 10px 0px",
                }}
              >
                <RadioGroup
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  row
                >
                  <Paper
                    variant="outlined"
                    style={{ padding: "0 1rem", marginRight: "1rem" }}
                  >
                    <FormControlLabel
                      value={"Confirmed"}
                      control={<Radio />}
                      label="Confirmed"
                    />
                  </Paper>
                  <Paper
                    variant="outlined"
                    style={{ padding: "0 1rem", marginRight: "1rem" }}
                  >
                    <FormControlLabel
                      value={"Unconfirmed"}
                      control={<Radio />}
                      label="Unconfirmed"
                    />
                  </Paper>
                  <Paper
                    variant="outlined"
                    style={{ padding: "0 1rem", marginRight: "1rem" }}
                  >
                    <FormControlLabel
                      value={"Unknown"}
                      control={<Radio />}
                      label="Unknown"
                    />
                  </Paper>
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container>
            <Grid
              xs={2}
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div className="subdued-text capitalized">Details</div>
            </Grid>
            <Grid xs={5}>
              <FormControl style={{ margin: "10px 10px 10px 0px" }} fullWidth>
                <TextField
                  id="mitigation-details"
                  label="Add notes here"
                  multiline
                  rows={6}
                  value={details}
                  onChange={(event) => {
                    setDetails(event.target.value);
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              margin: "1rem 0",
            }}
          >
            <FormControl>
              {savingIncident ? (
                <CircularProgress />
              ) : (
                <Button
                  type="submit"
                  variant="outlined"
                  style={{ fontWeight: "bold" }}
                  onClick={submitIncident}
                >
                  Save
                </Button>
              )}
            </FormControl>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewIncident;
