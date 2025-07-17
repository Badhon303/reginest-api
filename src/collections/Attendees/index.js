import { SuperAdmins } from '@/utils/access/SuperAdmins'
import { dataConfig, sslConfig } from '../../utils/sslConfig'
import { APIError } from 'payload'

export const Attendees = {
  slug: 'attendees',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'contactNumber', 'paymentId', 'guests'],
    hideAPIURL: process.env.NODE_ENV !== 'development' ? true : false,
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
    create: () => true,
    update: SuperAdmins,
    delete: SuperAdmins,
  },
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: 'prefix',
      type: 'select',
      required: true,
      options: [
        { label: 'Mr.', value: 'Mr.' },
        { label: 'Mrs.', value: 'Mrs.' },
        { label: 'Miss.', value: 'Miss.' },
      ],
    },
    {
      name: 'firstName',
      type: 'text',
      maxLength: 99,
      required: true,
      validate: (value) => {
        // After trimming (which happens in beforeChange), check if there are any internal spaces left
        // This regex checks for any whitespace character (space, tab, etc.)
        if (/\s/.test(value.trim())) {
          // Important: run test on trimmed value for accurate internal space check
          return 'Name cannot contain spaces in between.'
        }

        return true
      },
      hooks: {
        beforeChange: [
          ({ value }) => {
            if (typeof value === 'string') {
              return value.trim() // This will remove leading and trailing spaces
            }
            return value
          },
        ],
      },
    },
    {
      name: 'lastName',
      type: 'text',
      maxLength: 99,
      required: true,
      validate: (value) => {
        // After trimming (which happens in beforeChange), check if there are any internal spaces left
        // This regex checks for any whitespace character (space, tab, etc.)
        if (/\s/.test(value.trim())) {
          // Important: run test on trimmed value for accurate internal space check
          return 'Name cannot contain spaces in between.'
        }

        return true
      },
      hooks: {
        beforeChange: [
          ({ value }) => {
            if (typeof value === 'string') {
              return value.trim() // This will remove leading and trailing spaces
            }
            return value
          },
        ],
      },
    },
    {
      name: 'email',
      type: 'text',
      maxLength: 99,
      required: true,
      // unique: true, // You might remove or keep this depending on your exact requirements. The custom validation handles the uniqueness constraint.
      validate: async (value, { req, siblingData }) => {
        // Added `req` and `siblingData` for access to payload and current document
        if (!value) {
          return 'Email is required.'
        }
        // Basic email regex for common email patterns
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address.'
        }

        // Convert value to lowercase for consistent checking
        const lowerCaseValue = value.toLowerCase().trim()

        try {
          const { docs } = await req.payload.find({
            collection: 'attendees', // The slug of your collection
            where: {
              email: {
                equals: lowerCaseValue,
              },
            },
            limit: 11, // Fetch up to 11 to efficiently check if more than 10 exist
            depth: 0, // No need for deep relationships here
          })

          // Filter out the current document if it's an update operation
          // This prevents the current document from being counted against itself
          const existingRecords = docs.filter((doc) => doc.id !== siblingData?.id)

          if (existingRecords.length >= 10) {
            return 'More than 10 records with this email address are not allowed.'
          }
        } catch (error) {
          console.error('Error during email validation:', error)
          return 'An error occurred during email validation. Please try again.'
        }

        return true
      },
      hooks: {
        beforeChange: [
          ({ value }) => {
            if (typeof value === 'string') {
              return value.toLowerCase().trim() // Convert to lowercase and trim spaces
            }
            return value
          },
        ],
      },
    },
    {
      name: 'contactNumber',
      type: 'text',
      maxLength: 20, // regex may required
      required: true,
      validate: (value) => {
        if (!value) return true // Allow empty phone number

        // Regex for Bangladeshi mobile numbers:
        // - Optionally starts with '+88'
        // - Must then start with '01'
        // - The third digit must be between 3 and 9 (inclusive)
        // - Followed by 8 more digits
        // - Total length of 11 digits (excluding optional +88)
        const bdMobileRegex = /^(?:\+88)?01[3-9]\d{8}$/

        if (bdMobileRegex.test(value)) {
          return true
        }
        return 'Please enter a valid phone number (e.g., +123-456-7890, 01783558935)'
      },
    },
    {
      name: 'guests',
      type: 'array',
      maxRows: 10,
      fields: [
        {
          name: 'prefix',
          type: 'select',
          required: true,
          options: [
            { label: 'Mr.', value: 'Mr.' },
            { label: 'Mrs.', value: 'Mrs.' },
            { label: 'Miss.', value: 'Miss.' },
          ],
        },
        {
          name: 'firstName',
          type: 'text',
          maxLength: 99,
          required: true,
          validate: (value) => {
            // After trimming (which happens in beforeChange), check if there are any internal spaces left
            // This regex checks for any whitespace character (space, tab, etc.)
            if (/\s/.test(value.trim())) {
              // Important: run test on trimmed value for accurate internal space check
              return 'Name cannot contain spaces in between.'
            }

            return true
          },
          hooks: {
            beforeChange: [
              ({ value }) => {
                if (typeof value === 'string') {
                  return value.trim() // This will remove leading and trailing spaces
                }
                return value
              },
            ],
          },
        },
        {
          name: 'lastName',
          type: 'text',
          maxLength: 99,
          required: true,
          validate: (value) => {
            // After trimming (which happens in beforeChange), check if there are any internal spaces left
            // This regex checks for any whitespace character (space, tab, etc.)
            if (/\s/.test(value.trim())) {
              // Important: run test on trimmed value for accurate internal space check
              return 'Name cannot contain spaces in between.'
            }

            return true
          },
          hooks: {
            beforeChange: [
              ({ value }) => {
                if (typeof value === 'string') {
                  return value.trim() // This will remove leading and trailing spaces
                }
                return value
              },
            ],
          },
        },
        {
          name: 'email',
          type: 'text',
          maxLength: 99,
          required: true,
          validate: (value) => {
            if (!value) {
              return 'Email is required.'
            }
            // Basic email regex for common email patterns
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(value)) {
              return 'Please enter a valid email address.'
            }
            return true
          },
          hooks: {
            beforeChange: [
              ({ value }) => {
                if (typeof value === 'string') {
                  return value.toLowerCase().trim() // Convert to lowercase and trim spaces
                }
                return value
              },
            ],
          },
        },
        {
          name: 'contactNumber',
          type: 'text',
          maxLength: 20,
          required: true,
          validate: (value) => {
            if (!value) return true // Allow empty phone number

            // Regex for Bangladeshi mobile numbers:
            // - Optionally starts with '+88'
            // - Must then start with '01'
            // - The third digit must be between 3 and 9 (inclusive)
            // - Followed by 8 more digits
            // - Total length of 11 digits (excluding optional +88)
            const bdMobileRegex = /^(?:\+88)?01[3-9]\d{8}$/

            if (bdMobileRegex.test(value)) {
              return true
            }
            return 'Please enter a valid phone number (e.g., +8801783558935, 01783558935)'
          },
        },
      ],
    },
    {
      name: 'paymentId',
      type: 'join',
      collection: 'payments',
      on: 'attendee',
    },
    {
      name: 'registrationDate',
      type: 'date',
      defaultValue: () => new Date(),
      validate: (value) => {
        if (!value) {
          return 'Registration date is required.'
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0) // Normalize today to start of day

        const yesterday = new Date(today)
        yesterday.setDate(today.getDate() - 1) // Normalize yesterday to start of day

        const registrationDate = new Date(value)
        registrationDate.setHours(0, 0, 0, 0) // Normalize registration date to start of day

        if (
          registrationDate.getTime() === today.getTime() ||
          registrationDate.getTime() === yesterday.getTime()
        ) {
          return true
        }

        return 'Registration date can only be today or yesterday.'
      },
    },
  ],
  hooks: {
    beforeOperation: [
      async ({ args, operation, req, context }) => {
        if (operation === 'create') {
          // Fetch product data
          context.productDataRaw = await req.payload.find({
            collection: 'products',
            where: {
              productName: {
                equals: 'Reginest Registration',
              },
            },
          })
          const productData = context.productDataRaw?.docs?.[0]

          if (!productData || !productData.price || !productData.deadLine) {
            console.error('Product "Reginest Registration" not found. Cannot initiate payment.')
            // You might want to throw an error or handle this more gracefully
            // e.g., update attendee status to 'payment_failed'
            throw new APIError(
              'Product "Reginest Registration" not found. Cannot initiate payment.',
              400,
            )
          }
          const registrationCutoffDate = new Date(`${productData.deadLine}`) // August 20th, 2025, end of day UTC
          const now = new Date()

          if (now > registrationCutoffDate) {
            console.error(
              'Registration time over. Current time:',
              now,
              'Cutoff time:',
              registrationCutoffDate,
            )
            throw new APIError('Registration time over', 400)
          }
        }
        return args
      },
    ],
    afterChange: [
      async ({ doc, req, operation, context }) => {
        // This hook runs after create and update operations
        if (operation === 'create') {
          const attendeeId = doc.id

          try {
            const transaction_id = `REG-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`

            const productData = context.productDataRaw?.docs?.[0]

            const data = dataConfig({
              total_amount: productData.price * ((doc?.guests?.length || 0) + 1),
              tran_id: transaction_id,
              success_url: `${process.env.BACKEND_URL}/api/payment/success?tran_id=${transaction_id}`,
              fail_url: `${process.env.BACKEND_URL}/api/payment/fail`,
              cancel_url: `${process.env.BACKEND_URL}/api/payment/cancel`,
              product_name: productData?.productName || 'Reginest Registration',
              product_category: productData?.productCategory || 'General',
              cus_name: doc.firstName + ' ' + doc.lastName,
              cus_email: doc.email,
              cus_phone: doc.contactNumber,
            })

            const result = await sslConfig.init(data)

            if (!result.GatewayPageURL || result.status === 'FAILED') {
              console.error(
                'Failed to initialize payment for attendee:',
                attendeeId,
                'Reason:',
                result.failedreason || 'Unknown reason',
              )
              return { ...doc, error: 'Failed to initialize payment.' } // Return the original document
            } else if (result.status === 'SUCCESS') {
              const paymentData = {
                transactionId: transaction_id,
                amount: productData.price * ((doc?.guests?.length || 0) + 1),
                entryPassQuantity: (doc?.guests?.length || 0) + 1,
                status: 'pending', // Set to pending initially, will be updated to 'paid' on success route
                attendee: attendeeId, // Link the payment to the attendee
                productName: productData?.productName || 'Reginest Registration',
                productCategory: productData?.productCategory || 'General',
              }

              try {
                const createdPayment = await req.payload.create({
                  collection: 'payments',
                  data: paymentData,
                  req, // Pass the request object to maintain context if needed
                })

                // Update the attendee's paymentId field with the newly created payment record's ID
                await req.payload.update({
                  collection: 'attendees',
                  id: attendeeId,
                  data: {
                    paymentId: createdPayment.id,
                  },
                  req, // Pass the request object
                })

                console.log(
                  'Payment initiated and record created successfully for attendee:',
                  attendeeId,
                  'Transaction ID:',
                  transaction_id,
                  'Gateway URL:',
                  result.GatewayPageURL,
                )

                // If you need to redirect the user immediately after creation,
                // this hook won't directly do that for a server-side create operation
                // (e.g., from the admin panel). For client-side redirects, you'd
                // typically return the URL to the client.
                // For a backend operation, you simply ensure the payment record is created.
                return { ...doc, GatewayPageURL: result.GatewayPageURL }
              } catch (error) {
                console.error('Error creating payment record in Payload: ', error)
                // Handle database error for payment creation
                // You might want to update attendee status or log this error more specifically
                return { ...doc, error: 'Error creating payment record.' } // Return the original document
              }
            }
          } catch (error) {
            console.error('Unexpected error in afterChange hook for Attendees:', error)
            // Handle unexpected errors during the payment initiation process
            return { ...doc, error: 'Unexpected error during payment initiation.' } // Return the original document
          }
        }
        return doc // Always return the document
      },
    ],
  },
}
