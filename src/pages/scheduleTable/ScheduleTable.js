import React, { useState, useEffect, setError } from "react";
import DatePicker from "react-datepicker"; // Import the DatePicker component
import "react-datepicker/dist/react-datepicker.css";
import { GetAllArenasAsync } from "../../controllers/ArenasController";
import { GetAllEntriesFromDateAndArenaAsyc } from "../../controllers/EntriesController";
import { GetRefGroupAsync } from "../../controllers/GroupsController";
import { GetRefArenaAsync } from "../../controllers/ArenasController";
import { Entries } from "../../entities/EntriesEntity";
import AddGroupModal from "../../components/GroupPopUpBox";
import HoursEnum from "../../enums/TimeScheduleEnum";

const ScheduleTable = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [fetchArena, setFetchArena] = useState([]);
  const [selectedArena, setSelectedArena] = useState("");
  const [entries, setEntries] = useState([]);
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);

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
        setError(error);
      });
  }, []);

  useEffect(() => {
    GetAllEntriesFromDateAndArenaAsyc(selectedArena, selectedDate)
      .then((entriesSnap) => {
        const promises = entriesSnap.map(async (data) => {
          const referencedArena = await GetRefArenaAsync(data.arena);
          const referencedGroup = await GetRefGroupAsync(data.group);

          return new Entries({
            id: data.id,
            arena: referencedArena,
            group: referencedGroup,
            datetime: data.datetime,
          });
        });

        Promise.all(promises)
          .then((results) => {
            setEntries(results);
          })
          .catch((error) => {
            setError(error);
          });
      })
      .catch((error) => {
        setError(error);
      });
  }, [selectedArena, selectedDate, entries]);

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

  const handleRowClick = (timeSlot) => {
    setSelectedTime(timeSlot)
    setIsAddGroupModalOpen(true);
  };

  return (
    <div className="ScheduleTableContainer">
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
              <option value="">Select an Arena</option>

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

                return (
                  <tr key={index} onClick={() => handleRowClick(timeSlot)}>
                    <td>
                      {timeSlot.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td>{matchingEntry ? matchingEntry.group.name : ""}</td>
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
      />
    </div>


  );
};

export default ScheduleTable;
