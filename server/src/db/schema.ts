import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const twitchEventEnum = pgEnum('twitch_event', [
  'follow',
  'subscribe',
  'gift',
  'cheer',
  'points_redeem',
  'message',
  'raid',
  'warn',
  'timeout',
  'ban',
  'unban',
]);

const timestamps = {
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }),
};

export const users = pgTable(
  'users',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    twitchId: text(),
    username: text().unique().notNull(), // Display name in all lowercase
    displayName: text().notNull(),
    followedAt: timestamp({ withTimezone: true }),
    firstMessageAt: timestamp({ withTimezone: true }),
    grantedVipAt: timestamp({ withTimezone: true }),
    grantedModAt: timestamp({ withTimezone: true }),
    shoutout: boolean(),
    lastShoutoutAt: timestamp({ withTimezone: true }),
    monthsSubbed: integer(),
    numGifted: integer(),
    numCheered: integer(),
    notes: text(),
    ...timestamps,
  },
  (t) => [uniqueIndex('username_idx').on(t.username)],
);

export const tags = pgTable('tags', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
});

export const userTags = pgTable(
  'user_tags',
  {
    userId: integer()
      .references(() => users.id)
      .notNull(),
    tagId: integer()
      .references(() => tags.id)
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.tagId] })],
);

export const broadcasts = pgTable('broadcasts', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text().notNull(),
  startAt: timestamp({ withTimezone: true }).notNull(),
  ...timestamps,
});

export const categories = pgTable('categories', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
});

export const broadcastCategories = pgTable(
  'broadcast_categories',
  {
    broadcastId: integer()
      .references(() => broadcasts.id)
      .notNull(),
    categoryId: integer()
      .references(() => categories.id)
      .notNull(),
    startAt: timestamp({ withTimezone: true }),
    endAt: timestamp({ withTimezone: true }),
  },
  (t) => [primaryKey({ columns: [t.broadcastId, t.categoryId] })],
);

export const messages = pgTable('messages', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .references(() => users.id)
    .notNull(),
  broadcastId: integer()
    .references(() => broadcasts.id)
    .notNull(),
  broadcastTimeMs: integer().notNull(),
  text: text().notNull(),
  pinned: boolean(),
  ...timestamps,
});

/** RELATIONS */
export const usersRelations = relations(users, ({ many }) => ({
  messages: many(messages),
  tags: many(tags),
  userTags: many(userTags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  users: many(users),
  userTags: many(userTags),
}));

export const userTagsRelations = relations(userTags, ({ one }) => ({
  user: one(users, {
    fields: [userTags.userId],
    references: [users.id],
  }),
  tag: one(tags, {
    fields: [userTags.tagId],
    references: [tags.id],
  }),
}));

export const broadcastsRelations = relations(broadcasts, ({ many }) => ({
  broadcastCategories: many(broadcastCategories),
  messages: many(messages),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  broadcastCategories: many(broadcastCategories),
}));

export const broadcastCategoriesRelations = relations(
  broadcastCategories,
  ({ one }) => ({
    broadcast: one(broadcasts, {
      fields: [broadcastCategories.broadcastId],
      references: [broadcasts.id],
    }),
    category: one(categories, {
      fields: [broadcastCategories.categoryId],
      references: [categories.id],
    }),
  }),
);

export const messagesRelations = relations(messages, ({ one }) => ({
  user: one(users, {
    fields: [messages.userId],
    references: [users.id],
  }),
  broadcast: one(broadcasts, {
    fields: [messages.broadcastId],
    references: [broadcasts.id],
  }),
}));
