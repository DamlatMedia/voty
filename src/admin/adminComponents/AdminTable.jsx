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
        </table>
      </div>
    </div>
  );
};

export default Transactions;
