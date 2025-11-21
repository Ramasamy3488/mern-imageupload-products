import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddBook() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    price: ""
  });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    const fd = new FormData();

    fd.append("title", form.title);
    fd.append("author", form.author);
    fd.append("price", form.price);
    if (image) fd.append("image", image);

    await axios.post("http://localhost:8000/products", fd, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    navigate("/");
  };

  return (
    <div className="container mt-4">
      <h2>Add Book</h2>

      <input className="form-control mb-3" name="title" placeholder="Title" onChange={handleChange} />
      <input className="form-control mb-3" name="author" placeholder="Author" onChange={handleChange} />
      <input className="form-control mb-3" name="price" placeholder="Price" onChange={handleChange} />

      <input
        type="file"
        className="form-control mb-3"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button className="btn btn-success" onClick={save}>Save</button>
      <button className="btn btn-secondary ms-2" onClick={() => navigate("/")}>Cancel</button>
    </div>
  );
}

export default AddBook;
