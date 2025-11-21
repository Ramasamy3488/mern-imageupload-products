import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function BookList() {
    const [books, setBooks] = useState([]);
    const [title, setTitle] = useState("");
    const navigate = useNavigate();

    const loadBooks = async () => {
        try{
           const res = await axios.get("http://localhost:8000/products")
           setBooks(res.data);
           console.log(res.data);
           
        }catch(err){
            console.log(err);
            
        }             
                  
    };

    useEffect(() => { loadBooks(); }, []);

    const deleteBook = async (id) => {
        await axios.delete(`http://localhost:8000/products/${id}`);
        loadBooks();
    };

    return (
        <div className="container mt-4">
            <h2>Book List</h2>

            <input
                className="form-control mb-3"
                placeholder="Search by title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <button className="btn btn-primary mb-3" onClick={() => navigate("/add")}>
                Add New Book
            </button>

          <div className="d-flex align-items-center">
                   <table className="table text-center table-bordered">
                <thead>
                    <tr>
                        <th>Image</th><th>Title</th><th>Author</th><th>Price</th><th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {books.map(b => (
                        <tr key={b._id}>
                             <td className="text-center align-middle">
                                {b.image ? (
                                    <img src={b.image} className="mx-auto d-block rounded" width={100} height={100} />
                                ) : (
                                    "No Image"
                                )}
                            </td>
                            <td className="text-center align-middle">{b.title}</td>
                            <td className="text-center align-middle">{b.author}</td>                        

                            <td className="text-center align-middle">{b.price}</td>
                            <td className="text-center align-middle">
                                <button className="btn btn-warning me-2"
                                    onClick={() => navigate(`/edit/${b._id}`)}>
                                    Edit
                                </button>

                                <button className="btn btn-danger"
                                    onClick={() => deleteBook(b._id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
          </div>
           
        </div>
    );
}

export default BookList;
