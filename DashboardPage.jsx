import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import TaskMan from "./TaskManager";

function Dashboard() {
    const navigate = useNavigate();

    const [view, setView] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token"); // 🔐 GET TOKEN

    // 🔐 PROTECT ROUTE
    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    return (
        <div className="container">
            <h2>Welcome {user?.name}</h2>

            {/* menu */}
            {view === "" && (
                <div className="btn-group">
                    <button onClick={() => setView("create")}>
                        ➕ New Task
                    </button>
                    <button onClick={() => setView("view")}>
                        📋 View Tasks
                    </button>
                    <button
                        className="secondary"
                        onClick={() => {
                            localStorage.removeItem("user");
                            localStorage.removeItem("token"); // 🔐 remove token também
                            navigate("/");
                        }}>
                        Logout
                    </button>
                </div>
            )}

            {view === "create" && <TaskMan />}

            {view === "view" && (
                <div>
                    <h3>Your Tasks</h3>
                    <p>No tasks yet...</p>
                    <button onClick={() => setView("")}>← Back</button>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
