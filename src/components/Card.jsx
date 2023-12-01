const Card = () => {
  return (
    <div className="Group-Container">
      <div className="Ind-Image-Container">
        <img className="Ind-Image" src="/ComputerDeactivateIguana.png" alt="" />
      </div>
      <div className="Ind-Text-Spacing">
        <h2 className="Ind-Title">Computer, deactivate Iguana</h2>
        <p className="Ind-Tags">Funny | Star Trek | TV and Films</p>
        <div className="Ind-Copy-And-Open">
          <button className="Ind-Copy">Copy</button>
          <button className="Ind-Open">Open</button>
        </div>
      </div>
    </div>
  )
}

export default Card
