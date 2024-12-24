import style from '../../admin/adminStyles/Admin.module.css';
import AdminSideBar from '../adminComponents/AdminSideBar';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Preloader } from '../adminFunctions/preloader.js';

function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        console.log('Token:', token);

        if (!token) {
          toast.error('Unauthorized access. Please log in.');
          navigate('/login');
          return;
        }

        const response = await axios.get('https://mental-space-foundation-api.onrender.com/api/blogs/all-blogs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // const response = await axios.get('http://localhost:5000/api/blogs/all-blogs', {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });

        console.log('Blogs response data:', response.data);
        if (response.data && Array.isArray(response.data.blogData)) {
          setBlogs(response.data.blogData);
        } else {
          toast.error('Unexpected response format.');
          console.error('Unexpected response format:', response.data);
        }

        toast.success('Blogs loaded successfully!');
      } catch (error) {
        toast.error('Error fetching blogs');
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    // Delay fetching for demonstration purposes
    setTimeout(fetchBlogs, 3000);
  }, [navigate]);

  return (
    <>
      <div className={style.componentContent}>
        <AdminSideBar />
        <div className={style.headerContent}>
          <div>
            {loading ? (
              <Preloader /> // Use the Preloader component here
            ) : (
              <table border="1" cellPadding="10" cellSpacing="0" className={style.table}>
                <thead>
                  <tr className={style.tr}>
                    <th className={style.thb}>S/N</th>
                    <th className={style.thb}>Title</th>
                    <th className={style.thb}>Summary</th>
                    <th className={style.thb}>Image</th>
                    <th className={style.thb}>Author</th>
                    <th className={style.thb}>Contents</th>
                    <th className={style.thb}>Status</th>
                    <th className={style.thb}>Approve</th>
                    <th className={style.thb}>Edit</th>
                    <th className={style.thb}>Delete</th>
                    <th className={style.thb}>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.length > 0 ? (
                    blogs.map((blog, index) => (
                      <tr key={index} className={style.tr}>
                        <td className={style.tdb}>{index + 1}</td>
                        <td className={style.tdb}>{blog.title}</td>
                        <td className={style.tdb}>{blog.summary}</td>
                        <td className={style.tdb}>
                          <img
                            src={`https://mental-space-foundation-api.onrender.com/${blog.image}`}
                            alt={blog.title}
                            style={{ width: '50px' }}
                          /> 
                          {/* <img
                            src={`http://localhost:5000/${blog.image}`}
                            alt={blog.title}
                            style={{ width: '50px' }}
                          />  */}
                        </td>
                        <td className={style.tdb}>{blog.author}</td>
                        <td className={style.tdb}>{blog.contents}</td>
                        <td className={style.tdb}>{blog.status}</td>
                        <td className={style.tdb}>{blog.approve}</td>
                        <td className={style.tdb}>
                          <button>Edit</button>
                        </td>
                        <td className={style.tdb}>
                          <button>Delete</button>
                        </td>
                        <td className={style.tdb}>{blog.comments}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className={style.tdb}>No blogs available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminBlogs;
