import { useState, useEffect } from "react"
import "./App.css"
import Card from "./components/Card"

function App() {
  /* Initial variables */
  const [data, setData] = useState([])
  const [search, setSearch] = useState("")
  const [tags, setTags] = useState([])
  const [selectedTag, setSelectedTag] = useState([])

  useEffect(() => {
    /* Fetch Variables */
    const baseID = "appOOlZ2AISbHpbVb"
    const tableName = "All Clips"
    const AIRTABLE_API_KEY =
      "patGrTqLMArSkLwSf.28b21052d73212484e726c2573b482facab396c5f5dc83919af2e484611cc6b4"

    /* Function to recursively fetch all records */
    const fetchAllRecords = (offset, allRecords = []) => {
      let fetchURL = `https://api.airtable.com/v0/${baseID}/${tableName}`

      if (offset) {
        fetchURL += `?offset=${offset}`
      }

      fetch(fetchURL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const newRecords = allRecords.concat(data.records)

          if (data.offset) {
            // If there's an offset, more records are available, so fetch them
            fetchAllRecords(data.offset, newRecords)
          } else {
            // No more records, process data
            processData(newRecords)
          }
        })
    }

    /* Function to process data and sort tags */
    const processData = (records) => {
      console.log("Original data: ", records) // Log original data

      // Sort records by ID
      records.sort((a, b) => b.fields.ID - a.fields.ID)

      const processedData = records.map((item) => ({
        id: item.fields.ID,
        created: item.fields["Created Date"],
        title: item.fields.Title,
        image: item.fields.ImageURL,
        url: item.fields.URL,
        tags: item.fields.Tags,
        rating: item.fields.Rating,
      }))

      console.log("Processed data:", processedData) // Log processed data

      // Extract and sort unique tags from processed data
      const uniqueTags = Array.from(
        new Set(processedData.flatMap((item) => item.tags || []))
      ).sort()
      setTags(uniqueTags)
      console.log("Unique tags: ", uniqueTags)

      // Set your state with processed data
      setData(processedData)
    }

    // Initial call to start fetching records
    fetchAllRecords()
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const filteredData = data.filter((item) => {
    // Check if item title matches the search
    const matchesSearch = item.title
      .toLowerCase()
      .includes(search.toLowerCase())

    /// Check if all selected tags are present in the item's tags
    const matchesTags =
      selectedTag.length === 0 ||
      selectedTag.every((tag) => item.tags.includes(tag))

    return matchesSearch && matchesTags
  })

  const handleTagClick = (tag) => {
    setSelectedTag((prevSelectedTags) => {
      if (prevSelectedTags.includes(tag)) {
        // If tag is already selected, remove it
        return prevSelectedTags.filter((t) => t !== tag)
      } else {
        // If tag is not selected, add it
        return [...prevSelectedTags, tag]
      }
    })
  }

  return (
    <div className="App">
      <div className="Header-Container">
        <input
          type="text"
          placeholder={`Displaying ${filteredData.length} records`}
          value={search}
          onChange={handleSearchChange}
        />
      </div>
      <div className="Grouped-Tags-Container">
        {tags.map((tag) => (
          <span
            key={tag}
            className={
              selectedTag.includes(tag) ? "Highlighted-Tags" : "Grouped-Tags"
            }
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="Card-Container">
        {filteredData.map((item) => {
          return <Card key={item.id} data={item} />
        })}
      </div>
    </div>
  )
}

export default App
