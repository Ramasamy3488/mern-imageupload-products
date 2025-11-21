import React, { useRef, useState } from 'react'
import axios from 'axios';

function Fileupload() {
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const fileInput = useRef();
  
  const saveFile = () => {
    setFile(fileInput.current.files[0]);
    setFileName(fileInput.current.files[0].name)
  }

  const uploadFile = async () =>{
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);

    try {
      const res = await axios.post("http://localhost:8000/upload", formData);
      setMessage(res.data.message);

      setTimeout(()=> setMessage(""), 3000);

      fileInput.current.value = "";
      setTitle("");
      setDescription("");
      setPrice("");

    } catch (err) {
      if(err.response){
        setMessage(err.response.data.message);
      } else {
        setMessage("server error!!!");
      }

      setTimeout(()=> setMessage(""), 3000);
    }
  }

  return (
    <div className='mt-5'>
        <input type="text" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} /><br/>
        <input type="text" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} /><br/>
        <input type="number" placeholder="Price" value={price} onChange={e=>setPrice(e.target.value)} /><br/>

        <input type="file" ref={fileInput}  onChange={saveFile}/>
        <button onClick={uploadFile}>Upload</button>

        {message && <p>{message}</p>}
    </div>
  )
}

export default Fileupload;
