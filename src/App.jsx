import { useState, useEffect, useCallback } from "react";
import "./App.css";
import Card from "./components/Card.jsx";

function App() {
  const [data, setData] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async (offset = null, accumulatedData = []) => {
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
      accumulatedData = accumulatedData.concat(result.records);

      if (result.offset) {
        await fetchData(result.offset, accumulatedData); // Recursively fetch next set of data
      } else {
        processFinalData(accumulatedData); // Process data after fetching all pages
      }
    } catch (error) {
      console.error("Error fetching JSON:", error);
    }
  }, []); // Empty dependency array

  const processFinalData = (allData) => {
    // Sort the data by 'Created Date' in descending order
    allData.sort((a, b) => {
      const timestampA = new Date(a.fields["Created Date"]);
      const timestampB = new Date(b.fields["Created Date"]);
      return timestampB - timestampA;
    });

    const processedData = allData.map((record) => record.fields);

    // Log the processed data to the console
    console.log(processedData);

    setData(processedData);
    localStorage.setItem("bookmarksData", JSON.stringify(processedData)); // Cache data

    const allTags = allData
      .flatMap((record) => record.fields.Tags || [])
      .filter((value, index, self) => self.indexOf(value) === index); // Removing duplicates

    setTags(allTags);
    setIsLoading(false);
  };

  useEffect(() => {
    const cachedData = localStorage.getItem("bookmarksData");
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      setData(parsedData);

      const allTags = parsedData
        .flatMap((item) => item.Tags || [])
        .filter((value, index, self) => self.indexOf(value) === index); // Extract tags from cached data
      setTags(allTags);

      setIsLoading(false);
    } else {
      setIsLoading(true);
      fetchData();
    }
  }, [fetchData]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Clearing cache"); // Log when clearing cache
      localStorage.removeItem("bookmarksData");
    }, 1200000); // 1200000 milliseconds = 20 minutes

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    fetchData();
  };

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
      return item.Title.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .filter((item) => {
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
        <button onClick={handleRefresh} className="Refresh-Button">
          Refresh Data
        </button>
        <span className="record-count">
          {`Displaying ${filteredData.length} records`}
        </span>
      </div>

      <div className="Tags-Container">
        {isLoading ? (
          <div>Loading...</div>
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
          <div>Loading cards...</div>
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
