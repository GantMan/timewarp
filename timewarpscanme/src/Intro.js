export default function Intro(props) {
  return (
    <div class="podium">
      <img class="open" src="/open.png" />
      <div class="about">
        <h3 className="mega">warp</h3>
        <p>
          Try the popular “Time Warp Scan” directly in your browser and
          instantly share the results with your friends.
        </p>
        <h3 className="mega">safely</h3>
        <p>
          This website runs 100% on your machine and does not retain any copy of
          your images or videos. This site is free and open source by Gant Laborde of Infinite Red.
        </p>

        <div className="boxbutton" onClick={props.exploreClick}>
          EXPLORE
        </div>
      </div>
    </div>
  )
}
