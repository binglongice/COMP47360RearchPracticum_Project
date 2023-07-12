import React, { useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//requires npm install react-datepicker

export default function TableDatePicker() {
 const [date, setDate] = useState(new Date());

 return (
    <div>
    <DatePicker
    showTimeSelect
    dateFormat="MMMM d, yyyy h:mmaa"
    selected={date}
    onChange={date => {
      setDate(date);
      console.log(date.toString())
   }}
    />
    </div>
 );
}


