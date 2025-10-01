import Filters from "../components/Filters";

export default function page() {
    return (
        <div id="main-container" className="w-full h-full">
            <div id="filters-wrapper" className="flex items-center justify-center">
                <Filters></Filters>
            </div>
        </div>
    )
}