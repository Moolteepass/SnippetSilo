import { useState, useEffect } from "react";
import "./App.css";
import Card from "./components/Card.jsx";

function App() {
  const [data, setData] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  useEffect(() => {
    let accumulatedData = []; // Array to accumulate data across pages
  
    const fetchData = async (offset = null) => {
      try {
        const baseID = "appOOlZ2AISbHpbVb";
        const tableName = "All Clips";
        let url = `https://api.airtable.com/v0/${baseID}/${tableName}`;
  
        if (offset) {
          url += `?offset=${offset}`;
        }
  
        const response = await fetch(url, {
          headers: {
            Authorization: "Bearer patGrTqLMArSkLwSf.28b21052d73212484e726c2573b482facab396c5f5dc83919af2e484611cc6b4",
          },
        });
  
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
  
        const result = await response.json();
        accumulatedData = accumulatedData.concat(result.records);
  
        if (result.offset) {
          await fetchData(result.offset); // Recursively fetch next set of data
        } else {
          processFinalData(accumulatedData); // Process data after fetching all pages
        }
      } catch (error) {
        console.error("Error fetching JSON:", error);
      }
    };
  
    const processFinalData = (allData) => {
      setData(allData.map(record => record.fields));
  
      const allTags = allData
        .flatMap(record => record.fields.Tags || [])
        .filter((value, index, self) => self.indexOf(value) === index); // Removing duplicates
  
      setTags(allTags);
      setIsLoading(false); // Data fetching and processing complete
    };
  
    setIsLoading(true); // Start loading
    fetchData();
  }, []);

  const handleTagChange = (tag) => {
    setSelectedTags((prevSelectedTags) =>
      prevSelectedTags.includes(tag)
        ? prevSelectedTags.filter((t) => t !== tag)
        : [...prevSelectedTags, tag]
    );
  };

  const handleTagButtonClick = (tag) => {
    handleTagChange(tag); // Reuse the existing handleTagChange function
  };

  const filteredData = data
    .filter((item) => {
      // Filter by search query
      return item.Title.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .filter((item) => {
      // Filter by selected tags, if any
      if (selectedTags.length === 0) {
        return true;
      }
      return selectedTags.every((tag) => item.Tags?.includes(tag));
    });

  return (
    <div className="Main-App">
      <div className="Searchbar-Container">
        <input
          className="searchbar"
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <span className="record-count">
          {`Displaying ${filteredData.length} records`}
        </span>
      </div>

      {/* Buttons for Tags */}
      <div className="Tags-Container">
        {isLoading ? (
          <div>Loading...</div> // Display loading message
        ) : (
          tags.map((tag, index) => (
            <button
              key={index}
              onClick={() => handleTagButtonClick(tag)}
              className={`Tags-Button ${
                selectedTags.includes(tag) ? "selected" : ""
              }`}
            >
              {tag}
            </button>
          ))
        )}
      </div>

      <div className="Cards-Box">
        {isLoading ? (
          <div>Loading cards...</div> // Optional: Display loading message for cards
        ) : (
          <div className="Group-All-Cards">
            {filteredData.map((item, index) => (
              <Card key={index} data={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
