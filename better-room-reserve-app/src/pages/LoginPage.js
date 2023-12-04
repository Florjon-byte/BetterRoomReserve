import { useState } from "react";
import "../cssfiles/login.css";
import { getToken, setToken } from "../token"
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    try {
      const endpoint = "http://localhost:8000/login";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      const data = await response.json();
      console.log(data);

      if(data.token !== null){
        setToken(data.token)
        navigate("/")
      }else{
        console.log("User does not exist. Please try again.")
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div class="login">
      <html>
        <head>
          <link rel="preconnect" href="https://fonts.gstatic.com%22" />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;600&display=swap"
            rel="stylesheet"
          />
        </head>
        <body>
          <div class="background">
            <div class="shape"></div>
            <div class="shape"></div>
          </div>
          <form class="form" onSubmit={handleSubmit}>
            <h3>Login Here</h3>

            <label class="label" for="email">
              Email
            </label>
            <input
              class="input"
              type="text"
              name="email"
              placeholder="Email"
              id="email"
              maxlength="40"
              required
              onChange={(e) => {
                setEmail(e.target.value);
                console.log(email);
              }}
            />

            <label class="label" for="password">
              Password
            </label>
            <input
              class="input"
              type="password"
              name="password"
              placeholder="Password"
              id="password"
              maxlength="40"
              required
              onChange={(e) => {
                setPassword(e.target.value);
                console.log(password);
              }}
            />

            <button class="button" type="submit" value="Login">
              Log In
            </button>
          </form>
        </body>
      </html>
    </div>
  );
}
