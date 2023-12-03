import { useState, useEffect } from "react";
import "./App.css";
import Card from "./components/Card.jsx";

function App() {
  const [data, setData] = useState([]);
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
          // Create a new set of IDs from the current data
          const currentIds = new Set(currentData.map(item => item.id));

          // Filter out any records that already exist in currentData
          const uniqueNewData = result.records
            .map(record => record.fields)
            .filter(record => !currentIds.has(record.id));

          // Sort by newest 'Created Date' and concatenate with existing data
          const updatedData = [
            ...currentData,
            ...uniqueNewData
          ].sort((a, b) => new Date(b['Created Date']) - new Date(a['Created Date']));

          if (!result.offset) {
            console.log("Finished fetching data:", updatedData);
          }
          return updatedData;
        });

        if (result.offset) {
          fetchData(result.offset); // Recursively fetch next set of data
        }
      } catch (error) {
        console.error("Error fetching JSON:", error);
      }
    };
    fetchData();
  }, []);

  const filteredData = data.filter(
    (item) => item.Title.toLowerCase().includes(searchQuery.toLowerCase()) // Assuming you want to filter by 'Title'
  );

  return (
    <div className="Main-App">
      <div className="Searchbar-Container">
        <input
          className="searchbar"
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
