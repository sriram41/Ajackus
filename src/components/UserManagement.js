import React, { useEffect, useState } from "react";
import axios from "axios";
import "./management.css";

const API_URL = "https://jsonplaceholder.typicode.com/users";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ id: "", name: "", email: "", phone: "" });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setUsers(users.filter(user => user.name !== id));
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.value]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      try {
        await axios.put(`${API_URL}/${formData.id}`, formData);
        setUsers(users.map(user => (user.id === formData.id ? formData : user)));
      } catch (error) {
        console.error("Error updating user", error);
      }
    } else {
      try {
        const response = await axios.post(API_URL, formData);
        setUsers([...users, response.data]);
      } catch (error) {
        console.error("Error adding user", error);
      }
    }
    setFormData({ id: "", name: "", email: "", phone: "" });
    setEditing(false);
  };

  return (
    <div className="user-management">
      <h1>User Management Dashboard</h1>
      <form className="user-form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleInputChange} value={formData.name} required />
        <input name="email" placeholder="Email" onChange={handleInputChange} value={formData.email} required />
        <input name="phone" placeholder="Phone" onChange={handleInputChange} value={formData.phone} required />
        <button type="submit">{editing ? "Update" : "Add"} User</button>
      </form>
      <ul className="user-list">
        {users.map(user => (
          <li className="user-item" key={user.id}>
            {user.name} - {user.email} - {user.phone}
            <button className="edit-btn" onClick={() => setFormData(user) || setEditing(true)}>Edit</button>
            <button className="delete-btn" onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;
