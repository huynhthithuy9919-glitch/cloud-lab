import "./style.css";
import { useEffect, useState } from "react";

export default function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form thêm sinh viên
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // =========================
  // C47 - Lấy danh sách sinh viên
  // =========================
  useEffect(() => {
    fetch("/api/students")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Không thể lấy danh sách sinh viên");
        }
        return res.json();
      })
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // =========================
  // C49 - Thêm sinh viên
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentId || !name || !email) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          name,
          email,
        }),
      });

      if (!res.ok) {
        throw new Error("Thêm sinh viên thất bại");
      }

      const newStudent = await res.json();

      setStudents((prevStudents) => [
        ...prevStudents,
        newStudent,
      ]);

      // Xóa dữ liệu form
      setStudentId("");
      setName("");
      setEmail("");

      alert("Thêm sinh viên thành công!");
    } catch (err) {
      alert(err.message);
    }
  };

  // =========================
  // C61 - Sửa sinh viên
  // =========================
  const handleUpdate = async (student) => {
    const newName = prompt(
      "Nhập họ tên mới:",
      student.name
    );

    if (newName === null || newName.trim() === "") {
      return;
    }

    const newEmail = prompt(
      "Nhập email mới:",
      student.email
    );

    if (newEmail === null || newEmail.trim() === "") {
      return;
    }

    try {
      const res = await fetch(
        `/api/students/${student._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newName,
            email: newEmail,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(
          "Cập nhật sinh viên thất bại"
        );
      }

      const updatedStudent = await res.json();

      setStudents((prevStudents) =>
        prevStudents.map((s) =>
          s._id === updatedStudent._id
            ? updatedStudent
            : s
        )
      );

      alert("Cập nhật sinh viên thành công!");
    } catch (err) {
      alert(err.message);
    }
  };

  // =========================
  // C62 - Xóa sinh viên
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa sinh viên này không?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const res = await fetch(
        `/api/students/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error(
          "Xóa sinh viên thất bại"
        );
      }

      // Xóa sinh viên khỏi giao diện
      setStudents((prevStudents) =>
        prevStudents.filter(
          (student) => student._id !== id
        )
      );

      alert("Xóa sinh viên thành công!");
    } catch (err) {
      alert(err.message);
    }
  };

  // =========================
  // Giao diện
  // =========================
  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <div>
          <h1>🎓 Quản Lý Sinh Viên</h1>
          <p>MERN Student Management</p>
        </div>

        <div className="badge">
          MERN APP
        </div>
      </header>

      {/* MAIN */}
      <main className="container">

        {/* TIÊU ĐỀ */}
        <div className="title-row">
          <div>
            <h2>Danh sách sinh viên</h2>

            <p>
              Thông tin được lấy từ MongoDB Atlas
              thông qua Backend API
            </p>
          </div>

          <div className="count">
            <strong>
              {students.length}
            </strong>

            <span>Sinh viên</span>
          </div>
        </div>

        {/* FORM THÊM */}
        <form
          className="card"
          onSubmit={handleSubmit}
        >
          <h2>➕ Thêm sinh viên</h2>

          <input
            type="text"
            placeholder="MSSV"
            value={studentId}
            onChange={(e) =>
              setStudentId(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Họ tên"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <button type="submit">
            Thêm sinh viên
          </button>
        </form>

        {/* LOADING */}
        {loading && (
          <div className="message">
            ⏳ Đang tải danh sách sinh viên...
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="error">
            ❌ {error}
            <br />
            <small>
              Kiểm tra Backend tại
              http://localhost:5000
            </small>
          </div>
        )}

        {/* DANH SÁCH */}
        {!loading && !error && (
          <div className="table-card">

            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>MSSV</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Thao tác</th>
                </tr>
              </thead>

              <tbody>

                {students.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="empty"
                    >
                      Chưa có sinh viên nào.
                    </td>
                  </tr>
                ) : (

                  students.map(
                    (student, index) => (
                      <tr
                        key={
                          student._id || index
                        }
                      >
                        <td>
                          {index + 1}
                        </td>

                        <td>
                          <span className="student-id">
                            {student.studentId}
                          </span>
                        </td>

                        <td>
                          {student.name}
                        </td>

                        <td>
                          {student.email}
                        </td>

                        <td>

                          {/* NÚT SỬA */}
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdate(
                                student
                              )
                            }
                          >
                            ✏️ Sửa
                          </button>

                          {/* NÚT XÓA */}
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                student._id
                              )
                            }
                          >
                            🗑️ Xóa
                          </button>

                        </td>
                      </tr>
                    )
                  )

                )}

              </tbody>
            </table>

          </div>
        )}

      </main>
    </div>
  );
}