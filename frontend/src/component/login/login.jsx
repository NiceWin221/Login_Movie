import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from 'react-toastify';
import Cookie from "js-cookie"
import "./login.css"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const sendLogin = async (e) => {
    e.preventDefault()
    const data = { username: username, password: password }
    const dataForm = JSON.stringify(data)

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: dataForm,
        credentials: "include"
      })

      if (!response.ok) {
        console.log(`HTTP error! Status: ${response.status}`)
        toast.error("Login failed!")
      } else {
        const result = await response.json()
        Cookie.set("statusLogin", "true", { expires: 7 })
        console.log("Login successfull:", result)
        toast.success("Login success!")
        navigate("/dashboard")
      }
    } catch (err) {
      console.error(err)
      toast.error("Invalid username or password!")
    }
  }

  return (
    <div className="container">
      <h1>Login</h1>
      <form action="/login" method="post" onSubmit={sendLogin}>
        <div className="input-container">
          <label htmlFor="name">Username</label>
          <input
            onChange={(e) => { setUsername(e.target.value) }}
            type="text"
            name="name"
            id="name"
            value={username}
            placeholder="Enter your name"
            required />
        </div>
        <div className="input-container">
          <label htmlFor="password">Password</label>
          <input
            onChange={(e) => { setPassword(e.target.value) }}
            type="password"
            name="password"
            id="password"
            value={password}
            placeholder="Enter your password"
            required />
        </div>
        <button type="submit" className="login">LOGIN</button>
      </form>
      <div className="register">
        <p>Don't have an account? <a href="/register">Sign up</a></p>
      </div>
    </div>
  )
}

export default Login