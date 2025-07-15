import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'
import { dataConfig, sslConfig } from '../../../../utils/sslConfig'

export const POST = async (request) => {
  try {
    const requestBody = await request.json()
    const transaction_id = `REG-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
    const payload = await getPayload({
      config: configPromise,
    })

    // Validate attendee
    const attendee = await payload.findByID({
      collection: 'attendees',
      id: requestBody.attendeeId,
    })
    if (!attendee) {
      return NextResponse.json(
        {
          errors: [
            {
              name: 'NotFoundError',
              data: {
                collection: 'attendees',
                id: requestBody.attendeeId,
              },
              message: 'Attendee not found.',
            },
          ],
        },
        { status: 404 },
      )
    }

    // Fetch product data
    const productDataRaw = await payload.find({
      collection: 'products',
      where: {
        productName: {
          equals: 'Reginest Registration',
        },
      },
    })
    const productData = productDataRaw?.docs?.[0]

    if (!productData) {
      return NextResponse.json(
        {
          errors: [
            {
              name: 'NotFoundError',
              data: {
                productName: 'Reginest Registration',
              },
              message: 'Product "Reginest Registration" not found.',
            },
          ],
        },
        { status: 404 },
      )
    }

    const data = dataConfig({
      total_amount: productData.price * (attendee.Guests.length + 1),
      tran_id: transaction_id,
      success_url: `${process.env.FRONTEND_URL}/payment/success?tran_id=${transaction_id}`,
      fail_url: `${process.env.FRONTEND_URL}/payment/fail`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
      product_name: productData?.productName || 'Reginest Registration',
      product_category: productData?.productCategory || 'General',
      cus_name: attendee.firstName + ' ' + attendee.lastName,
      cus_email: attendee.email,
      cus_phone: attendee.contactNumber,
    })

    const result = await sslConfig.init(data)

    if (!result.GatewayPageURL || result.status === 'FAILED') {
      return NextResponse.json(
        {
          errors: [
            {
              name: 'PaymentInitializationError',
              data: {
                sslCommerzResponse: result,
              },
              message: result.failedreason || 'Failed to initialize payment.',
            },
          ],
        },
        { status: 500 },
      )
    } else if (result.status === 'SUCCESS') {
      const paymentData = {
        transactionId: transaction_id,
        amount: productData.price * (attendee.Guests.length + 1),
        entryPassQuantity: attendee.Guests.length + 1,
        status: 'pending', // Set to pending initially, will be updated to 'paid' on success route
        attendee: requestBody.attendeeId,
        productName: productData?.productName || 'Reginest Registration',
        productCategory: productData?.productCategory || 'General',
      }

      try {
        await payload.create({
          collection: 'payments',
          data: paymentData,
        })
      } catch (error) {
        console.error('Error creating payment record in Payload: ', error)
        return NextResponse.json(
          {
            errors: [
              {
                name: 'DatabaseError',
                message: 'Error creating payment record.',
                details: error.message,
              },
            ],
          },
          { status: 500 },
        )
      }
      return NextResponse.json(
        {
          message: 'Payment initiated successfully.',
          url: result.GatewayPageURL,
        },
        { status: 200 },
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
