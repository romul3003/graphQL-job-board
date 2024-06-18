import JobList from '../components/JobList'
import { jobsQuery } from '../lib/graphql/queries'
import { useJobs } from '../lib/graphql/hooks'

function HomePage() {
  const { jobs, loading, error } = useJobs(jobsQuery)

  console.log('[JobPage]:', { jobs, loading, error })

  if (!jobs) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="has-text-danger">Data unavailable</div>
  }

  return (
    <div>
      <h1 className="title">Job Board</h1>
      <JobList jobs={jobs} />
    </div>
  )
}

export default HomePage
