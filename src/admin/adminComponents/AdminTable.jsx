import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "../adminStyles/dashboard.module.css";

const Transactions = () => {
  return (
    <div className={style.container}>
      {/* Blur Effect when form is open */}
      <div>
        <br />

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>Gender</th>
              <th>School</th>
              <th>Date</th>
              <th>Leaderboard</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Emmanuel Favour</td>
              <td>emmanuelfavour@gmail.com</td>
              <td>09067455558</td>
              <td>Female</td>
              <td>Ctadel Model School, Ajah</td>
              <td>05/01/2024</td>
              <td className={style.lea}>1</td>
               </tr>
          </tbody>
         
            {/* <tr>
              <td data-label="Name">Emmanuel Favour</td>
              <td data-label="Email Address">emmanuelfavour@gmail.com</td>
              <td data-label="Phone Number">09067455558</td>
              <td data-label="Gender">Female</td>
              <td data-label="School">Citadel Model School, Ajah</td>
              <td data-label="Date">05/01/2024</td>
              <td className={style.lea} data-label="Leaderboard">
                1
              </td>
            </tr>
          </tbody> */}
        </table>
      </div>
    </div>
  );
};

export default Transactions;
