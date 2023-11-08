import React, { useState, useEffect, setError } from "react";
import DatePicker from "react-datepicker"; // Import the DatePicker component
import "react-datepicker/dist/react-datepicker.css";
import { GetAllArenasAsync } from "../../controllers/ArenasController";
import { GetAllEntriesFromDateAndArenaAsyc } from "../../controllers/EntriesController";
import AddGroupModal from "../../components/GroupPopUpBox";
import HoursEnum from "../../enums/TimeScheduleEnum";

import { Arena } from "../../objectDTOs/ArenasDto";


const ScheduleTable = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [fetchArena, setFetchArena] = useState([]);
  const [selectedArena, setSelectedArena] = useState(null);
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState();
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  const timeSlots = Array.from(
    { length: HoursEnum.HOUR_23 - HoursEnum.HOUR_9 + 1 },
    (_, index) => {
      const hour = HoursEnum.HOUR_9 + index;
      const timestamp = new Date(selectedDate);
      timestamp.setHours(hour, 0, 0, 0); // Set the hours and clear minutes, seconds, and milliseconds
      return timestamp;
    }
  );

  useEffect(() => {
    GetAllArenasAsync()
      .then((data) => {
        setFetchArena(data);
      })
      .catch((error) => {
        setFetchArena([new Arena('1', 'BlueArena')])
        setError(error);
      });
  }, []);

  useEffect(() => {
    if (selectedArena !== null && selectedDate !== null) {
      GetAllEntriesFromDateAndArenaAsyc(selectedArena, selectedDate)
        .then((data) => {
          setEntries(data);
        })
        .catch((error) => {
          setError(error);
          setEntries([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [selectedArena, selectedDate]);

  const handleArenaChange = (e) => {
    const selectedArenaName = e.target.value;
    const selectedTmpArena = fetchArena.find(
      (arena) => arena.name === selectedArenaName
    );
    setSelectedArena(selectedTmpArena);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleRowClick = (timeSlot, matchingEntry) => {
    setSelectedTime(timeSlot);
    setSelectedEntry(matchingEntry);
    setIsAddGroupModalOpen(true);
  };


  return (
    <div className="ScheduleTableContainer">
      {console.log(entries)}
      
      <h2>Schedule Table</h2>
      <div className="calendar-and-table">
        <div className="calendar-and-arena">
          <div className="date-container">
            <label htmlFor="datePicker" className="label">
              Select Date:
            </label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              className="form-control"
            />
          </div>

          <div className="arena-container">
            <label htmlFor="arenaSelect" className="label">
              Select Arena:
            </label>

            <select
              id="arenaSelect"
              className="form-control"
              value={selectedArena ? selectedArena.name : ""}
              onChange={handleArenaChange}
            >
              {fetchArena.map((arena) => (
                <option key={arena.id} value={arena.name}>
                  {" "}
                  {arena.name}{" "}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="table">
          <table className="ScheduleTable">
            <thead>
              <tr>
                <th>Time</th>
                <th>Group</th>
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((timeSlot, index) => {
                const matchingEntry = entries.find(
                  (item) =>
                    item.datetime.toDate().getHours() ===
                    new Date(timeSlot).getHours()
                    );

                let groupName = "";

                if (matchingEntry) {
                  if (matchingEntry.group.group.name) {
                    groupName = matchingEntry.group.group.name;
                  } else {
                    groupName = "..."; // Display "Loading..." if the name is not available
                  }
                }

                return (
                  <tr key={index} onClick={() => handleRowClick(timeSlot, matchingEntry)}>
                    <td>
                      {timeSlot.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td>{groupName}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AddGroupModal
        isOpen={isAddGroupModalOpen}
        onRequestClose={() => setIsAddGroupModalOpen(false)}
        arena={selectedArena}
        time={selectedTime}
        entry={selectedEntry}
      />
    </div>


  );
};

export default ScheduleTable;
