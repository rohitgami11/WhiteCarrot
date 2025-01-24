import AuthButton from '../components/AuthButton'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl mb-8">Google Calendar Event Viewer</h1>
      <AuthButton />
    </main>
  )
}