import 'bootstrap/dist/css/bootstrap.css';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../cssfiles/profile.css";

export function Profile() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogoutClick = () => {
    localStorage.clear();
    navigate("/");
  };

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [reservation, setReservation] = useState([]);

  const getUserProfile = async () => {
    try {
      const endpoint = "http://localhost:8000/profile";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          auth_token: localStorage.getItem("token"),
        }),
      });
      const data = await response.json();
      setName(data.net_id);
      setEmail(data.email);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getReservations = async (userEmail) => {
    try {
      const endpoint = "http://localhost:8000/profile/get-reservation";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          email: userEmail,
        }),
      });
      const data = await response.json();
      setReservation(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      const userResults = await getUserProfile();
      await getReservations(userResults.email);
    })();
  }, []);

  return (
    <div>
      {/* Navbar */}
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand"> BetterRoomReserve </a>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="/">
                  Home
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/reserve">
                  Reserve
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/profile">
                  Profile
                </a>
              </li>
            </ul>
          </div>
          {!localStorage.getItem("token") && (
            <button class="btn primary btn" onClick={handleLoginClick}>
              Login
            </button>
          )}
          {localStorage.getItem("token") && (
            <button class="btn primary btn" onClick={handleLogoutClick}>
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* Profile */}

      <section>
        <div className="user-info">
          <img
            src={require("../images/nyu-logo.png")}
            height="200px"
            width="200px"
          ></img>
          <h3>Hello, {name}</h3>
          <p>Email: {email}</p>
        </div>
        <div className="reservation-info">
          <h3 className="reservation-header">Your Upcoming Reservations</h3>
          <table className="reservations-table">
            <tr>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Building</th>
              <th>Room</th>
              <th>Floor</th>
              <th>Cancel?</th>
            </tr>
            {reservation.map((info) => (
              <tr>
                <td>{formatDate(info.date)}</td>
                <td>{convertTime(info.start_time)}</td>
                <td>{convertTime(info.end_time)}</td>
                <td>{info.building}</td>
                <td>{info.room_id}</td>
                <td>{info.floor}</td>
                <td>
                  <CancelButton res_id={info.res_id}></CancelButton>
                </td>
              </tr>
            ))}
          </table>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-center text-white">
        <div className="footer-text">© 2023 Copyright: BetterRoomReserve</div>
      </footer>
    </div>
  );
}

async function cancelReservation(reservation_id) {
  try {
    const endpoint = "http://localhost:8000/profile/cancel";
    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        res_id: reservation_id,
      }),
    });
    const data = await response.json();
    if (data.reservation) {
      return window.location.reload();
    } else {
      return data.Error;
    }
  } catch (error) {
    console.log(error);
  }
}

function CancelButton({ res_id }) {
  return (
    <button
      className="cancelButton"
      onClick={() => {
        if (
          window.confirm(
            `Are you sure you want to cancel the reservation with ID ${res_id}`
          ) == true
        ) {
          cancelReservation(res_id);
        }
      }}
    >
      Cancel
    </button>
  );
}

function convertTime(time) {
  // Check correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
    time,
  ];

  if (time.length > 1) {
    // If time format correct
    time = time.slice(0, -1).slice(1); // Remove full string match value
    time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join(""); // return adjusted time or original string
}

function formatDate(inputDate) {
  var date = new Date(inputDate + "T00:00:00");
  if (!isNaN(date.getTime())) {
    return new Intl.DateTimeFormat("en-US").format(date);
  }
}