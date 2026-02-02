import { useState } from "react";
import { changeStudentPassword } from "../../Services/studentService";

function ChangePassword() {

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  const handleChangePassword = async () => {

    if (!oldPassword || !newPassword) {
      alert("All fields required");
      return;
    }

    try {
      const result = await changeStudentPassword(oldPassword, newPassword, token);

      if (result.status === "success") {
        alert("Password changed successfully");
        setOldPassword("");
        setNewPassword("");
      } else {
        alert(result.error);
      }

    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 450 }}>

      <h3>Change Password</h3>

      <input
        className="form-control mb-2"
        type="password"
        placeholder="Old Password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />

      <input
        className="form-control mb-3"
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <button
        className="btn btn-primary w-100"
        onClick={handleChangePassword}
      >
        Update Password
      </button>

    </div>
  );
}

export default ChangePassword;
