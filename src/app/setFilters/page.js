
export default function page() {
    return (
        <div id="main-container" className="w-full h-full">
            <div id="filters-wrapper" className="flex items-center justify-center">
                <div id="filters-container" className="">
                    <select defaultValue="Make" className="select">
                        <option disabled={true}>Make</option>
                    </select>
                </div>
            </div>
        </div>
    )
}