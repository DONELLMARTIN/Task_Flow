import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [profile, setProfile] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        //validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            alert("Invalid email");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        if (phone.length < 9) {
            alert("Invalid phone number");
            return;
        }

        if (!profile) {
            alert("Please select a role");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    phone,
                    profile
                })
            });

            let data;
            try {
                data = await res.json();
            } catch {
                data = { message: "Invalid server response" };
            }
            if (res.ok) {
                alert("Registered successfully!");
                navigate("/Dashboard");
            } else {
                alert(data.message || "Registration failed");
            }

        } catch (err) {
            console.error("REGISTER ERROR:", err);
            alert("Error connecting to server");
        }
    };
    return (
        <div className="container">
            <h2>Register</h2>

            <form onSubmit={handleRegister} className="form">
                <input
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                ></input>
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

                <input
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />

                <select
                    value={profile}
                    onChange={(e) =>setProfile(e.target.value)}
                    required
                >
                    <option value="">Select Role</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                </select>

                <div className="btn-group">
                    <button type="submit">Register</button>
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

export default Register;
