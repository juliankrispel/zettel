import React from 'react'
import styles from './index.module.css'

type Props = {
  children: any,
  onClick?: React.MouseEventHandler
}

export default function ({ children, ...props }: Props) {
  return <button className={styles.button} {...props}>
    {children}
  </button>
}