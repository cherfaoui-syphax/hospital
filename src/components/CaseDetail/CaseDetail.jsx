import React from "react";
import { useParams } from "react-router";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import Replay5Icon from "@mui/icons-material/Replay5";
import Forward5Icon from "@mui/icons-material/Forward5";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import BugIcon from "../BugIcon/BugIcon";
import KeyIcon from "../KeyIcon/KeyIcon";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import SignalTowerIcon from "../SignalTowerIcon/SignalTowerIcon";
import RoomCleaningIcon from "../RoomCleaningIcon/RoomCleaningIcon";
import PersonIcon from "../PersonIcon/PersonIcon";
import DeadBatteryIcon from "../DeadBatteryIcon/DeadBatteryIcon.tsx";
import Typography from "@mui/material/Typography";
import TreeItem, { treeItemClasses } from "@mui/lab/TreeItem";
import dummyMetadata from "../MapTab/dummy_metadata.json";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import FloorplanSvg from "../FloorplanSvg/FloorplanSvg";
import CloseIcon from "@mui/icons-material/Close";
import { color } from "../MapTab/diseaseColor";
import moment from "moment";

function CaseDetail(props) {
  const [rows, setRows] = React.useState([]);
  const [replaying, setReplaying] = React.useState(false);
  const [markers, setMarkers] = React.useState();
  const [openTooltip, setOpenTooltip] = React.useState(false);
  const svgRef = React.useRef();
  const [rowsLoaded, setRowsLoaded] = React.useState(false);
  const [data, setData] = React.useState();
  const [watchEventOpen, setWatchEventOpen] = React.useState(false);
  const [replayData, setReplayData] = React.useState();
  const [currentExposure, setCurrentExposure] = React.useState();
  const replayDataIteration = React.useRef(0);
  const durationTimer = React.useRef();
  const [eventAnimationDuration, setEventAnimationDuration] = React.useState();
  const currentAnimationProgress = React.useRef();
  const timerRef = React.useRef();
  const replayStartTime = React.useRef(null);
  const actualStartTime = React.useRef();
  const actualEndTime = React.useRef();
  const { incidentId } = useParams();
  const [seekTime, setSeekTime] = React.useState(0);
  const [timeMarkers, setTimeMarkers] = React.useState([]);
  const [shouldKeepRefreshingData, setShouldKeepRefreshingData] =
    React.useState(true);

  const VIDEO_TIME_UNIT = 1;
  const TIME_PADDING_BEGINNING = 30;
  const TIME_PADDING_END = 30;

  const goToTimeMarker = (timeMarker) => {
    setSeekTime(timeMarker);
  };

  const handleWatchEventOpen = (exposure) => {
    const duration =
      exposure.duration / 60000 > 1
        ? `${exposure.duration / 60000} minutes`
        : `${exposure.duration / 60000} minute`;

    setCurrentExposure({
      duration,
      ...exposure,
    });
    setWatchEventOpen(true);

    durationTimer.current = setTimeout(() => {
      setShouldKeepRefreshingData(false);
    }, exposure.duration);
  };

  const handleWatchEventClose = () => {
    setCurrentExposure(null);
    setWatchEventOpen(false);
    setReplayData(null);
    replayDataIteration.current = 0;
    replayStartTime.current = undefined;
  };

  const HtmlTooltip = styled(({ className, id, ...props }) => {
    return (
      <Tooltip
        {...props}
        open={openTooltip === id}
        classes={{ popper: className }}
        TransitionProps={{ timeout: 0 }}
      />
    );
  })(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#f5f5f9",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: "1px solid #dadde9",
    },
  }));

  const handleOpenTooltip = (id) => {
    if (openTooltip !== id) {
      setOpenTooltip(id);
    }
  };

  const fetchData = async () => {
    const resp = await fetch(
      `${process.env.REACT_APP_API_URL}/incident_detail/${incidentId}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImlhdCI6MTYwMDk3MzUxMywiZXhwIjoxNjAxNTc4MzEzfQ.OymFrLMMYgFAnYpveZPTgJVg6shCMhducqmZ21oYzY8&ward=2`
    );
    const { data } = await resp.json();
    setData(data);
  };

  React.useEffect(() => {
    if (!data) {
      fetchData();
    }
  });

  const initializeReplayData = async () => {
    const currentDate = new Date(currentExposure.date);

    const minDate = moment(currentDate)
      .subtract(TIME_PADDING_END, "seconds")
      .format();
    const maxDate = moment(currentDate)
      .add(currentExposure.duration / 1000 + TIME_PADDING_END, "seconds")
      .format();

    const resp = await fetch(
      `https://rtls.proxximos.com/beacon_history?min=${minDate}&max=${maxDate}`
    );

    const jsonData = await resp.json();

    const animationDuration =
      TIME_PADDING_BEGINNING + currentExposure.duration + TIME_PADDING_END;

    setReplayData(jsonData);
    setEventAnimationDuration(animationDuration);
    setTimeMarkers([
      (((TIME_PADDING_BEGINNING - VIDEO_TIME_UNIT) * 1000) /
        animationDuration) *
        100,
      (((TIME_PADDING_BEGINNING + VIDEO_TIME_UNIT) * 1000) /
        animationDuration) *
        100,
    ]);

    console.log(
      (((TIME_PADDING_BEGINNING - VIDEO_TIME_UNIT) * 1000) /
        animationDuration) *
        100
    );

    Object.keys(jsonData).forEach((key) => {
      let frame = 0;

      for (frame; frame <= jsonData[key][frame].length; frame++) {
        const frameDateTime = new Date(jsonData[key][frame].date).getTime();

        if (
          frameDateTime < actualStartTime.current ||
          actualStartTime.current === undefined
        ) {
          actualStartTime.current = frameDateTime;
        }

        if (
          frameDateTime > actualEndTime.current ||
          actualEndTime.current === undefined
        ) {
          actualEndTime.current = frameDateTime;
        }
      }
    });

    console.log(actualStartTime.current);
    console.log(actualEndTime.current);
  };

  const fetchReplayData = async () => {
    console.log("????");
    const timeElapsed = new Date().getTime() - replayStartTime.current;

    replayDataIteration.current++;
    currentAnimationProgress.current =
      (timeElapsed / eventAnimationDuration) * 100;

    setSeekTime(seekTime + 1000 * VIDEO_TIME_UNIT);
  };

  const mapIcon = (index, frameStep, item) => {
    const correspondingEvent = data.exposures.filter(
      (exposure) => exposure.id === item.id
    )[0];
    const itemDate = new Date(item.date);
    const itemTimestamp = itemDate.getTime();
    if (!correspondingEvent) {
      return <></>;
    }

    const contaminationDateObject = new Date(correspondingEvent.date);
    const contaminationTimestamp = contaminationDateObject.getTime();

    const infectionOccurred = itemTimestamp >= contaminationTimestamp;

    if (infectionOccurred) {
      return (
        <>
          <BugIcon
            setOpenTooltip={(id) => handleOpenTooltip(id)}
            id={`bug-${index}`}
            key={`bug-${index}`}
            posX={replayData[index][frameStep].x}
            posY={replayData[index][frameStep].y}
            fill={color[dummyMetadata[index].disease]}
            style={{
              width: "110px",
              height: "110px",
            }}
          />
        </>
      );
    }
    if (!infectionOccurred) {
      return (
        <PersonIcon
          setOpenTooltip={(id) => handleOpenTooltip(id)}
          id={`bug-${index}`}
          key={`bug-${index}`}
          posX={replayData[index][frameStep].x}
          posY={replayData[index][frameStep].y}
          style={{ color: "#1876D1", width: "110px", height: "110px" }}
        />
      );
    }

    if (dummyMetadata[index].type === "hub") {
      return (
        <SignalTowerIcon
          id={`bug-${index}`}
          key={`bug-${index}`}
          posX={replayData[index][frameStep].x}
          posY={replayData[index][frameStep].y}
          style={{ color: "green", width: "110px", height: "110px" }}
        />
      );
    }

    if (dummyMetadata[index].type === "key") {
      return (
        <KeyIcon
          id={`key-${index}`}
          key={`key-${index}`}
          posX={replayData[index][frameStep].x}
          posY={replayData[index][frameStep].y}
          style={{ width: "110px", height: "110px" }}
        />
      );
    }
    if (dummyMetadata[index].type === "room") {
      return (
        <RoomCleaningIcon
          id={`room-${index}`}
          key={`room-${index}`}
          posX={replayData[index][frameStep].x}
          posY={replayData[index][frameStep].y}
          style={{ color: "red", width: "110px", height: "110px" }}
        />
      );
    }
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

  const handlePause = () => {
    setReplaying(false);
    clearTimeout(timerRef.current);
  };

  const handlePlay = () => {
    setReplaying(true);
    setShouldKeepRefreshingData(true);

    if (replayStartTime.current === null) {
      replayStartTime.current = new Date().getTime();
    }
  };

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

    if (!replayData) {
      initializeReplayData();
    }
  });

  React.useEffect(() => {
    console.log(replayData && shouldKeepRefreshingData && replaying);
    if (replayData && shouldKeepRefreshingData && replaying) {
      timerRef.current = setTimeout(fetchReplayData, 1000 * VIDEO_TIME_UNIT);
    }
  }, [replayData, replaying, shouldKeepRefreshingData, seekTime]);

  return (
    <>
      {data && (
        <>
          <div
            className="box-shadow"
            style={{
              marginTop: "100px",
              padding: "15px 30px",
              backgroundColor: "#fff",
            }}
          >
            <a href="/cases">
              <Button variant="outlined">Back to Cases</Button>
            </a>{" "}
            <strong style={{ marginLeft: 20 }}>
              {data.index.name} ({data.index.id}): Contacts & Contaminations
            </strong>
          </div>
          <div
            style={{
              position: "relative",
              padding: "0px 30px",
            }}
          >
            <h2>Index Case</h2>
            <div
              className="subdued-text capitalized"
              style={{ marginLeft: "20px" }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={2}>
                  Date Created
                </Grid>
                <Grid item xs={12} md={2}>
                  Full name
                </Grid>
                <Grid item xs={12} md={2}>
                  Pathogen
                </Grid>
                <Grid item xs={12} md={2}>
                  Infection site
                </Grid>
              </Grid>
            </div>
            <div className="incident-box">
              <div
                className="incident-content rounded-sm padded with-margins box-shadow"
                style={{ backgroundColor: "#fff" }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={2}>
                    <div className="date">{data.date}</div>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <div className="name blue">
                      {data.index.name} ({data.index.id})
                    </div>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <div className="role">{data.pathogen}</div>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <div className="pathogen">{data.pathogenCategory}</div>
                  </Grid>
                </Grid>
              </div>
            </div>
            <h2>Contacts & Contaminations</h2>
            <div
              className="subdued-text capitalized"
              style={{ marginLeft: "20px" }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={2}>
                  Full name
                </Grid>
                <Grid item xs={12} md={2}>
                  Role
                </Grid>
                <Grid item xs={12} md={2}>
                  Time of occurrence
                </Grid>
                <Grid item xs={12} md={2}>
                  Duration
                </Grid>
                <Grid item xs={12} md={2}>
                  Distance
                </Grid>
              </Grid>
            </div>
            {data &&
              data.exposures.map((exposure, index) => {
                const duration =
                  exposure.duration / 60000 > 1
                    ? `${exposure.duration / 60000} minutes`
                    : `${exposure.duration / 60000} minute`;
                return (
                  <div className="incident-box">
                    <div
                      className="incident-content rounded-sm padded with-margins box-shadow"
                      style={{ backgroundColor: "#fff" }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={2}>
                          <div className="name blue">
                            {exposure.name}{" "}
                            {exposure.type === "room" ? "" : `(${exposure.id})`}
                          </div>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <div className="name blue">{exposure.role}</div>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <div className="occurrence-time">{exposure.date}</div>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <div className="pathogen">{duration}</div>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <div className="distance">{exposure.distance}</div>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <Button
                            onClick={() => handleWatchEventOpen(exposure)}
                          >
                            Watch event
                          </Button>
                        </Grid>
                      </Grid>
                    </div>
                  </div>
                );
              })}
          </div>

          <Modal
            open={watchEventOpen}
            onClose={handleWatchEventClose}
            aria-labelledby="Watch Event"
            aria-describedby="Watch step-by-step replay of contamination event"
          >
            {currentExposure && (
              <>
                <div className="modal-content watch-event-modal">
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <div
                        className="box-shadow box-shadow-light border-light"
                        style={{ lineHeight: 0, padding: "12px 31px" }}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={9}>
                            <h2
                              style={{
                                position: "absolute",
                                left: 0,
                                right: 0,
                              }}
                              className="centered"
                            >
                              <strong>
                                Watch encounter between {data.index.name} and{" "}
                                {currentExposure.name}
                              </strong>
                            </h2>
                          </Grid>
                          <Grid item xs={3}>
                            <div className="pull-right">
                              <Button
                                onClick={handleWatchEventClose}
                                className="box-shadow close-button rounded-lg"
                              >
                                Close{" "}
                                <span className="close-icon">
                                  <CloseIcon />
                                </span>
                              </Button>
                            </div>
                          </Grid>
                        </Grid>
                      </div>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <div className="watch-event-map-container">
                        <FloorplanSvg
                          id={"floorplan"}
                          markers={markers}
                          reference={svgRef}
                          style={{ width: "2282px", height: "1518px" }}
                        />
                        {replayData &&
                          Object.keys(replayData).map((index) => (
                            <>
                              {Object.keys(replayData[index]).map(
                                (frameStep) => (
                                  <>
                                    {frameStep <= replayDataIteration.current &&
                                    replayData[index][frameStep] ? (
                                      <div
                                        // onClickAway={clickAwayListener}
                                        style={{
                                          position: "absolute",
                                          left:
                                            replayData[index][frameStep].x +
                                            "px",
                                          top:
                                            replayData[index][frameStep].y +
                                            "px",
                                          transition: "all 2s linear",
                                        }}
                                      >
                                        <HtmlTooltip
                                          id={`bug-${String(index)}`}
                                          leaveDelay={7000}
                                          // open={tooltipOpen === index}
                                          title={
                                            <>
                                              <div>
                                                {dummyMetadata[String(index)] &&
                                                  dummyMetadata[String(index)]
                                                    .name &&
                                                  `Name: ${
                                                    dummyMetadata[String(index)]
                                                      .name
                                                  }`}
                                              </div>
                                              <div>
                                                {dummyMetadata[String(index)] &&
                                                  dummyMetadata[String(index)]
                                                    .disease &&
                                                  `Disease: ${
                                                    dummyMetadata[String(index)]
                                                      .disease
                                                  }`}{" "}
                                              </div>
                                              <div>
                                                {dummyMetadata[String(index)] &&
                                                  dummyMetadata[String(index)]
                                                    .date &&
                                                  `Incident date: ${
                                                    dummyMetadata[String(index)]
                                                      .date
                                                  }`}
                                              </div>
                                            </>
                                          }
                                        >
                                          <div>
                                            {mapIcon(
                                              index,
                                              frameStep,
                                              replayData[index][frameStep],
                                              dummyMetadata[String(index)]
                                            )}
                                          </div>
                                        </HtmlTooltip>
                                      </div>
                                    ) : (
                                      <></>
                                    )}
                                  </>
                                )
                              )}
                            </>
                          ))}
                        <div className="watch-event-controls">
                          <div className="control play-wrapper">
                            {replaying ? (
                              <Button onClick={handlePause}>
                                <PauseIcon />
                              </Button>
                            ) : (
                              <Button onClick={handlePlay}>
                                <PlayArrowIcon />
                              </Button>
                            )}
                          </div>
                          <div className="control forward-wrapper">
                            <Forward5Icon />
                          </div>
                          <div className="control replay-wrapper">
                            <Replay5Icon />
                          </div>
                          <div className="control seek-container">
                            <div className="seek-time">
                              {moment(seekTime).format("mm:ss")}
                            </div>
                            <div className="seeker-track">
                              <div
                                className="progress-indicator"
                                style={{
                                  width: `${currentAnimationProgress.current}%`,
                                }}
                              ></div>
                              {timeMarkers.map((marker) => (
                                <Button
                                  className="time-marker"
                                  onClick={() => goToTimeMarker(marker)}
                                  style={{ left: `${marker}%` }}
                                ></Button>
                              ))}
                            </div>
                            <div className="duration-time">
                              {moment(eventAnimationDuration).format("mm:ss")}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <div className="pull-right with-margins">
                        <Button>Next: Travis Peel (133 123 1234)</Button>
                      </div>
                      <div className="box-shadow rounded-sm padded with-margins">
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <div className="subdued-text capitalized">
                              Encounter date & time
                            </div>
                          </Grid>
                          <Grid item xs={6}>
                            <div className="subdued-text">
                              {currentExposure.date}
                            </div>
                          </Grid>
                        </Grid>
                      </div>
                      <div className="box-shadow rounded-sm padded with-margins">
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <strong>Index case</strong>
                          </Grid>
                          <Grid item xs={6}>
                            <div className="subdued-text capitalized">
                              Full name
                            </div>
                          </Grid>
                          <Grid item xs={6}>
                            <div className="subdued-text">
                              {data.index.name}
                            </div>
                          </Grid>
                        </Grid>
                      </div>
                      <div className="box-shadow rounded-sm padded with-margins">
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <strong>Contacts & contaminations</strong>
                          </Grid>
                          <Grid item xs={6}>
                            <div className="subdued-text capitalized">
                              Full name
                            </div>
                          </Grid>
                          <Grid item xs={6}>
                            <div className="subdued-text">
                              {currentExposure.name}
                            </div>
                          </Grid>
                          <Grid item xs={6}>
                            <div className="subdued-text capitalized">Role</div>
                          </Grid>
                          <Grid item xs={6}>
                            <div className="subdued-text">
                              {currentExposure.role}
                            </div>
                          </Grid>
                          <Grid item xs={6}>
                            <div className="subdued-text capitalized">
                              Duration
                            </div>
                          </Grid>
                          <Grid item xs={6}>
                            <div className="subdued-text">
                              {currentExposure.duration}
                            </div>
                          </Grid>
                          <Grid item xs={6}>
                            <div className="subdued-text capitalized">
                              Distance
                            </div>
                          </Grid>
                          <Grid item xs={6}>
                            <div className="subdued-text">
                              {currentExposure.distance}
                            </div>
                          </Grid>
                        </Grid>
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </>
            )}
          </Modal>
        </>
      )}
    </>
  );
}

export default CaseDetail;
