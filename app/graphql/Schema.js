const Project = require('../resolvers/Project.resolver.js');
const Query = require('../resolvers/Query.resolver.js');
const Mutation = require('../resolvers/Mutation.resolver.js');
const User = require('../resolvers/User.resolver.js');
const Issue = require('../resolvers/Issue.resolver.js');
//const Label = require('./resolvers/Label.resolver.js');
const ISODate = require('../scalars/ISODate');
const { ApolloServer, gql } = require('apollo-server-express');

const typeDefs = gql`
type Query {
    project(id: ID!): Project
    user(id: ID!):User
    userByEmail(email:String!):User
    userLogin(query: UserAccount!): User
    label(id: ID!):[Label]
    epics(id: ID!):[Issue]
    tasks(id: ID!):[Issue]
    subtasks(id: ID!):[Issue]
    issue(id: ID!):Issue
  }

  type Mutation{
    createProject(input: ProjectInput!):Project
    updateProject(input: ProjectInput!):Project
    addProjectMember(input: MemberInput!):Project
    deleteProject(id:ID!):Project
    createUser(input:UserInput!):User
    updateUserPassword(input: PasswordInput!):User
    updateUserEmail(input:UserEmail!):User
    deleteUser(id:ID!):User
    createIssue(input:IssueInput!):Issue
    deleteIssue(id:ID!):Issue
    updateIssue(input:IssueInput!):Issue
    addParentToIssue(input: ParentChildIssueInput):[Issue]
    createComment(input:CommentInput!):Comment
    updateComment(input:CommentInput!):Comment
    deleteComment(id:ID!):Comment
    createLabelAndAddToIssue(input:LabelIssueInput!):Label
    createLabel(input:LabelInput!):Label
    deleteLabel(id:ID!):Label
    createStatus(input:StatusInput!):Status
    updateStatus(input:StatusInput!):Status
    deleteStatus(id:ID!):Status
  }

  type Project {
    _id: ID!
    name: String!
    key: String!
    category: String
    lead:User
    members:[User]
    image:String
    issues:[Issue]
    default_assignee: AssigneeEnum
    start_date: ISODate
  }

  type User{
    _id: ID!
    name: String!
    email: String!
    password: String!
    projects:[Project]
  }

  type Label{
    _id: ID! 
    name: String
  }

  type Issue{
    _id: ID! 
    project:Project
    summary: String
    issueType: IssueTypeEnum
    description: String
    status: Status
    assignee: User
    labels: [Label]
    startDate: ISODate
    dueDate: ISODate
    reporter: User
    parent: Issue,
    chilren: [Issue],
    comments: [Comment],
  }

type Comment{
  _id: ID! 
  author:User!
  description: String!
  date: ISODate
  issue:Issue
}

type Status{
  _id:ID!
  user:User
  name:String
}

input ProjectInput{
  id: ID!
    name: String!
    key: String!
    category: String
    lead:String
    members:[String]
    image:String
    default_assignee: String
}

input PasswordInput{
  id: ID! 
  password:String!
}

  input IssueInput{
      userId: ID! 
      issueType:String!
      summary: String!
      labels:[String]
      description:[String]
  }

  input SubtaskInput{
      id: ID!
      userId: String!
      summary: String!
      labels:[String]
      description:[String]
      parentId:String!
  }

  input ParentChildIssueInput{
    parentId:String!
    childId:String!
  }

  input CommentInput{
      id: ID!
      author:String!
      description:String!
      issue:String!
  }

  input UserAccount{
    email: String! 
    password:String!
  }

  input UserEmail{
    _id: ID!
    email: String! 
  }

  input UserInput {
      _id: ID!
      name:String
      email:String!
      password:String!
  }

  input MemberInput{
    id:ID!
    userid:ID!
  }

  input StatusInput{
    id: ID!
    user:ID!
    name:String
  }

  input LabelInput{
    id: ID!
    user:ID!
    name:String!
  }

  input LabelIssueInput{
    labelId:ID!
    issueId:ID!
    name:String
    user:ID!
  }

  scalar ISODate

  enum AssigneeEnum {
    PROJECT_LEAD
    NOT_ASSIGNED
}

enum IssueTypeEnum{
  EPIC
  TASK
  SUBTASK
}
`
//TODO
//Add mutation
const resolvers = { Query, Mutation, Project, Issue, User, ISODate };

module.exports = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    endpoint: '/graphql',
    settings: {
      'editor.theme': 'light'
    }
  }
})


