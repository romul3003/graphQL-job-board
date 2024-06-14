import { getCompany } from './db/companies.js'
import { getJobs } from './db/jobs.js'

export const resolvers = {
  Query: {
    jobs: async () => getJobs(),
  },

  Job: {
    // add company from db to response according to schema
    company: job => getCompany(job.companyId),
    // add date from db to response
    date: job => toIsoDate(job.createdAt),
  },
}

function toIsoDate(value) {
  return value.slice(0, 'yyyy-mm-dd'.length)
}
