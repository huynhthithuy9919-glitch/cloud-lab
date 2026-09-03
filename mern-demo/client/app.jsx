import "./style.css";
import { useEffect, useState } from "react";

export default function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Câu 48: State cho form
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Câu 47: Lấy danh sách sinh viên
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

  // Câu 49: Thêm sinh viên
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

      // Thêm sinh viên mới vào danh sách
      setStudents((prevStudents) => [
        ...prevStudents,
        newStudent,
      ]);

      // Xóa dữ liệu trong form
      setStudentId("");
      setName("");
      setEmail("");

      alert("Thêm sinh viên thành công!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>🎓 Quản Lý Sinh Viên</h1>
          <p>MERN Student Management</p>
        </div>

        <div className="badge">MERN APP</div>
      </header>

      <main className="container">

        {/* Tiêu đề */}
        <div className="title-row">
          <div>
            <h2>Danh sách sinh viên</h2>
            <p>
              Thông tin được lấy từ MongoDB Atlas thông qua Backend API
            </p>
          </div>

          <div className="count">
            <strong>{students.length}</strong>
            <span>Sinh viên</span>
          </div>
        </div>

        {/* Câu 48 + Câu 49: Form thêm sinh viên */}
        <form className="card" onSubmit={handleSubmit}>
          <h2>➕ Thêm sinh viên</h2>

          <input
            type="text"
            placeholder="MSSV"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />

          <input
            type="text"
            placeholder="Họ tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit">
            Thêm sinh viên
          </button>
        </form>

        {/* Trạng thái loading */}
        {loading && (
          <div className="message">
            ⏳ Đang tải danh sách sinh viên...
          </div>
        )}

        {/* Thông báo lỗi */}
        {error && (
          <div className="error">
            ❌ {error}
            <br />
            <small>
              Kiểm tra Backend tại http://localhost:5000
            </small>
          </div>
        )}

        {/* Danh sách sinh viên */}
        {!loading && !error && (
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>MSSV</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                </tr>
              </thead>

              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty">
                      Chưa có sinh viên nào.
                    </td>
                  </tr>
                ) : (
                  students.map((student, index) => (
                    <tr key={student._id || index}>
                      <td>{index + 1}</td>

                      <td>
                        <span className="student-id">
                          {student.studentId}
                        </span>
                      </td>

                      <td>{student.name}</td>

                      <td>{student.email}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

      </main>
    </div>
  );
}