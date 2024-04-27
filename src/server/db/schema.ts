import { relations, sql } from "drizzle-orm";
import {
  // index,
  int,
  primaryKey,
  sqliteTable,
  index,
  // sqliteTableCreator,
  text,
  integer,
} from "drizzle-orm/sqlite-core";
// import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
//export const createTable = sqliteTableCreator((name) => `save-spaces_${name}`);

export const users = sqliteTable(
  "user",
  {
    id: text("id", { length: 255 }).primaryKey(),
    publicId: text("public_id", { length: 255 }).notNull().unique(),
    username: text("name", { length: 255 }),
    hashedPassword: text("hashed_password", { length: 255 }),
    email: text("email", { length: 255 }).notNull(),
    // emailVerified: int("emailVerified", {
    //   mode: "timestamp",
    // }).default(sql`CURRENT_TIMESTAMP`),
    // image: text("image"),
  },
  (table) => {
    return {
      publicIdx: index("public_idx").on(table.publicId),
    };
  },
);

export const sessions = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: integer("expires_at").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  usersToGroups: many(usersToGroups),
  usersToSpaces: many(usersToSpaces),
}));

export const spaces = sqliteTable("space", {
  id: text("id", { length: 255 }).primaryKey(),
  name: text("name").notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  url: text("url"),
});

export const spacesRelations = relations(spaces, ({ many }) => ({
  usersToSpaces: many(usersToSpaces),
  spacesToGroups: many(spacesToGroups),
}));

export const groups = sqliteTable("group", {
  id: text("id", { length: 255 }).primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export const groupsRelations = relations(groups, ({ many }) => ({
  usersToGroups: many(usersToGroups),
  spacesToGroups: many(spacesToGroups),
}));

export const usersToGroups = sqliteTable(
  "users_to_groups",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    groupId: text("group_id")
      .notNull()
      .references(() => groups.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.groupId] }),
  }),
);

export const usersToGroupsRelations = relations(usersToGroups, ({ one }) => ({
  group: one(groups, {
    fields: [usersToGroups.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [usersToGroups.userId],
    references: [users.id],
  }),
}));

export const usersToSpaces = sqliteTable(
  "users_to_spaces",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    spaceId: text("space_id")
      .notNull()
      .references(() => spaces.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.spaceId] }),
  }),
);

export const usersToSpacesRelations = relations(usersToSpaces, ({ one }) => ({
  space: one(spaces, {
    fields: [usersToSpaces.spaceId],
    references: [spaces.id],
  }),
  user: one(users, {
    fields: [usersToSpaces.userId],
    references: [users.id],
  }),
}));

export const spacesToGroups = sqliteTable(
  "spaces_to_groups",
  {
    spaceId: text("space_id")
      .notNull()
      .references(() => spaces.id),
    groupId: text("group_id")
      .notNull()
      .references(() => groups.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.groupId, t.spaceId] }),
  }),
);

export const spacesToGroupsRelations = relations(spacesToGroups, ({ one }) => ({
  space: one(spaces, {
    fields: [spacesToGroups.spaceId],
    references: [spaces.id],
  }),
  group: one(groups, {
    fields: [spacesToGroups.groupId],
    references: [groups.id],
  }),
}));
