import React from 'react'

function Card({counts, title}) {
  return (
    <div className='rounded shadow-sm flex-1 p-5 flex flex-col gap-4'>
      <h1 className='text-4xl text-gray-900/90 ml-auto'>{counts}</h1>
      <span className='text-xl text-gray-400'>{title}</span>
    </div>
  )
}

export default Card
