import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", author: "", price: "", image: "" });
  const [image, setImage] = useState(null);

  // Load existing book
  const loadBook = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/products/${id}`);
      setForm(res.data.product || res.data);
    } catch (err) {
      console.error("Failed to load product:", err.response?.data || err.message);
    }
  };

  useEffect(() => { loadBook(); }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Update product
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("author", form.author);
      formData.append("price", form.price);
      if (image) formData.append("image", image);

      const res = await axios.put(`http://localhost:8000/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Updated product:", res.data.product);
      navigate("/");
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Book</h2>

      {form.image && (
        <img
          src={form.image.startsWith("http") ? form.image : `http://localhost:8000/uploads/${form.image}`}
          width="120"
          className="mb-3"
          alt="Product"
        />
      )}

      <input
        className="form-control mb-3"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
      />
      <input
        className="form-control mb-3"
        name="author"
        value={form.author}
        onChange={handleChange}
        placeholder="Author"
      />
      <input
        className="form-control mb-3"
        name="price"
        value={form.price}
        onChange={handleChange}
        placeholder="Price"
      />

      <input
        type="file"
        className="form-control mb-3"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button className="btn btn-primary" onClick={handleUpdate}>Update</button>
      <button className="btn btn-secondary ms-2" onClick={() => navigate("/")}>Cancel</button>
    </div>
  );
}

export default EditBook;
