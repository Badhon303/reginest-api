import { SuperAdmins } from '@/utils/access/SuperAdmins'

export const Attendees = {
  slug: 'attendees',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'contactNumber', 'paymentId', 'guests'],
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
}
