import React, { useState } from 'react';
import PropTypes from "prop-types";

function Card({ data }) {
  const { Title, URL, Tags } = data;
  const [copyButtonText, setCopyButtonText] = useState("Copy");

  const copyTextToClipboard = async (Title, URL) => {
    try {
      await navigator.clipboard.writeText(`${Title}:  ${URL}`);
      setCopyButtonText("Copied"); // Change button text to "Copied"
      console.log("Text copied to clipboard");

      // Set the button text back to "Copy" after 2 seconds
      setTimeout(() => setCopyButtonText("Copy"), 1000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="Group-Container">
      <div className="Content-Wrapper">
        <div className="Ind-Image-Container">
          <img className="Ind-Image" src={data.Image[0].url} alt={Title} />
        </div>
        <div className="Ind-Text-Spacing">
          <h2 className="Ind-Title">{Title}</h2>
          <p className="Ind-Tags">{Tags.join(", ")}</p>
        </div>
      </div>
      <div className="Ind-Copy-And-Open">
        <button className="Ind-Copy" onClick={() => copyTextToClipboard(Title, URL)}>
          {copyButtonText}
        </button>
        <button className="Ind-Open" onClick={() => window.open(URL, '_blank')}>Open</button>
      </div>
    </div>
  );
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
