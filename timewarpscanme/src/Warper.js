export default function Warper(props) {
  return (
    <div>
      <h1>Howdy</h1>
      <a onClick={props.resetSeen}>RESET</a>
    </div>
  )
}
