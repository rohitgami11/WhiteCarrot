import '../styles/globals.css'
import Provider from '@components/Provider'

export const metadata = {
  title: 'Google Calendar Events',
  description: 'View your Google Calendar events',
}

const RootLayout = ({children}) => {
  return (
    <html lang='en'>
      <body>
        <Provider>
          <main className='app'>
            {children}
          </main>
        </Provider>
      </body>
    </html>
  )
}

export default RootLayout