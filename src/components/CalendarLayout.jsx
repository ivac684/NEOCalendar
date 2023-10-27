import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import Button from "@mui/material/Button";
import moment from "moment";
import { Typography } from "@mui/material";
import Popover from "@mui/material/Popover";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";

const useStyles = {
  dayName: {
    padding: "15px",
    fontSize: "17px",
    textAlign: "center",
    backgroundColor: "rgb(0,0,0)",
    color: "white",
    flex: 1,
    margin: 0,
  },
  item: {
    padding: "15%",
    fontSize: "14px",
    color: "rgb(48,48,48)",
    width: "100%",
    height: "130%",
  },
  monthControls: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  monthLabel: {
    color: "white",
    fontSize: "24px",
    padding: "10px",
  },
  arrowButton: {
    color: "yellow",
    marginRight: "40px",
    marginLeft: "40px",
  },
  otherMonthDay: {
    color: "yellow",
  },
  modalContent: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxWidth: 400,
    backgroundColor: "white",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  },
  titlePopover: {
    backgroundColor: "rgb(0,0,0)",
    color: "white",
    padding: "50px",
  },
  dateNumber: {
    color: "rgb(202, 193, 193)",
  },
  yellowDateNumber: {
    color: "yellow",
  },
  popoverData: {
    color: "yellow",
  },
  yellowText: {
    color: "yellow",
  },
  textBreak: {
    margin: "8px 0",
  },
};

function generateCalendarData(currentDate) {
  const startDate = currentDate.clone().startOf("month").startOf("week").day(1);
  const endDate = currentDate.clone().endOf("month").endOf("week").day(7);
  const calendarData = [];
  let dateIterator = startDate.clone();

  while (dateIterator.isSameOrBefore(endDate, "day")) {
    calendarData.push(dateIterator.clone());
    dateIterator.add(1, "day");
  }
  return calendarData;
}

