import {
  ApolloClient,
  ApolloLink,
  concat,
  createHttpLink,
  gql,
  InMemoryCache,
} from '@apollo/client'
import { getAccessToken } from '../auth'

// Apollo client uses it by default under the hood
const httpLink = createHttpLink({ uri: 'http://localhost:9000/graphql' })

// set the authorization header with ApolloClient
const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken()
  if (accessToken) {
    operation.setContext({
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  }

  return forward(operation)
})

const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
})

const jobDetailFragment = gql`
  fragment JobDetail on Job {
    id
    date
    title
    company {
      id
      name
    }
    description
  }
`

const jobByIdQuery = gql`
  query JobById($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`

export const createJob = async ({ title, description }) => {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
      job: createJob(input: $input) {
        ...JobDetail
      }
    }
    ${jobDetailFragment}
  `

  const { data } = await apolloClient.mutate({
    mutation,
    variables: { input: { title, description } },
    update: (cache, { data }) => {
      // set the cache manually to reduce requests
      cache.writeQuery({
        query: jobByIdQuery,
        variables: { id: data.job.id },
        data,
      })
    },
  })

  return data.job
}

export const getCompany = async id => {
  const query = gql`
    query CompanyById($id: ID!) {
      company(id: $id) {
        id
        name
        description
        jobs {
          id
          date
          title
        }
      }
    }
  `

  const { data } = await apolloClient.query({ query, variables: { id } })
  return data.company
}

export const getJob = async id => {
  const { data } = await apolloClient.query({ query: jobByIdQuery, variables: { id } })
  return data.job
}

export const getJobs = async () => {
  const query = gql`
    query Jobs {
      jobs {
        id
        date
        title
        company {
          id
          name
        }
      }
    }
  `

  const { data } = await apolloClient.query({
    query,
    fetchPolicy: 'network-only',
  })
  return data.jobs
}
