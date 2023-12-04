import { useState, useEffect } from "react";
import "./App.css";
import Card from "./components/Card.jsx";

function App() {
  const [data, setData] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
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
            Authorization:
              "Bearer patGrTqLMArSkLwSf.28b21052d73212484e726c2573b482facab396c5f5dc83919af2e484611cc6b4",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        setData((currentData) => {
          const currentIds = new Set(currentData.map((item) => item.ID));
          const uniqueNewData = result.records
            .map((record) => record.fields)
            .filter((record) => !currentIds.has(record.ID));

          return [...currentData, ...uniqueNewData].sort(
            (a, b) => new Date(b["Created Date"]) - new Date(a["Created Date"])
          );
        });

        // Extract and update tags
        const fetchedTags = result.records
          .flatMap((record) => record.fields.Tags || [])
          .filter((value, index, self) => self.indexOf(value) === index);
        setTags(fetchedTags);

        if (result.offset) {
          fetchData(result.offset); // Recursively fetch next set of data
        }
      } catch (error) {
        console.error("Error fetching JSON:", error);
      }
    };
    fetchData();
  }, []);

  const handleTagChange = (tag) => {
    setSelectedTags((prevSelectedTags) =>
      prevSelectedTags.includes(tag)
        ? prevSelectedTags.filter((t) => t !== tag)
        : [...prevSelectedTags, tag]
    );
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

      {/* Checkboxes for Tags */}
      <div className="Tags-Container">
        {tags.map((tag, index) => (
          <label key={index}>
            <input
              type="checkbox"
              name="tag"
              value={tag}
              onChange={() => handleTagChange(tag)}
              checked={selectedTags.includes(tag)}
              className="Tags-Checkbox"
            />
            {tag}
          </label>
        ))}
      </div>

      <div className="Cards-Box">
        <div className="Group-All-Cards">
          {filteredData.map((item, index) => (
            <Card key={index} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
