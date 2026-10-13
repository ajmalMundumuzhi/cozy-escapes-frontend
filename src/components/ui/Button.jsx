import { Link } from 'react-router-dom'

export default function Button({ to, children, className = '', ...props }) {
  const styles = `inline-block bg-gold px-14 py-[13px] text-[17px] font-normal text-white transition-colors hover:bg-gold-dark ${className}`
  if (to) {
    return <Link to={to} className={styles} {...props}>{children}</Link>
  }
  return <button className={styles} {...props}>{children}</button>
}