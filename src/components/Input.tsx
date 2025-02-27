import React from 'react'

export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input type="text" onChange={e => {
      if (/[0-9]*/.test(e.currentTarget.value)) props.onChange?.(e);
    }} {...props}/>
  )
}
