import { redirect } from 'next/navigation'
import React from 'react'

const HomePage = () => {
  redirect('/display');
}

export default HomePage