const Header = (props) => {
    return (
      <h1>{props.course}</h1>
    )
}
  
const Part = ({ part }) => {
    return (
        <p>{part.name} {part.exercises}</p>
    )
}
  
const Content = ({ parts }) => {
    return (
      <div>
        {parts.map(part => 
          <Part part={part} key={part.id}/>
        )}
      </div>
    )
}
  
const Total = ({ parts }) => {
    return (
      <p>Total of {parts.reduce((prev, cur) => prev + cur.exercises, 0)} exercises</p>
    )
}
  
const Course = ({ course }) => {
    return (
      <div>
        <Header course={course.name}/>
        <Content parts={course.parts}/>
        <Total parts={course.parts}/>
      </div>
    )
}

export default Course