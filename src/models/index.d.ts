import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type SidebarMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type PostMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Sidebar {
  readonly id: string;
  readonly logo?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Sidebar, SidebarMetaData>);
  static copyOf(source: Sidebar, mutator: (draft: MutableModel<Sidebar, SidebarMetaData>) => MutableModel<Sidebar, SidebarMetaData> | void): Sidebar;
}

export declare class Post {
  readonly id: string;
  readonly title?: string | null;
  readonly image?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Post, PostMetaData>);
  static copyOf(source: Post, mutator: (draft: MutableModel<Post, PostMetaData>) => MutableModel<Post, PostMetaData> | void): Post;
}