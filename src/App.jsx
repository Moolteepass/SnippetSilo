import { useState, useEffect } from "react"
import "./App.css"
import Card from "./components/Card.jsx"

function App() {
  const [data, setData] = useState([])

  /* Get data, how does it work? Fuck knows */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseID = "appOOlZ2AISbHpbVb"
        const tableName = "All Clips"

        const url = `https://api.airtable.com/v0/${baseID}/${tableName}`

        fetch(url, {
          headers: {
            Authorization:
              "Bearer patGrTqLMArSkLwSf.28b21052d73212484e726c2573b482facab396c5f5dc83919af2e484611cc6b4",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setData(data.records.map((record) => record.fields))
            console.log(data.records.map((record) => record.fields))
          })
      } catch (error) {
        console.error("Error fetching JSON:", error)
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      <input className="searchbar" type="text" />
      <div className="Cards-Box">
        <div className="Group-All-Cards">
          {data.map((item, index) => (
            <Card key={index} data={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
