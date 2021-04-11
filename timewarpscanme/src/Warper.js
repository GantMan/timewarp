export default function Warper(props) {
  return (
    <div className="full">
      <div className="podium">
        <h1>Howdy</h1>
        
      </div>
      <a onClick={props.resetSeen}>RESET</a>
    </div>
  )
}
