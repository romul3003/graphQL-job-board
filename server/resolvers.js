import { GraphQLError } from 'graphql'

import { getCompany } from './db/companies.js'
import { getJob, getJobs, getJobsByCompany } from './db/jobs.js'

export const resolvers = {
  Query: {
    company: async (_root, { id }) => {
      const company = await getCompany(id)

      if (!company) {
        throw notFoundError(`No Company found with id ${id}`)
      }

      return company
    },
    job: async (_root, { id }) => {
      const job = await getJob(id)

      if (!job) {
        throw notFoundError(`No Job found with id ${id}`)
      }

      return job
    },
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

function notFoundError(message) {
  return new GraphQLError(message, {
    extensions: { code: 'NOT_FOUND' },
  })
}

function toIsoDate(value) {
  return value.slice(0, 'yyyy-mm-dd'.length)
}
