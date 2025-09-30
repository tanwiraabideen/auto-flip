import Image from "next/image";
import fetchNewData from "./actions/webScraping";

export default function Home() {
  fetchNewData()
  return (<div>hello</div>);
}
