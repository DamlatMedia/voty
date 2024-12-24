import React, { useState } from 'react';
import style from '../../admin/adminStyles/Admin.module.css';
import AdminSideBar from '../adminComponents/AdminSideBar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

function AdminUploadBlogs() {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    image: null, // Image should be null initially
    title: '',
    summary: '',
    author: '',
    contents: '', // Corrected typo (should be 'contents')
    date: '',
  });

  // Hook to navigate programmatically
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
  
    if (name === 'image') {
      // Log the file object to ensure it's being captured correctly
      console.log('Selected file:', files[0]);
  
      setFormData({
        ...formData,
        image: files[0], // Store the file object for uploading
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    data.append('image', formData.image); // Ensure 'image' field is added correctly
    data.append('title', formData.title);
    data.append('summary', formData.summary);
    data.append('author', formData.author);
    data.append('contents', formData.contents);
  
    // Debugging: Log all FormData entries to verify correctness
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }
  
    try {
      const response = await axios.post('https://mental-space-foundation-api.onrender.com/api/blogs/blog-upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
   
      // try {
      //   const response = await axios.post('http://localhost:5000/api/blogs/blog-upload', data, {
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //     },
      //   });
  
      toast.success(response.data.message);
      setTimeout(() => {
        navigate('/admin/blogs');
      }, 2000);
    } catch (error) {
      console.error('Server Error:', error.response?.data); // Log the detailed error
      toast.error(error.response?.data?.message || 'Blog upload failed!');
    }
  };
  
  return (
    <>
      <div className={style.componentContent}>
        <AdminSideBar />

        <div className={style.headerContent}>
  
          <form onSubmit={handleSubmit}>
            <div className={style.blogUpload}>
              <div className={style.textInputs}>
                <h3 className={style.titles}>Blog Title</h3>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter the title of your blog"
                  className={style.input}
                />
              </div>

              <div className={style.textInputs}>
                <h3>Blog Summary</h3>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  required
                  className={style.input}
                  placeholder="Enter the summary of your blog"
                ></textarea>
              </div>

              { <div className={style.textInputs}>
                <h3>Choose Image</h3>
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  required
                  accept="image/*"
                />
              </div> }

              <div className={style.textInputs}>
                <h3>Author</h3>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  placeholder="Author Name"
                  className={style.input}
                />
              </div>

              <div className={style.textInputs}>
                <h3>Write Your Content</h3>
                <textarea
                  name="contents"
                  value={formData.contents}
                  onChange={handleChange}
                  required
                  className={style.input}
                  placeholder="Enter the contents of your blog"
                ></textarea>
              </div>

              <button type="submit" className={style.button}>UPLOAD BLOG</button>
            </div>
          </form>
        </div>
        
      </div>
    </>
  );
}

export default AdminUploadBlogs;
