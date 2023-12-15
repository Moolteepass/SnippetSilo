import { useState } from "react"
import { IoOpen } from "react-icons/io5"
import { IoCopy, IoCopyOutline } from "react-icons/io5"
import PropTypes from "prop-types"

const Card = ({ data }) => {
  const { title, url, image, tags } = data
  const [copyIcon, SetCopyIcon] = useState(<IoCopy />)

  const copyToClipboard = async (title, url) => {
    await navigator.clipboard.writeText(`${title}: ${url}`)

    SetCopyIcon(<IoCopyOutline />)

    setTimeout(() => {
      SetCopyIcon(<IoCopy />) // Revert back to copy icon after 2 seconds
    }, 400)
  }

  return (
    <div className="Ind-Card">
      <div className="Ind-Image-And-Title-Container">
        <div
          className="Ind-Copy-Container"
          onClick={() => copyToClipboard(title, url)}
        >
          <div className="Ind-Copy">{copyIcon}</div>
        </div>
        <div
          className="Ind-Open-Container"
          onClick={() => window.open(url, "_blank")}
        >
          <IoOpen className="Ind-Open" />
        </div>
        <div className="Ind-Overlay">
          <img src={image} />
        </div>
        <div className="Ind-Title-Container">
          <h1 className="Ind-Title">{title}</h1>
        </div>
      </div>
      <div className="Ind-Tags-Container">
        {tags.map((tag) => (
          <span className="Ind-Tags" key={tag}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

Card.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    created: PropTypes.string, // Assuming created is a string. Adjust type as necessary.
    image: PropTypes.string, // Assuming image is a string URL.
    tags: PropTypes.arrayOf(PropTypes.string), // Assuming tags is an array of strings.
    rating: PropTypes.number, // Adjust type if rating is not a number.
  }).isRequired,
}

export default Card
