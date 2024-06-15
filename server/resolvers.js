import { getCompany } from './db/companies.js'
import { getJob, getJobs, getJobsByCompany } from './db/jobs.js'

export const resolvers = {
  Query: {
    company: (_root, { id }) => getCompany(id),
    job: (_root, { id }) => getJob(id),
    jobs: () => getJobs(),
  },

  Company: {
    jobs: company => getJobsByCompany(company.id),
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
