import React, { useState } from "react";
import { Paper } from "@mui/material";
import { Switch, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import Dropdown from "./Dropdown";
import { wrapperStyle } from "./styles";

const Sidebar = ({
  isOpen,
  pathogenSelectionStates,
  setPathogenSelectionStates,
}) => {
  const [isPathogenOpen, setIsPathogenOpen] = useState(true);
  const [isCasesOpen, setIsCasesOpen] = useState(true);
  const [isExposureOpen, setIsExposureOpen] = useState(true);
  const [isEquipmentOpen, setIsEquipmentOpen] = useState(true);
  const [selectAllPathogensToggle, setSelectAllPathogensToggle] =
    useState(false);

  const handlePathogenSelect = (event, key) => {
    setPathogenSelectionStates({
      ...pathogenSelectionStates,
      [key]: event.target.checked,
    });
  };

  const handleSelectAllPathogensToggle = (event) => {
    const newSelectionStates = {};

    Object.keys(pathogenSelectionStates).forEach((pathogen) => {
      newSelectionStates[pathogen] = event.target.checked ? true : false;
    });

    setPathogenSelectionStates(newSelectionStates);
    setSelectAllPathogensToggle(event.target.checked);
  };

  return (
    <Paper
      elevation={0}
      style={{
        width: isOpen ? "25rem" : "0rem",
        overflow: "hidden",
        transition: "width 0.3s",
        padding: isOpen ? "45px 2rem" : "0",
        position: "relative",
      }}
    >
      <div className="search-field box-shadow rounded-sm">
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
      {/* <Dropdown
        title="Pathogen"
        isOpen={isPathogenOpen}
        setIsOpen={setIsPathogenOpen}
      > */}
      <div className="select-all-pathogens">
        <div class="subdued-text">Select all pathogens</div>
        <Switch
          onChange={(evt) => handleSelectAllPathogensToggle(evt)}
          checked={selectAllPathogensToggle}
        />
      </div>

      <FormGroup>
        {Object.keys(pathogenSelectionStates).map((pathogen) => (
          <FormControlLabel
            control={
              <Checkbox
                onChange={(evt) => handlePathogenSelect(evt, pathogen)}
                checked={pathogenSelectionStates[pathogen]}
              />
            }
            label={pathogen}
          />
        ))}
      </FormGroup>
      {/* </Dropdown> */}

      {/* <Dropdown title="Cases" isOpen={isCasesOpen} setIsOpen={setIsCasesOpen}>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Confirmed Case"
          />
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Unconfirmed case"
          />
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Unknown case"
          />
        </FormGroup>
      </Dropdown> */}

      {/* <Dropdown
        title="Exposure"
        isOpen={isExposureOpen}
        setIsOpen={setIsExposureOpen}
      >
        <h4>People</h4>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="High exposure"
          />
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Medium exposure"
          />
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Low exposure"
          />
        </FormGroup>

        <h4>Contamination</h4>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="High exposure"
          />
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Medium exposure"
          />
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Low exposure"
          />
        </FormGroup>
      </Dropdown> */}

      {/* <Dropdown
        title="Equipment"
        isOpen={isEquipmentOpen}
        setIsOpen={setIsEquipmentOpen}
      >
        <FormGroup>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Keys"
          />
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Ultrasound Trolley"
          />
        </FormGroup>
      </Dropdown> */}
    </Paper>
  );
};

export default Sidebar;
