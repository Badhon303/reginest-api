import { NextResponse } from 'next/server'

export const POST = async () => {
  return NextResponse.redirect(`${process.env.FRONTEND_URL}/payment/fail`, {
    status: 303,
  })
}
