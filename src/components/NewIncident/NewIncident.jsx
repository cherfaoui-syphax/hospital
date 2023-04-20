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

function NewIncident() {
  const [fetchingMitigations, setFetchingMitigations] = useState(false);
  const [mitigationsAvailable, setMitigationsAvailable] = useState(false);
  const [natureOfMitigations, setNatureOfMitigations] = useState([
    { label: "", value: "" },
    { label: "Room has been cleaned", value: "cleaned" },
    { label: "Patient has been moved to isolation", value: "isolation" },
  ]);
  const [mitigationText, setMitigationText] = useState("");
  const [mitigationInput1, setMitigationInput1] = useState("");
  const [mitigationInput2, setMitigationInput2] = useState("");
  const [mitigationInput3, setMitigationInput3] = useState("");
  const [mitigationInput4, setMitigationInput4] = useState("");
  const [incidentText, setIncidentText] = useState("");
  const [incidentInput1, setIncidentInput1] = useState("");
  const [incidentInput2, setIncidentInput2] = useState("");
  const [incidentInput3, setIncidentInput3] = useState();
  const [incidentInput4, setIncidentInput4] = useState(new Date());
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

  const fetchPathogens = async () => {
    const resp = await fetch(`${process.env.REACT_APP_API_URL}//pathogens`);
    const { data } = await resp.json();
    setPathogens(data);
  };

  const submitIncident = (evt) => {
    evt.preventDefault();
    setFetchingMitigations(true);
    setTimeout(() => {
      setMitigationsAvailable(true);
      setFetchingMitigations(false);
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
      <Paper style={{ ...tabContentStyle, ...paddedPaper }}>
        <form
          onSubmit={(evt) => submitIncident(evt)}
          style={{ color: "#526878" }}
        >
          <Grid container>
            <Grid container>
              <Grid
                xs={2}
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div style={{ fontWeight: "bold", color: "#526878" }}>
                  Incident ID
                </div>
              </Grid>
              <Grid xs={10}>
                <div
                  style={{ margin: "10px 10px 20px 0px", fontWeight: "bold" }}
                >
                  QE-BA-DAR1
                </div>
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
                <div style={{ fontWeight: "bold" }}>Date</div>
              </Grid>
              <Grid xs={5}>
                <FormControl style={{ margin: "10px 10px 10px 0px" }} fullWidth>
                  <DateTimePicker
                    label="Date"
                    inputFormat="D MMM, YYYY hh:mm a"
                    value={incidentInput4}
                    onChange={setIncidentInput4}
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
                <div style={{ fontWeight: "bold" }}>Full Name</div>
              </Grid>
              <Grid xs={5}>
                <FormControl style={{ margin: "10px 10px 10px 0px" }} fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Select patient of staff
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
                <div style={{ fontWeight: "bold" }}>Pathogen</div>
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
                <div style={{ fontWeight: "bold" }}>Diagnosis</div>
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
                <div style={{ fontWeight: "bold" }}>Infection site</div>
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
                <div style={{ fontWeight: "bold" }}>Mitigation</div>
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
                <div style={{ fontWeight: "bold" }}>Details</div>
              </Grid>
              <Grid xs={10}>
                <FormControl style={{ margin: "10px 10px 10px 0px" }} fullWidth>
                  <TextField
                    id="mitigation-details"
                    label="Add notes here"
                    multiline
                    rows={4}
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

          {/* 
            <div style={{ color: '#000000', fontWeight: 'bold', fontSize: '16px' }}>Enter mitigation</div>
            <FormControl
                style={{ 'margin': '10px 10px 10px 0px' }}
                fullWidth>
                <InputLabel id="demo-simple-select-label">Input 1</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={mitigationInput1}
                    label="Placeholder"
                    onChange={(evt) => {
                        setMitigationInput1(evt.target.value);
                    } }
                >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select>
            </FormControl><FormControl
                style={{ 'margin': '10px 10px 10px 0px' }}
                fullWidth>            <InputLabel id="demo-simple-select-label">Input 2</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={mitigationInput2}
                    label="Placeholder"
                    onChange={(evt) => {
                        setMitigationInput2(evt.target.value);
                    } }
                >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select>
            </FormControl><FormControl
                style={{ 'margin': '10px 10px 10px 0px' }}
                fullWidth>            <InputLabel id="demo-simple-select-label">Input 3</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={mitigationInput3}
                    label="Placeholder"
                    onChange={(evt) => {
                        setMitigationInput3(evt.target.value);
                    } }
                >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select>
            </FormControl><FormControl
                style={{ 'margin': '10px 10px 10px 0px' }}
                fullWidth>            <InputLabel id="demo-simple-select-label">Input 4</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={mitigationInput4}
                    label="Placeholder"
                    onChange={(evt) => {
                        setMitigationInput4(evt.target.value);
                    } }
                >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select>
            </FormControl><FormControl
                style={{ 'margin': '10px 10px 10px 0px' }}
                fullWidth>
                <TextField
                    id="mitigation-details"
                    label="Details"
                    multiline
                    rows={4}
                    value={mitigationText}
                    onChange={onChangeMitigationText} />
            </FormControl> */}
        </form>
      </Paper>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "1rem 0",
        }}
      >
        <Button
          variant="outlined"
          style={{ marginRight: "1rem", padding: "0 1rem", fontWeight: "bold" }}
        >
          Cancel
        </Button>
        <FormControl>
          {!fetchingMitigations && (
            <Button
              type="submit"
              variant="contained"
              disabled
              style={{ fontWeight: "bold" }}
            >
              Show Consequences
            </Button>
          )}
          {fetchingMitigations && <CircularProgress />}
        </FormControl>
      </div>
    </>
  );
}

export default NewIncident;
