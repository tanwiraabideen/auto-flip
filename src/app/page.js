"use client"

import Image from "next/image";
import fetchNewData from "../../lib/actions/webScraping";
import { redirect } from "next/navigation";

export default function Home() {

  // fetchNewData()
  return (<div>
    Welcome to Auto Flip
    <button className="bg-blue-600 mx-20 p-2 rounded-xl" onClick={() => redirect('/setFilters')}>Create a filter</button>
  </div>);
}
