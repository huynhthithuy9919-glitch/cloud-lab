import { useEffect, useState } from "react";
import "./style.css";

// Gọi API qua Nginx Reverse Proxy
const API_URL = "/api/students";

function App() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Tải danh sách sinh viên
  const fetchStudents = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Không tải được danh sách (HTTP ${response.status})`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Dữ liệu API trả về không đúng định dạng.");
      }

      setStudents(data);
    } catch (err) {
      setError(
        `${err.message}. Vui lòng kiểm tra Backend và cấu hình Nginx Reverse Proxy.`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Xóa dữ liệu trong form
  const resetForm = () => {
    setStudentId("");
    setName("");
    setEmail("");
    setEditingId(null);
  };

  // Thêm hoặc cập nhật sinh viên
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    const studentData = {
      studentId: studentId.trim(),
      name: name.trim(),
      email: email.trim(),
    };

    if (!studentData.studentId || !studentData.name || !studentData.email) {
      setError("Vui lòng nhập đầy đủ mã sinh viên, họ tên và email.");
      return;
    }

    setSaving(true);

    try {
      const isEditing = editingId !== null;

      // Khi sửa, gọi URL có ID; khi thêm, gọi URL danh sách
      const url = isEditing
        ? `${API_URL}/${encodeURIComponent(editingId)}`
        : API_URL;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(
          detail || `Không thể lưu sinh viên (HTTP ${response.status})`
        );
      }

      setMessage(
        isEditing
          ? "Cập nhật sinh viên thành công!"
          : "Thêm sinh viên thành công!"
      );

      resetForm();
      await fetchStudents();
    } catch (err) {
      setError(`Lưu dữ liệu thất bại: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Đưa thông tin sinh viên lên form để sửa
  const handleEdit = (student) => {
    setStudentId(student.studentId || "");
    setName(student.name || "");
    setEmail(student.email || "");
    setEditingId(student._id);

    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Xóa sinh viên
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa sinh viên này không?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(
          detail || `Không thể xóa sinh viên (HTTP ${response.status})`
        );
      }

      if (editingId === id) {
        resetForm();
      }

      setMessage("Xóa sinh viên thành công!");
      await fetchStudents();
    } catch (err) {
      setError(`Xóa sinh viên thất bại: ${err.message}`);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">🎓</div>
          <div>
            <h1>Quản Lý Sinh Viên</h1>
            <p>MERN Student Management · Version 4.0</p>
          </div>
        </div>
      </header>

      <main className="main-content">
        <section className="form-card">
          <div className="section-heading">
            <div>
              <h2>{editingId ? "✏️ Cập nhật sinh viên" : "➕ Thêm sinh viên"}</h2>
              <p>Nhập thông tin sinh viên bên dưới.</p>
            </div>
          </div>

          {error && (
            <div className="alert alert-error" role="alert">
              <span>❌</span>
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="alert alert-success" role="status">
              <span>✅</span>
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="studentId">Mã sinh viên</label>
              <input
                id="studentId"
                type="text"
                placeholder="Ví dụ: SV001"
                value={studentId}
                onChange={(event) => setStudentId(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Họ và tên</label>
              <input
                id="name"
                type="text"
                placeholder="Nhập họ và tên"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving
                  ? "Đang lưu..."
                  : editingId
                    ? "💾 Cập nhật"
                    : "➕ Thêm sinh viên"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Hủy sửa
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="list-card">
          <div className="section-heading list-heading">
            <div>
              <h2>📋 Danh sách sinh viên</h2>
              <p>
                Tổng số: <strong>{students.length}</strong> sinh viên
              </p>
            </div>

            <button
              type="button"
              className="btn btn-refresh"
              onClick={fetchStudents}
              disabled={loading}
            >
              {loading ? "Đang tải..." : "🔄 Tải lại"}
            </button>
          </div>

          {loading && students.length === 0 ? (
            <div className="empty-state">
              <p>⏳ Đang tải danh sách sinh viên...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>Chưa có sinh viên</h3>
              <p>Hãy thêm sinh viên đầu tiên bằng biểu mẫu phía trên.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã sinh viên</th>
                    <th>Họ và tên</th>
                    <th>Email</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student, index) => (
                    <tr key={student._id || student.studentId || index}>
                      <td>{index + 1}</td>
                      <td>
                        <span className="student-id">
                          {student.studentId || "—"}
                        </span>
                      </td>
                      <td className="student-name">
                        {student.name || "—"}
                      </td>
                      <td>{student.email || "—"}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="btn btn-edit"
                            onClick={() => handleEdit(student)}
                          >
                            ✏️ Sửa
                          </button>

                          <button
                            type="button"
                            className="btn btn-delete"
                            onClick={() => handleDelete(student._id)}
                            disabled={!student._id}
                          >
                            🗑️ Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="app-footer">
          <p>
            MERN Stack · React · Node.js · Express · MongoDB
          </p>
          <p>Frontend 3.0 · Nginx Reverse Proxy</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
