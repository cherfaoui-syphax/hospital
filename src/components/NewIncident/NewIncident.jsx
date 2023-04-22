import React, { useState } from "react";
import CustomForm from "../CustomForm/CustomForm";
import {
  Paper,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
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
  const [incidentText, setIncidentText] = useState("");
  const [incidentInput1, setIncidentInput1] = useState("");
  const [incidentInput2, setIncidentInput2] = useState("");
  const [incidentInput3, setIncidentInput3] = useState();
  const [incidentInput4, setIncidentInput4] = React.useState(dayjs());
  const [pathogens, setPathogens] = useState();
  const [dummyRows, setDummyRows] = useState([
    {
      id: 0,
      description: "Possible C. difficile infection of John Smith",
      natureOfMitigation: "isolation",
      severity: "High",
      mitigationDate: null,
      notMitigated: true,
      details: "",
    },
    {
      id: 1,
      description: "Cleaning of surgical room 2",
      natureOfMitigation: "cleaned",
      severity: "Moderate",
      mitigationDate: null,
      notMitigated: true,
      details: "",
    },
    {
      id: 2,
      description: "Karen",
      natureOfMitigation: "",
      severity: "Low",
      mitigationDate: null,
      notMitigated: true,
      details: "",
    },
  ]);

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  const fetchPathogens = async () => {
    const resp = await fetch(`${process.env.REACT_APP_API_URL}/pathogens`);
    const { data } = await resp.json();
    setPathogens(data);
  };

  const submitIncident = (evt) => {
    evt.preventDefault();
    setSavingIncident(true);
    //addNewIncident();
    setTimeout(() => {
      setSavingIncident(false);
      navigate("/cases");
    }, 1000);
  };

  const getCellVal = (props, field) => {
    let returnVal = null;
    dummyRows.map((row) => {
      if (row.id === props.id) {
        returnVal = row[field];
      }

      return row;
    });
    return returnVal;
  };

  const changeCellVal = (props, newValue, field) => {
    let newRows = [];
    dummyRows.map((row, index) => {
      if (row.id === props.id) {
        let updatedRow = { ...row, [field]: newValue };
        if (field === "mitigationDate") {
          updatedRow.notMitigated = false;
        }
        if (field === "notMitigated" && newValue === true) {
          // this mens the event has not been mitigated
          updatedRow.mitigationDate = null;
        }
        if (field === "notMitigated" && newValue === false) {
          updatedRow.mitigationDate = new Date();
        }
        newRows.push(updatedRow);
      } else {
        newRows.push(row);
      }
      return row;
    });
    setDummyRows(newRows);
  };

  const columns = [
    { field: "description", headerName: "Description", width: 350 },
    {
      field: "natureOfMitigation",
      headerName: "Nature of Mitigation",
      width: 350,
      renderCell: (props) => {
        return (
          <>
            <Select
              style={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                margin: "12px 0px",
                height: "35px",
                width: "330px",
                borderWidth: "0px",
                outline: "0px",
              }}
              displayEmpty
              className="nature-of-mitigation-field"
              // labelId={`nature-of-mitigation-label-${props.id}`}
              id={`nature-of-mitigation-${props.id}`}
              value={getCellVal(props, "natureOfMitigation")}
              onChange={(evt) =>
                changeCellVal(props, evt.target.value, "natureOfMitigation")
              }
            >
              {natureOfMitigations.map((mitigationNature, index) => (
                <MenuItem value={mitigationNature.value}>
                  {mitigationNature.label}
                </MenuItem>
              ))}
            </Select>
          </>
        );
      },
    },
    { field: "severity", headerName: "Severity", width: 100 },
    {
      field: "mitigationDate",
      headerName: "Mitigation date",
      flex: 1,
      renderCell: (props) => {
        return (
          <>
            <DateTimePicker
              inputFormat="DD/MM/YYYY hh:mm a"
              value={getCellVal(props, "mitigationDate")}
              onChange={(newValue) =>
                changeCellVal(props, newValue, "mitigationDate")
              }
              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    class="date-field"
                    inputProps={{
                      ...params.inputProps,
                      placeholder: "Date",
                    }}
                    style={{
                      borderWidth: "0px",
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                );
              }}
            />
          </>
        );
      },
    },
    {
      field: "notMitigated",
      headerName: "Mitigation",
      flex: 1,
      renderCell: (props) => {
        return (
          <FormControlLabel
            label="Not mitigated"
            control={
              <Checkbox
                checked={getCellVal(props, "notMitigated")}
                onChange={(evt) =>
                  changeCellVal(props, evt.target.checked, "notMitigated")
                }
              />
            }
          />
        );
      },
    },
    {
      field: "details",
      headerName: "Details",
      flex: 1,
      renderCell: (props) => {
        return (
          <TextField
            fullWidth
            InputProps={{ style: { height: "30px" } }}
            value={getCellVal(props, "details")}
            onChange={(evt) =>
              changeCellVal(props, evt.target.value, "details")
            }
            placeholder="Additional details"
          />
        );
      },
    },
  ];

  const addNewIncident = async () => {
    await fetch(
      `${process.env.REACT_APP_API_URL}/newincident?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImlhdCI6MTYwMDk3MzUxMywiZXhwIjoxNjAxNTc4MzEzfQ.OymFrLMMYgFAnYpveZPTgJVg6shCMhducqmZ21oYzY8&ward=2`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Item: {
            incident_id: randomInt(100),
            id: `BE-FA-GHR${randomInt(100)}`,
            index: {
              name: incidentInput1,
              id: randomInt(1000000),
            },
            pathogen: "C. difficile",
            pathogenCategory: "Gastrointestinal infections",
            date: "Thu, 16 March 2023, 15:25:35",
            role: "Patient",
            notes: ["fsfdsfsd", "fdsfds"],
            exposures: [
              {
                level: "high",
                name: "Desmond Hall",
                id: 13,
                mitigations: ["order-pathology-test", "self-isolate"],
                date: "Thu, 16 March 2023, 15:25:35",
                duration: 120000,
                role: "Patient",
                distance: 0.4,
                type: "person",
              },
              {
                level: "high",
                name: "Ally Bisset",
                id: 11,
                mitigations: ["order-pathology-test", "self-isolate"],
                date: "Mon, 9 April 2023, 15:28:00",
                role: "Patient",
                distance: 0.2,
                duration: 180000,
                type: "person",
              },
              {
                level: "low",
                name: "Surgical Room 2",
                mitigations: ["request-cleaning-service"],
                date: "Mon, 9 April 2023, 15:29:00",
                duration: 180000,
                role: "Room",
                distance: 0.5,
                type: "room",
              },
            ],
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

  const onChangeIncidentText = (evt) => {
    setIncidentText(evt.target.value);
  };

  React.useEffect(() => {
    if (!pathogens) {
      fetchPathogens();
    }
  });

  return (
    <>
      <div
        id="new-incident-page"
        className="box-shadow box-shadow-white padded"
        style={{
          margin: "130px 40px 40px 40px",
          paddingTop: "clamp(100px,10vh,300px",
        }}
      >
        <form
          onSubmit={(evt) => submitIncident(evt)}
          style={{ color: "#526878" }}
        >
          <Grid container>
            <Grid container>
              {/* <Grid
                xs={2}
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  className="subdued-text capitalized"
                  style={{ color: "#526878" }}
                >
                  Incident ID
                </div>
              </Grid>
              <Grid xs={10}>
                <div
                  style={{ margin: "10px 10px 20px 0px", fontWeight: "bold" }}
                >
                  QE-BA-DAR1
                </div>
              </Grid> */}
            </Grid>

            <Grid container>
              <Grid
                xs={2}
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div className="subdued-text capitalized">Date</div>
              </Grid>
              <Grid xs={5}>
                <FormControl style={{ margin: "10px 10px 10px 0px" }} fullWidth>
                  <DateTimePicker
                    label="Date"
                    inputFormat="D MMM, YYYY hh:mm a"
                    value={incidentInput4}
                    onChange={(newValue) => setIncidentInput4(newValue)}
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
                <FormControl style={{ margin: "10px 10px 10px 0px" }} fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Select patient or staff
                  </InputLabel>
                  <Select
                    required
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
                <div className="subdued-text capitalized">Pathogen</div>
              </Grid>
              <Grid xs={5}>
                <FormControl style={{ margin: "10px 10px 10px 0px" }} fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Select pathogen
                  </InputLabel>
                  <Select
                    required
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={incidentInput2}
                    label="Placeholder"
                    onChange={(evt) => {
                      setIncidentInput2(evt.target.value);
                    }}
                  >
                    {pathogens ? (
                      pathogens.map((pathogen, index) =>
                        pathogen ? (
                          <MenuItem value={pathogen.pathogen_id}>
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
              <Grid
                xs={2}
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div className="subdued-text capitalized">Diagnosis</div>
              </Grid>
              <Grid xs={5}>
                <FormControl
                  style={{
                    margin: "10px 10px 10px 0px",
                    display: "flex",
                    flexDirection: "row",
                  }}
                  fullWidth
                >
                  <Paper
                    variant="outlined"
                    style={{ padding: "0 1rem", marginRight: "1rem" }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          icon={<RadioButtonUncheckedIcon />}
                          checkedIcon={<RadioButtonCheckedIcon />}
                        />
                      }
                      label="Confirmed"
                    />
                  </Paper>
                  <Paper
                    variant="outlined"
                    style={{ padding: "0 1rem", marginRight: "1rem" }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          icon={<RadioButtonUncheckedIcon />}
                          checkedIcon={<RadioButtonCheckedIcon />}
                        />
                      }
                      label="Unconfirmed"
                    />
                  </Paper>
                  <Paper
                    variant="outlined"
                    style={{ padding: "0 1rem", marginRight: "1rem" }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          icon={<RadioButtonUncheckedIcon />}
                          checkedIcon={<RadioButtonCheckedIcon />}
                        />
                      }
                      label="Unknown"
                    />
                  </Paper>
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
                <div className="subdued-text capitalized">Infection site</div>
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
                    value={incidentInput3}
                    label="Placeholder"
                    onChange={(evt) => {
                      setIncidentInput3(evt.target.value);
                    }}
                  >
                    <MenuItem value={1}>Example 1</MenuItem>
                    <MenuItem value={2}>Example 2</MenuItem>
                    <MenuItem value={3}>Example 3</MenuItem>
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
                <div className="subdued-text capitalized">Mitigation</div>
              </Grid>
              <Grid xs={5}>
                <FormControl style={{ margin: "10px 10px 10px 0px" }} fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Select mitigation
                  </InputLabel>
                  <Select
                    required
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={incidentInput3}
                    label="Placeholder"
                    onChange={(evt) => {
                      setIncidentInput3(evt.target.value);
                    }}
                  >
                    <MenuItem value={1}>Example 1</MenuItem>
                    <MenuItem value={2}>Example 2</MenuItem>
                    <MenuItem value={3}>Example 3</MenuItem>
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
                <div className="subdued-text capitalized">Details</div>
              </Grid>
              <Grid xs={5}>
                <FormControl style={{ margin: "10px 10px 10px 0px" }} fullWidth>
                  <TextField
                    id="mitigation-details"
                    label="Add notes here"
                    multiline
                    rows={6}
                    value={incidentText}
                    onChange={onChangeIncidentText}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          {mitigationsAvailable && (
            <div
              style={{
                height: `${50 * dummyRows.length + 120}px`,
                width: "100%",
                marginTop: "50px",
              }}
            >
              <DataGrid
                rows={dummyRows}
                columns={columns}
                pageSize={100}
                rowsPerPageOptions={[5, 10, 30, 50, 75, 100]}
                checkboxSelection
              />
            </div>
          )}

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
    </>
  );
}

export default NewIncident;