export default function CalendarLayout() {
  const [currentDate, setCurrentDate] = useState(moment());
  const [weeks, setWeeks] = useState([]);
  const [NASAData, setNASAData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedYear, setSelectedYear] = useState(currentDate.year());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchNASAData = async () => {
      try {
        const response = await axios.get(
          "https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=ks1YtgjRvZVE0OZerWxH2gQb62XMYSXtxBfeBLN1"
        );
        console.log(response);
        setNASAData(response.data.near_earth_objects);
      } catch (error) {
        console.error("Error fetching NASA data:", error);
      }
    };
    fetchNASAData();
  }, []);

  const handleDateClick = (date) => {
    if (date.month() === currentDate.month()) {
      setSelectedDate(date);
    } else {
      console.log(
        "This is a day from another month:",
        date.format("YYYY-MM-DD")
      );
      setSelectedDate(null);
    }
  };

  const updateCalendar = (newDate) => {
    setCurrentDate(newDate);
    const newWeeks = [];
    const calendarData = generateCalendarData(newDate);

    for (let i = 0; i < calendarData.length; i += 7) {
      newWeeks.push(calendarData.slice(i, i + 7));
    }

    setWeeks(newWeeks);
  };

  const handleNextMonth = () => {
    const newDate = currentDate.clone().add(1, "month");
    updateCalendar(newDate);
  };

  const handlePreviousMonth = () => {
    const newDate = currentDate.clone().subtract(1, "month");
    updateCalendar(newDate);
  };

  const years = [];
  const currentYear = moment().year();
  for (let year = currentYear - 50; year <= currentYear + 10; year++) {
    years.push(year);
  }

  if (weeks.length === 0) {
    updateCalendar(currentDate);
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <div style={useStyles.monthControls}>
        <Button onClick={handlePreviousMonth} style={useStyles.arrowButton}>
          <ArrowBackIosOutlinedIcon />
        </Button>
        <div style={useStyles.monthLabel}>
          {currentDate.format("MMMM YYYY")}
        </div>
        {isDropdownOpen ? (
          <Select
            open={isDropdownOpen}
            onClose={() => setIsDropdownOpen(false)}
            value={selectedYear}
            onChange={(e) => {
              const newYear = e.target.value;
              setSelectedYear(newYear);
              const newDate = moment(currentDate).year(newYear);
              updateCalendar(newDate);
              setIsDropdownOpen(false);
            }}
            style={{ color: "yellow" }}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <IconButton
            style={{ color: "yellow" }}
            onClick={() => setIsDropdownOpen(true)}
          >
            <KeyboardDoubleArrowDownIcon />
          </IconButton>
        )}
        <Button onClick={handleNextMonth} style={useStyles.arrowButton}>
          <ArrowForwardIosOutlinedIcon />
        </Button>
      </div>
      <Grid container spacing={0.5}>
        <Grid item xs>
          <div style={useStyles.dayName}>MONDAY</div>
        </Grid>
        <Grid item xs>
          <div style={useStyles.dayName}>TUESDAY</div>
        </Grid>
        <Grid item xs>
          <div style={useStyles.dayName}>WEDNESDAY</div>
        </Grid>
        <Grid item xs>
          <div style={useStyles.dayName}>THURSDAY</div>
        </Grid>
        <Grid item xs>
          <div style={useStyles.dayName}>FRIDAY</div>
        </Grid>
        <Grid item xs>
          <div style={useStyles.dayName}>SATURDAY</div>
        </Grid>
        <Grid item xs>
          <div style={useStyles.dayName}>SUNDAY</div>
        </Grid>
      </Grid>
      {weeks.map((week, weekIndex) => (
        <Grid container spacing={2} key={weekIndex}>
          {week.map((date, dateIndex) => (
            <Grid item xs key={dateIndex}>
              <Button
                style={{
                  ...useStyles.item,
                  ...(date.month() !== currentDate.month() && {
                    ...useStyles.otherMonthDay,
                  }),
                }}
                onClick={() => handleDateClick(date)}
              >
                <div>
                  <div
                    style={
                      date.month() !== currentDate.month()
                        ? useStyles.yellowDateNumber
                        : useStyles.dateNumber
                    }
                  >
                    {date.format("D")}
                  </div>
                  {NASAData.some((NEOData) =>
                    moment(
                      NEOData.orbital_data.orbit_determination_date
                    ).isSame(date, "day")
                  ) && (
                    <div style={{ fontSize: "10px", color: "yellow" }}>
                      NEO DETECTED
                    </div>
                  )}
                </div>
              </Button>

              {NASAData.some((NEOData) =>
                moment(NEOData.orbital_data.orbit_determination_date).isSame(
                  date,
                  "day"
                )
              ) && (
                <Popover
                  open={selectedDate && selectedDate.isSame(date, "day")}
                  anchorEl={document.getElementById(
                    `date-button-${date.format("YYYY-MM-DD")}`
                  )}
                  onClose={() => setSelectedDate(null)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  style={{ marginTop: "-200px" }}
                >
                  <div style={useStyles.titlePopover}>
                    <RocketLaunchIcon />
                    {NASAData.filter((NEOData) =>
                      moment(
                        NEOData.orbital_data.orbit_determination_date
                      ).isSame(date, "day")
                    ).map((NEOData) => (
                      <Typography key={NEOData.name} variant="body2">
                        <span style={useStyles.yellowText}>{NEOData.name}</span>
                        <br></br>
                        <span style={useStyles.yellowText}>
                          Magnitude:
                        </span>{" "}
                        {NEOData.absolute_magnitude_h} <br></br>
                        <span style={useStyles.yellowText}>
                          First observation date:
                        </span>{" "}
                        {NEOData.orbital_data.first_observation_date}
                        <br></br>
                        <span style={useStyles.yellowText}>
                          Description:
                        </span>{" "}
                        {
                          NEOData.orbital_data.orbit_class
                            .orbit_class_description
                        }
                        <br></br>
                        <br></br>
                      </Typography>
                    ))}
                  </div>
                </Popover>
              )}
            </Grid>
          ))}
        </Grid>
      ))}
    </Box>
  );
}