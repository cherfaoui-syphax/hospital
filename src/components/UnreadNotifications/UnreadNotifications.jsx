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

function UnreadNotifications() {
  const [data, setData] = React.useState();

  const fetchData = async () => {
    const resp = await fetch(
      `${process.env.REACT_APP_API_URL}/active_incidents_unread_notifications?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImlhdCI6MTYwMDk3MzUxMywiZXhwIjoxNjAxNTc4MzEzfQ.OymFrLMMYgFAnYpveZPTgJVg6shCMhducqmZ21oYzY8&ward=2`
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
      <div className="notifications">
        <div className="incident-title">
          <div className="incident-title-text">Unread Notifications</div>
        </div>
        <div className="notifications-rows">
          {data?.map((notification, index) => (
            <div className="notification">
              <div className="left">
                <span className="content">
                  {notification.pathogen &&
                    `${notification.pathogen} test: ${notification.testResult}`}
                  {notification.location &&
                    `${notification.location} ${notification.mitigation} ${notification.status}`}
                </span>
                <span className="name">{notification.name}</span>
                <span className="id">({notification.id})</span>
              </div>
              <div className="right">
                <div className="date">{notification.date}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="white-gradient">&nbsp;</div>
      </div>
    </>
  );
}

export default UnreadNotifications;
