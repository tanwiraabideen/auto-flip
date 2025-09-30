import Image from "next/image";
import fetchNewData from "../../lib/actions/webScraping";

export default function Home() {
  fetchNewData()
  return (<div>hello</div>);
}
