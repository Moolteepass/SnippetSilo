import { useState, useEffect } from "react"
import Airtable from "airtable"
import "./App.css"
import Card from "./components/Card"

function App() {
  const [data, setData] = useState([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    // Load data from localStorage or fetch it
    if (localStorage.getItem("cachedData") !== null) {
      console.log("cachedData exists, loading now")
      setData(JSON.parse(localStorage.getItem("cachedData")))
    } else {
      console.log("cachedData does not exist, fetching now")
    }

    const fetchData = async () => {
      console.log("cachedData does not exist, fetching now")
      var base = new Airtable({
        apiKey:
          "patGrTqLMArSkLwSf.28b21052d73212484e726c2573b482facab396c5f5dc83919af2e484611cc6b4",
      }).base("appOOlZ2AISbHpbVb")

      let allRecords = []

      base("All Clips")
        .select({
          fields: ["Title", "URL", "ImageURL", "Rating", "Tags"],
          sort: [{ field: "ID", direction: "desc" }],
        })
        .eachPage(
          function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.

            records.forEach(function (record) {
              allRecords.push(record.fields)
            })

            // To fetch the next page of records, call `fetchNextPage`.
            // If there are more records, `page` will get called again.
            // If there are no more records, `done` will get called.
            fetchNextPage()
          },
          function done(err) {
            if (err) {
              console.error(err)
              return
            }
            setData(allRecords)
            localStorage.setItem("cachedData", JSON.stringify(allRecords))
            console.log("fetchResult", allRecords)
          }
        )
    }

    fetchData()
  }, []) // Removed data from dependency array

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const filteredData = data.filter((item) => {
    // Convert search term to lowercase for case-insensitive comparison
    const searchTerm = search.toLowerCase()

    // Check if the search term is in the 'Title' field
    const titleMatch =
      item.Title && item.Title.toLowerCase().includes(searchTerm)

    // Check if the search term is in the 'Tags' field (assuming 'Tags' is an array of strings)
    const tagsMatch =
      item.Tags &&
      item.Tags.some((tag) => tag.toLowerCase().includes(searchTerm))

    // Return true if the item matches the search term in either 'Title' or 'Tags'
    return titleMatch || tagsMatch
  })

  return (
    <div className="App">
      <div className="Header-Container">
        <input
          type="text"
          placeholder={`(Version 2.3) ${filteredData.length} records`}
          value={search}
          onChange={handleSearchChange} // Use the handleSearchChange here
        />
      </div>
      <div className="Grouped-Tags-Container">{/* ... other code ... */}</div>
      <div className="Card-Container">
        {filteredData.map((item, index) => (
          <Card key={index} data={item} />
        ))}
      </div>
    </div>
  )
}

export default App
