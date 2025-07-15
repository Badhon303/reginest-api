import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'

export const POST = async (request) => {
  const url = new URL(request.url)
  const trans_id = url.searchParams.get('tran_id')
  try {
    // Validate transaction_id
    if (!trans_id) {
      return NextResponse.json(
        {
          errors: [
            {
              name: 'ValidationError',
              data: {
                field: 'trans_id',
              },
              message: 'Transaction ID is required.',
            },
          ],
        },
        { status: 400 },
      )
    }

    const payload = await getPayload({
      config: configPromise,
    })

    try {
      // Find the payment record first to check if it exists
      const existingPayment = await payload.find({
        collection: 'payments',
        where: {
          transactionId: {
            equals: trans_id,
          },
        },
      })

      if (!existingPayment || existingPayment.docs.length === 0) {
        return NextResponse.json(
          {
            errors: [
              {
                name: 'NotFoundError',
                data: {
                  transactionId: trans_id,
                },
                message: 'Payment record not found for the given transaction ID.',
              },
            ],
          },
          { status: 404 },
        )
      }

      if (existingPayment.docs[0].status === 'completed') {
        return NextResponse.redirect(`https://reginest-web.vercel.app/payment/success`, {
          status: 303,
        })
      }

      await payload.update({
        collection: 'payments',
        id: existingPayment.docs[0].id, // required
        data: {
          status: 'completed',
        },
      })

      return NextResponse.redirect(`https://reginest-web.vercel.app/payment/success`, {
        status: 303,
      })
    } catch (error) {
      console.error('Error updating payment in Payload: ', error)
      return NextResponse.json(
        {
          errors: [
            {
              name: 'DatabaseError',
              message: 'Failed to update payment status.',
              details: error.message,
            },
          ],
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error('Unexpected error in POST handler: ', error)
    return NextResponse.json(
      {
        errors: [
          {
            name: 'ServerError',
            message: 'An unexpected error occurred.',
            details: error.message,
          },
        ],
      },
      { status: 500 },
    )
  }
}
