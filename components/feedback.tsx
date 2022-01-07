import ReactDOM from 'react-dom'
import classes from './feedback.module.css'

interface FeedbackProps {
  message: string
  status?: string
}

const Feedback = ({ message, status }: FeedbackProps) => {
  const node = (
    <div className={classes.feedback}>
      <p className={`center bg-${status} py-2`}>{message}</p>
    </div>
  )

  return ReactDOM.createPortal(node, document.getElementById('feedback')!)
}

export default Feedback
