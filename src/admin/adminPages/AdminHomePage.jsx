import style from '../../admin/adminStyles/Admin.module.css'
import AdminSideBar from '../adminComponents/AdminSideBar';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminHome() {

  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        console.log('Token:', token); // Debugging line

        if (!token) {
          toast.error('Unauthorized access. Please log in.');
          navigate('/admin/login');
          return;
        }

        const response = await axios.get('https://mental-space-foundation-api.onrender.com/admins/all-blogs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Blogs response data:', response.data); // Debugging line
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
      }
    };

    fetchBlogs();
  }, [navigate]);

  console.log('Blogs state:', blogs); // Debugging line
  return (
    <>

    <div className={style.componentContent}>
    <AdminSideBar/>

    <div className={style.headerContent}>

    <div className={style.Home}>
      
      <div className={style.postAnalyses}>
        <div className={style.homeDivs}>
            <h2 className={style.postTitle}>Blog</h2>
            <div className={style.postIcon}><span class="material-symbols-outlined">home</span></div>

            <h5 className={style.postView}>View All Blogs</h5>
            <h5 className={style.postTotal}>Total Blogs</h5>
            <h5 className={style.postAction}>Total Comments</h5>
        </div>

        <div className={style.homeDivs}>
            <h2 className={style.postTitle}>NewsLetters</h2>
            <div className={style.postIcon}><span class="material-symbols-outlined">home</span></div>

            <h5 className={style.postView}>Viewl All Newletters</h5>
            <h5 className={style.postTotal}>Total Read</h5>
            <h5 className={style.postAction}>Total Feedback</h5>
        </div>

        <div className={style.homeDivs}>
            <h2 className={style.postTitle}>Resources</h2>
            <div className={style.postIcon}><span class="material-symbols-outlined">home</span></div>

            <h5 className={style.postView}>Viewl All Resources</h5>
            <h5 className={style.postTotal}>Total Downloads</h5>
            <h5 className={style.postAction}>Total Share</h5>
        </div>

        <div className={style.homeDivs}>
            <h2 className={style.postTitle}>Events</h2>
            <div className={style.postIcon}><span class="material-symbols-outlined">home</span></div>

            <h5 className={style.postView}>View All Events</h5>
            <h5 className={style.postTotal}>Total Events</h5>
            <h5 className={style.postAction}>Events Status: Pending 10 Accomplished 50</h5>
        </div>
      </div>

      <div className={style.others}>
      <div className={style.homeDivs}>
            <h2 className={style.postTitle}>Volunteers</h2>
            <div className={style.postIcon}><span class="material-symbols-outlined">home</span></div>

            <h5 className={style.postView}>View All Volunteers</h5>
            <h5 className={style.postTotal}>Total Volunteers</h5>
            <h5 className={style.postAction}>Total Comments</h5>
        </div>

        <div className={style.homeDivs}>
            <h2 className={style.postTitle}>Subscribers</h2>
            <div className={style.postIcon}><span class="material-symbols-outlined">home</span></div>

            <h5 className={style.postView}>View All Subscribers</h5>
            <h5 className={style.postTotal}>Total Subscribers</h5>
            <h5 className={style.postAction}>Total Comments</h5>
        </div>

        <div className={style.homeDivs}>
            <h2 className={style.postTitle}>Donations</h2>
            <div className={style.postIcon}><span class="material-symbols-outlined">home</span></div>

            <h5 className={style.postView}>Viewl All Donations</h5>
            <h5 className={style.postTotal}>Total Number Of Donations</h5>
            <h5 className={style.postAction}>Total Amount Received:</h5>
        </div>
      </div>

    </div>
    
    </div>

    </div>

    </>
  );
}

export default AdminHome;
