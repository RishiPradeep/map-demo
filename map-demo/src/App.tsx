import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:3000/login", {
        username: username,
        password: password,
      });
      console.log(response.data);
      sessionStorage.clear();
      sessionStorage.setItem("user", username);
      navigate("/map");
    } catch (error: any) {
      alert(error.error);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:3000/register", {
        username: username,
        password: password,
      });
      console.log(response.data);
      sessionStorage.clear();
      sessionStorage.setItem("user", username);
      navigate("/map");
    } catch (error: any) {
      alert(error.error);
    }
  };

  return (
    <>
      <div className="container mx-auto flex flex-col border-2 shadow-lg w-fit p-4 mt-8 gap-4 items-center">
        <div>LOGIN</div>
        <div>
          <input
            onChange={(e) => setUsername(e.target.value)}
            className="border-2"
            type="text"
            placeholder="username"
          />
        </div>
        <div>
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="border-2"
            type="password"
            name=""
            id=""
            placeholder="password"
          />
        </div>
        <div>
          <button
            onClick={handleSubmit}
            className="border-2 p-2 rounded-md m-4"
          >
            Login
          </button>
          <button
            onClick={handleRegister}
            className="border-2 p-2 rounded-md m-4"
          >
            Register
          </button>
        </div>
      </div>
    </>
  );
}
