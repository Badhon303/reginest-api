// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

import { Users } from './collections/Users'
import { Payments } from './collections/Payments'
import { Attendees } from './collections/Attendees'
import { Products } from './collections/Products'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    // Add your own logo and icon here
    components: {
      graphics: {
        Icon: '/graphics/Icon/index.jsx#Icon',
        Logo: '/graphics/Logo/index.jsx#Logo',
      },
    },
    // Add your own meta data here
    meta: {
      description: 'Reginest Admin panel for managing content',
      icons: [
        {
          type: 'image/png',
          rel: 'icon',
          url: '/assets/favicon.ico',
        },
      ],
      titleSuffix: '- Reginest Admin',
    },
  },
  collections: [Users, Attendees, Payments, Products],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  graphQL: {
    disable: true,
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    idType: 'uuid',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_USER,
    defaultFromName: process.env.FROM_NAME,
    // Nodemailer transportOptions
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),
  cors: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://reginest-web.vercel.app',
    'https://3gvsd2l4-3000.asse.devtunnels.ms',
  ],
  // If you are protecting resources behind user authentication,
  // This will allow cookies to be sent between the two domains
  csrf: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://reginest-web.vercel.app',
    'https://3gvsd2l4-3000.asse.devtunnels.ms',
  ],
})
