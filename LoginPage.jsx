import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Please fill all fields");
            return;
        }
        try {
            const res = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await res.json();

            if (res.status === 200) {

                //save user
localStorage.setItem("user", JSON.stringify(data.user));
localStorage.setItem("token", data.token); 
                navigate("/dashboard");
            } else {
                alert(data.message);
            }

        } catch (err) {
            console.error(err);
            alert("Error logging in");
        }
    };

    return (
        <div className="container">
            <h2>Login</h2>

            <form onSubmit={handleLogin} className="form">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                ></input>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                ></input>
                <div className="btn-group">
                    <button type="submit">Login</button>

                    <button
                        type="button"
                        className="secondary"
                        onClick={() => navigate("/")}>
                        ← Back
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Login;
