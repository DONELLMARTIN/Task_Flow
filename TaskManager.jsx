import { useState, useEffect } from "react";

function TaskMan() {

    const [task, setTask] = useState("");
    const [date, setDate] = useState("");
    const [priority, setPriority] = useState("");
    const [reminder, setReminder] = useState("");
    const [customDate, setCustomDate] = useState("");

    const [tasks, setTasks] = useState([]);
    const [editId, setEditId] = useState(null);
    const [filter, setFilter] = useState("All");

    const [mode, setMode] = useState("create"); // 🔹 control view

    const token = localStorage.getItem("token");

    // LOAD TASKS
    const loadTasks = async () => {
        const res = await fetch("http://localhost:5000/tasks", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });
        const data = await res.json();
        setTasks(data);
    };

    useEffect(() => {
        loadTasks();
    }, []);

    // ADD / UPDATE
    const addTask = async () => {

        if (task.trim() === "") {
            alert("Enter a task");
            return;
        }

        const url = editId
            ? `http://localhost:5000/tasks/${editId}`
            : "http://localhost:5000/tasks";

        const method = editId ? "PUT" : "POST";

        await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                title: task,
                date,
                priority: priority || "Low",
                reminder: reminder || "None",
                customDate,
                status: "Pending"
            })
        });

        // reset
        setTask("");
        setDate("");
        setPriority("");
        setReminder("");
        setCustomDate("");
        setEditId(null);

        loadTasks();
    };

    // DELETE
    const deleteTask = async (id) => {
        await fetch(`http://localhost:5000/tasks/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        loadTasks();
    };

    // STATUS
    const updateStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === "Pending" ? "Done" : "Pending";

        await fetch(`http://localhost:5000/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ status: newStatus })
        });

        loadTasks();
    };

    // EDIT
    const handleEdit = (t) => {
        setEditId(t._id);
        setTask(t.title);
        setDate(t.date);
        setPriority(t.priority);
        setReminder(t.reminder);
        setCustomDate(t.customDate);
        setMode("create"); // volta ao form
    };

    // FILTER
    const filteredTasks = tasks.filter(t => {
        if (filter === "All") return true;
        return t.status === filter;
    });

    return (
        <div className="task-container">

            {/* 🔹 CREATE MODE */}
            {mode === "create" && (
                <>
                    <h2>{editId ? "Edit Task" : "Create Task"}</h2>

                    <div className="form">
                        <input
                            placeholder="Task"
                            value={task}
                            onChange={(e) => setTask(e.target.value)}
                        />

                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />

                        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                            <option value="">Priority</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>

                        {/* 🔔 REMINDER */}
                        <select value={reminder} onChange={(e) => setReminder(e.target.value)}>
                            <option value="">Reminder</option>
                            <option value="Daily">Daily</option>
                            <option value="Weekend">Weekend</option>
                            <option value="Custom">Custom</option>
                        </select>

                        {reminder === "Custom" && (
                            <input
                                type="date"
                                value={customDate}
                                onChange={(e) => setCustomDate(e.target.value)}
                            />
                        )}

                        <button onClick={addTask}>
                            {editId ? "Update Task" : "Add Task"}
                        </button>

                        <button onClick={() => setMode("view")}>
                            View Tasks
                        </button>
                    </div>
                </>
            )}

            {/* 🔹 VIEW MODE */}
            {mode === "view" && (
                <>
                    <h2>Your Tasks</h2>

                    <button onClick={() => setMode("create")}>
                        ← Back
                    </button>

                    <div className="filters">
                        <button onClick={() => setFilter("All")}>All</button>
                        <button onClick={() => setFilter("Pending")}>Pending</button>
                        <button onClick={() => setFilter("Done")}>Done</button>
                    </div>

                    <ul className="task-list">
                        {filteredTasks.map(t => (
                            <li key={t._id}>
                                <strong>{t.title}</strong><br />
                                📅 {t.date || "No date"} <br />
                                ⚡ {t.priority} <br />
                                🔔 {t.reminder} {t.customDate && `(${t.customDate})`} <br />
                                Status: {t.status} <br />

                                <button onClick={() => handleEdit(t)}>
                                    Edit
                                </button>

                                <button onClick={() => updateStatus(t._id, t.status)}>
                                    {t.status === "Pending" ? "Done" : "Undo"}
                                </button>

                                <button onClick={() => deleteTask(t._id)}>
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}

export default TaskMan;
