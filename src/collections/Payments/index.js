import { SuperAdmins } from '@/utils/access/SuperAdmins'

export const Payments = {
  slug: 'payments',
  admin: {
    useAsTitle: 'transactionId',
    defaultColumns: ['transactionId', 'amount', 'attendee', 'entryPassQuantity', 'status'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) {
        if (user?.role === 'super-admin' || user?.role === 'admin') {
          return true
        }
      }
      return false
    },
    create: SuperAdmins,
    update: SuperAdmins,
    delete: SuperAdmins,
  },
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: 'transactionId',
      type: 'text',
      maxLength: 99,
      required: true,
      unique: true,
    },
    {
      name: 'amount',
      type: 'number',
      max: 999999999,
      required: true,
    },
    {
      name: 'entryPassQuantity',
      type: 'number',
      max: 11,
      required: true,
    },
    {
      name: 'currency',
      type: 'select',
      required: true,
      options: [
        { label: 'BDT', value: 'bdt' },
        { label: 'USD', value: 'usd' },
      ],
      defaultValue: 'bdt',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
      ],
      defaultValue: 'failed',
    },
    // {
    //   name: 'paymentMethod',
    //   type: 'select',
    //   required: true,
    //   options: [
    //     { label: 'Credit Card', value: 'credit-card' },
    //     { label: 'Bkash', value: 'bkash' },
    //     { label: 'Nagad', value: 'nagad' },
    //   ],
    // },
    {
      name: 'attendee',
      type: 'relationship',
      relationTo: 'attendees',
      required: true,
      hasMany: false,
    },
    {
      name: 'productName',
      type: 'text',
      maxLength: 99,
      defaultValue: 'Reginest Registration',
    },
    {
      name: 'productCategory',
      type: 'text',
      maxLength: 99,
      defaultValue: 'Registration Fee',
    },
    {
      name: 'customerInfo', // required
      type: 'json', // required
    },
    {
      name: 'registrationDate',
      type: 'date',
      defaultValue: () => new Date(),
      access: { update: () => false, create: () => false },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        // 'doc' is the document after the change
        // 'req' is the express request
        // 'operation' indicates 'create' or 'update'

        // Only send email if the payment status is 'completed' and it was an 'update' operation
        if (operation === 'update' && doc.status === 'completed') {
          try {
            const attendee = await req.payload.findByID({
              collection: 'attendees',
              id: doc.attendee.id,
            })

            if (attendee.email) {
              await req.payload.sendEmail({
                to: attendee.email,
                subject: `Payment Successful! - Transaction ID: ${doc.transactionId}`,
                html: `
                  <p>Dear Customer,</p>
                  <p>Your payment with Transaction ID: <strong>${doc.transactionId}</strong> has been successfully processed.</p>
                  <p>You have paid <strong>${doc.amount}</strong>!</p>
                  <p>Thank you for your purchase!</p>
                  <p>Regards,<br/>RegiNest</p>
                `,
              })
              console.log(`Email sent successfully for transaction ID: ${doc.transactionId}`)
            }
          } catch (emailError) {
            console.error(
              `Failed to send payment confirmation email for transaction ID: ${doc.transactionId}`,
              emailError,
            )
          }
        }
        return doc // Always return the document
      },
    ],
  },
}
