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
import PlaceIcon from "@mui/icons-material/Place";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import PersonIcon2 from "@mui/icons-material/Person";
import CircleIcon from '@mui/icons-material/Circle';

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
  const [currentAnimationProgress, setCurrentAnimationProgress] =
    React.useState();
  const timerRef = React.useRef();
  const replayStartTime = React.useRef(null);
  const actualStartTime = React.useRef();
  const actualDuration = React.useRef();
  const actualEndTime = React.useRef();
  const { incidentId } = useParams();
  const [seekTime, setSeekTime] = React.useState(0);
  const [timeMarkers, setTimeMarkers] = React.useState([]);
  const [shouldKeepRefreshingData, setShouldKeepRefreshingData] =
    React.useState(true);
  const [nextEvent, setNextEvent] = React.useState();
  const lastFrameSteps = React.useRef({});

  const VIDEO_TIME_UNIT_MILLISECONDS = 1000;
  const TIME_PADDING_END = 30;

  const goToTimeMarker = (timeMarker) => {
    clearTimeout(timerRef.current);
    // replayDataIteration.current = timeMarker / 1000;
    setCurrentAnimationProgress((timeMarker / eventAnimationDuration) * 100);
    setSeekTime(timeMarker);
  };

  const iconStyle = {
    marginBottom: "-6px",
  };

  const handleSeek = (evt) => {
    console.log(evt);
  };

  const handleWatchEventOpen = (exposure, nextExposure) => {
    const duration =
      exposure.duration / 60000 > 1
        ? `${exposure.duration / 60000} minutes`
        : `${exposure.duration / 60000} minute`;

    setCurrentExposure({
      duration,
      ...exposure,
    });
    setWatchEventOpen(true);
    setNextEvent(nextExposure);
  };

  const handleWatchEventClose = () => {
    setCurrentExposure(null);
    setWatchEventOpen(false);
    setReplayData(null);
    // replayDataIteration.current = 0;
    replayStartTime.current = undefined;
  };

  const HtmlTooltip = styled(({ className, id, shouldBeOpen, ...props }) => {
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

    const eventParticipantIds = `${data.id},${currentExposure.id}`;

    const resp = await fetch(
      `https://rtls.proxximos.com/beacon_history?min=${minDate}&max=${maxDate}&ids=${eventParticipantIds}`
    );

    const jsonData = await resp.json();

    Object.keys(jsonData).forEach((key) => {
      let frame = 0;
      let frameDateTime;

      for (frame; frame <= jsonData[key].length - 1; frame++) {
        frameDateTime = new Date(jsonData[key][frame].date).getTime();

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

    actualDuration.current = actualEndTime.current - actualStartTime.current;

    setReplayData(jsonData);
    setEventAnimationDuration(actualDuration.current);

    const priorMarkerOffset =
      new Date(currentExposure.date).getTime() -
      VIDEO_TIME_UNIT_MILLISECONDS -
      actualStartTime.current;
    const afterMarkerOffset =
      new Date(currentExposure.date).getTime() +
      VIDEO_TIME_UNIT_MILLISECONDS -
      actualStartTime.current;

    const timeMarkersArray = [priorMarkerOffset, afterMarkerOffset];

    setTimeMarkers(timeMarkersArray);

    durationTimer.current = setTimeout(() => {
      setShouldKeepRefreshingData(false);
      setReplaying(false);
    }, actualDuration.current - 1);
  };

  const fetchReplayData = async () => {
    // replayDataIteration.current++;

    setCurrentAnimationProgress((seekTime / eventAnimationDuration) * 100);

    setSeekTime(seekTime + VIDEO_TIME_UNIT_MILLISECONDS);
  };

  const mapIcon = (index, frameStep, item) => {
    const infectionOccurred =
      new Date(replayData[index][frameStep].date).getTime() >=
        new Date(currentExposure.date).getTime() &&
      replayData[index][frameStep].id === parseInt(currentExposure.id);

    if (replayData[index][frameStep].id === parseInt(data.id)) {
      return (
        <>
          {lastFrameSteps.current[index] === frameStep ? (
            <BugIcon
              setOpenTooltip={(id) => handleOpenTooltip(id)}
              id={`bug-${index}-${frameStep}`}
              key={`bug-${index}-${frameStep}`}
              posX={replayData[index][frameStep].x}
              posY={replayData[index][frameStep].y}
              fill={color["infected-index-case"]}
              style={{
                width: "110px",
                height: "110px",
              }}
            />
          ) : (
            <div
              id={`bug-${index}-${frameStep}`}
              key={`bug-${index}-${frameStep}`}
              onMouseEnter={() => {
                setOpenTooltip(`bug-${index}-${frameStep}`);
              }}
              onMouseLeave={() => {
                setOpenTooltip(null);
              }}
              style={{
                borderRadius: "30px",
                backgroundColor: color["infected-index-case"],
                width: 20,
                height: 20,
                position: "absolute",
              }}
            ></div>
          )}
        </>
      );
    }

    if (infectionOccurred) {
      return (
        <>
          {lastFrameSteps.current[index] === frameStep ? (
            <BugIcon
              setOpenTooltip={(id) => handleOpenTooltip(id)}
              id={`bug-${index}-${frameStep}`}
              key={`bug-${index}-${frameStep}`}
              posX={replayData[index][frameStep].x}
              posY={replayData[index][frameStep].y}
              fill={color["infected-contact"]}
              style={{
                width: "110px",
                height: "110px",
              }}
            />
          ) : (
            <div
              id={`bug-${index}-${frameStep}`}
              key={`bug-${index}-${frameStep}`}
              onMouseEnter={() => {
                setOpenTooltip(`bug-${index}-${frameStep}`);
              }}
              onMouseLeave={() => {
                setOpenTooltip(null);
              }}
              style={{
                borderRadius: "30px",
                backgroundColor: color["infected-contact"],
                width: 20,
                height: 20,
                position: "absolute",
              }}
            ></div>
          )}
        </>
      );
    }

    if (!infectionOccurred) {
      return (
        <>
          {lastFrameSteps.current[index] === frameStep ? (
            <PersonIcon
              setOpenTooltip={(id) => handleOpenTooltip(id)}
              id={`bug-${index}-${frameStep}`}
              key={`bug-${index}-${frameStep}`}
              posX={replayData[index][frameStep].x}
              posY={replayData[index][frameStep].y}
              style={{
                width: "110px",
                height: "110px",
              }}
            />
          ) : (
            <div
              id={`bug-${index}-${frameStep}`}
              key={`bug-${index}-${frameStep}`}
              onMouseEnter={() => {
                setOpenTooltip(`bug-${index}-${frameStep}`);
              }}
              onMouseLeave={() => {
                setOpenTooltip(null);
              }}
              style={{
                borderRadius: "30px",
                backgroundColor: color["uninfected"],
                width: 20,
                height: 20,
                position: "absolute",
              }}
            ></div>
          )}
        </>
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

  const handleForward5Seconds = () => {
    clearTimeout(timerRef.current);
    const newSeekTime = seekTime + VIDEO_TIME_UNIT_MILLISECONDS * 5;
    if (newSeekTime <= actualDuration.current) {
      // replayDataIteration.current = replayDataIteration.current + 5;
      setCurrentAnimationProgress((newSeekTime / eventAnimationDuration) * 100);
      setSeekTime(newSeekTime);
    }
  };

  const handleRewind5Seconds = () => {
    clearTimeout(timerRef.current);
    const newSeekTime = seekTime - VIDEO_TIME_UNIT_MILLISECONDS * 5;
    // if (replayDataIteration.current - 5 >= 0) {
    // replayDataIteration.current = replayDataIteration.current - 5;
    setCurrentAnimationProgress((newSeekTime / eventAnimationDuration) * 100);
    setSeekTime(newSeekTime);
    // }
  };

  const handleOpenNextEvent = () => {
    let eventAfterTheNextIndex;
    data.exposures.forEach((exposure, index) => {
      if (exposure.id === nextEvent.id) {
        eventAfterTheNextIndex = index + 1;
      }
    });
    if (!eventAfterTheNextIndex) {
      handleWatchEventClose();
    }
    handleWatchEventClose();
    handleWatchEventOpen(nextEvent, data.exposures[eventAfterTheNextIndex]);
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

    if (!replayData && currentExposure) {
      initializeReplayData();
    }
  });

  React.useEffect(() => {
    if (
      replayData &&
      shouldKeepRefreshingData &&
      replaying &&
      seekTime <= actualDuration.current - VIDEO_TIME_UNIT_MILLISECONDS
    ) {
      timerRef.current = setTimeout(
        fetchReplayData,
        VIDEO_TIME_UNIT_MILLISECONDS
      );
    }
  }, [replayData, replaying, shouldKeepRefreshingData, seekTime]);

  return (
    <>
      {data && (
        <>
          <div
            className="box-shadow box-shadow-white"
            style={{
              marginTop: "100px",
              padding: "15px 30px",
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

            <div className="incident-box">
              <div className="incident-content rounded-sm padded with-margins box-shadow box-shadow-white">
                <div
                  className="subdued-text capitalized incident-content rounded-sm with-margins padded thin-header"
                  style={{ marginLeft: "20px" }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      Date And Time Created
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
                    <Grid item xs={12} md={3}>
                      Contacts | contaminations
                    </Grid>
                  </Grid>
                </div>
                <div className="incident-box">
                  <div className="incident-content rounded-sm padded with-margins   thin-header ">
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={3}>
                        <div className="date">{data.date}</div>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <div className="name blue bold">
                          {data.index.name} <br /> ({data.index.id})
                        </div>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <div className="role">{data.pathogen}</div>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <div className="pathogen">{data.pathogenCategory}</div>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <div className="exposures">
                          {
                            <PersonIcon2
                              style={{ color: "black", ...iconStyle }}
                            >
                              {" "}
                            </PersonIcon2>
                          }
                          {data &&
                            data.exposures &&
                            data.exposures.filter(
                              (exposure) => exposure.type === "person"
                            ).length}{" "}
                          <div
                            className="subdued-text"
                            style={{
                              width: 30,
                              textAlign: "center",
                              display: "inline-block",
                            }}
                          >
                            |
                          </div>
                          {
                            <PlaceIcon
                              style={{ color: "black", ...iconStyle }}
                            ></PlaceIcon>
                          }{" "}
                          {data &&
                            data.exposures &&
                            data.exposures.filter(
                              (exposure) => exposure.type === "room"
                            ).length}
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </div>
            </div>
            <h2>Contacts & Contaminations</h2>
            <div className="incident-box">
              <div className="incident-content rounded-sm padded with-margins box-shadow box-shadow-white">
                <div
                  className="subdued-text capitalized incident-content rounded-sm with-margins padded thin-header"
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
                    const mins = moment(exposure.duration).format(
                      exposure.duration > 60000 ? "m" : "s"
                    );
                    const seconds =
                      exposure.duration > 60000
                        ? `minutes ${moment(exposure.duration).format(
                            "s"
                          )} seconds`
                        : "seconds";

                    const duration = `${mins} ${seconds}`;
                    return (
                      <div className="incident-box">
                        <div className="incident-content rounded-sm padded with-margins contacts-contaminations ">
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={2}>
                              <div className="name blue bold">
                                {exposure.name}
                                <br />
                                {exposure.type === "room"
                                  ? ""
                                  : `(${exposure.id})`}
                              </div>
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <div className="name blue role bold">
                                {exposure.role}
                              </div>
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <div className="occurrence-time">
                                {exposure.date}
                              </div>
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <div className="pathogen">{duration}</div>
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <div className="distance">
                                {exposure.distance} m
                              </div>
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <Button
                                onClick={() =>
                                  handleWatchEventOpen(
                                    exposure,
                                    data.exposures[index + 1]
                                      ? data.exposures[index + 1]
                                      : null
                                  )
                                }
                              >
                                ▶ Watch event
                              </Button>
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {currentExposure && (
            <Modal
              open={watchEventOpen}
              onClose={handleWatchEventClose}
              aria-labelledby="Watch Event"
              aria-describedby="Watch step-by-step replay of contamination event"
            >
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
                            {Object.keys(replayData[index]).map((frameStep) => {
                              const framePosition =
                                new Date(
                                  replayData[index][frameStep].date
                                ).getTime() - actualStartTime.current;

                              if (!replayData[index][frameStep]) {
                                return <></>;
                              }

                              if (
                                lastFrameSteps.current[index] === undefined &&
                                framePosition <= seekTime
                              ) {
                                lastFrameSteps.current[index] = frameStep;
                              }

                              if (
                                frameStep > lastFrameSteps.current[index] &&
                                framePosition <= seekTime
                              ) {
                                lastFrameSteps.current[index] = frameStep;
                              }

                              return (
                                <>
                                  {framePosition <= seekTime ? (
                                    <div
                                      // onClickAway={clickAwayListener}
                                      style={{
                                        position: "absolute",
                                        left:
                                          replayData[index][frameStep].x + "px",
                                        top:
                                          replayData[index][frameStep].y + "px",
                                        transition: "all 2s linear",
                                      }}
                                    >
                                      <HtmlTooltip
                                        id={`bug-${index}-${frameStep}`}
                                        // shouldBeOpen={true}
                                        // shouldBeOpen={
                                        //   replayData[index][frameStep].id ===
                                        //   currentExposure.id
                                        // }
                                        leaveDelay={7000}
                                        // open={tooltipOpen === index}
                                        title={
                                          <>
                                            <div>
                                              {dummyMetadata[String(index)] &&
                                                dummyMetadata[String(index)]
                                                  .name &&
                                                `${
                                                  dummyMetadata[String(index)]
                                                    .name
                                                }`}
                                            </div>
                                            {/* <div>
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
                                            </div> */}
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
                              );
                            })}
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
                          <Button onClick={handleForward5Seconds}>
                            <Forward5Icon />
                          </Button>
                        </div>
                        <div className="control replay-wrapper">
                          <Button onClick={handleRewind5Seconds}>
                            <Replay5Icon />
                          </Button>
                        </div>
                        <div className="control seek-container">
                          <div className="seek-time">
                            {moment(seekTime).format("mm:ss")}
                          </div>
                          <div className="seeker-track">
                            <div
                              className="progress-indicator"
                              style={{
                                width: `${currentAnimationProgress}%`,
                              }}
                            ></div>
                            {timeMarkers.map((marker) => (
                              <Button
                                className="time-marker"
                                onClick={() => goToTimeMarker(marker)}
                                style={{
                                  left: `${
                                    (marker / actualDuration.current) * 100
                                  }%`,
                                }}
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
                    {nextEvent ? (
                      <div className="pull-right with-margins">
                        <Button onClick={handleOpenNextEvent}>
                          Next: {nextEvent.name}{" "}
                          {nextEvent.id ? `(${nextEvent.id})` : ""}
                        </Button>
                      </div>
                    ) : (
                      <></>
                    )}
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
                          <CircleIcon
                            style={{
                              color:"red",
                              marginRight:10,
                              marginBottom:-6
                              }} />
                          <strong>Index case</strong>
                          <div className="case-detail-card-divider"></div>
                        </Grid>
                        <Grid item xs={6}>
                          <div className="subdued-text capitalized ">
                            Full name
                          </div>
                        </Grid>
                        <Grid item xs={6}>
                          <div className="name blue bold">
                            {data.index.name} <br /> ({data.index.id})
                          </div>
                        </Grid>
                        <Grid item xs={6}>
                          <div className="subdued-text">
                            Role
                          </div>
                        </Grid>
                        <Grid item xs={6}>
                          <div className="subdued-text">
                            {data.role }
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                    <div className="box-shadow rounded-sm padded with-margins">
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <CircleIcon
                            style={{
                              color:"#507cd4",
                              marginRight:10,
                              marginBottom:-6
                            }} />
                          <strong>Contacts & contaminations</strong>
                          <div className="case-detail-card-divider"></div>
                        </Grid>

                        <Grid item xs={6}>
                          <div className="subdued-text capitalized">
                            { currentExposure.role != "Room" ? "Full name" : "Location" } 
                          </div>
                        </Grid>
                        <Grid item xs={6}>
                          <div className="name blue bold">
                            {currentExposure.name} <br /> ({currentExposure.id})
                          </div>
                        </Grid>
                        { currentExposure.role != "Room" &&
                        <>
                          <Grid item xs={6}>
                            <div className="subdued-text capitalized">Role</div>
                          </Grid>
                          <Grid item xs={6}>
                            <div className="subdued-text">
                              {currentExposure.role}
                            </div>
                          </Grid>
                        </>
                        }
                        <Grid item xs={6}>
                          <div className="subdued-text capitalized">
                            Duration
                          </div>
                        </Grid>
                        <Grid item xs={6}>
                          <div className="subdued-text">
                            {moment(actualDuration.current).format(
                              actualDuration.current > 60000 ? "m" : "s"
                            )}{" "}
                            {actualDuration.current > 60000
                              ? `minutes ${moment(
                                  actualDuration.current
                                ).format("s")} seconds`
                              : "seconds"}
                          </div>
                        </Grid>
                        { currentExposure.role != "Room" &&
                        <>
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
                        </>
                        }
                      </Grid>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </Modal>
          )}
        </>
      )}
    </>
  );
}

export default CaseDetail;
