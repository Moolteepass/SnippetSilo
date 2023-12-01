import PropTypes from "prop-types"

function Card({ data }) {
  const { Title, URL, Tags, Image } = data
  return (
    <div className="Group-Container">
      <div className="Ind-Image-Container">
        <img className="Ind-Image" src={Image} alt={Title} />
      </div>
      <div className="Ind-Text-Spacing">
        <h2 className="Ind-Title">{Title}</h2>
        <p className="Ind-Tags">{Tags}</p>
        <div className="Ind-Copy-And-Open">
          <button className="Ind-Copy" src={URL}>
            Copy
          </button>
          <button className="Ind-Open">Open</button>
        </div>
      </div>
    </div>
  )
}

Card.propTypes = {
  data: PropTypes.shape({
    Title: PropTypes.string,
    URL: PropTypes.string,
    Tags: PropTypes.arrayOf(PropTypes.string),
    Image: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.number,
        filename: PropTypes.string,
        size: PropTypes.number,
        type: PropTypes.string,
        // Add PropTypes for other Image properties as needed
      })
    ),
    // Add PropTypes for other fields as needed
  }).isRequired,
}

export default Card
