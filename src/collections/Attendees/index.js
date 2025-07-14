import { SuperAdmins } from '@/utils/access/SuperAdmins'

export const Attendees = {
  slug: 'attendees',
  admin: {
    useAsTitle: 'email',
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
    update: () => false,
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
        { label: 'Mr.', value: 'mr' },
        { label: 'Mrs.', value: 'mrs' },
        { label: 'Miss.', value: 'miss' },
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
      maxLength: 20, // regex may required
      required: true,
      validate: (value) => {
        if (!value) return true // Allow empty phone number

        // Updated regex for phone numbers:
        // Allows for:
        // - Optional '+' at the beginning
        // - Digits (0-9)
        // - Spaces, hyphens, and parentheses
        // - Minimum 7 digits, maximum 15 (adjust as needed for your specific use case)
        const phoneRegex = /^\+?[\d\s\-\(\)]{7,20}$/
        // Example for Bangladeshi mobile numbers (starting with 01)
        const bdMobileRegex = /^01[3-9]\d{8}$/

        if (phoneRegex.test(value) || bdMobileRegex.test(value)) {
          return true
        }
        return 'Please enter a valid phone number (e.g., +123-456-7890, 01783558935)'
      },
    },
    {
      name: 'Guests',
      type: 'array',
      maxRows: 99,
      fields: [
        {
          name: 'prefix',
          type: 'select',
          required: true,
          options: [
            { label: 'Mr.', value: 'mr' },
            { label: 'Mrs.', value: 'mrs' },
            { label: 'Miss.', value: 'miss' },
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

            // Updated regex for phone numbers:
            // Allows for:
            // - Optional '+' at the beginning
            // - Digits (0-9)
            // - Spaces, hyphens, and parentheses
            // - Minimum 7 digits, maximum 15 (adjust as needed for your specific use case)
            const phoneRegex = /^\+?[\d\s\-\(\)]{7,20}$/
            // Example for Bangladeshi mobile numbers (starting with 01)
            const bdMobileRegex = /^01[3-9]\d{8}$/

            if (phoneRegex.test(value) || bdMobileRegex.test(value)) {
              return true
            }
            return 'Please enter a valid phone number (e.g., +123-456-7890, 01783558935)'
          },
        },
      ],
    },
    {
      name: 'entryPassQuantity',
      type: 'number',
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
