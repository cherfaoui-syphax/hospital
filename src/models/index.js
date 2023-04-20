// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Sidebar, Post } = initSchema(schema);

export {
  Sidebar,
  Post
};