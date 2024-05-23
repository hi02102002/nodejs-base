import { createId } from '@paralleldrive/cuid2'
import {
  boolean,
  pgEnum,
  pgTable,
  text,
  uniqueIndex,
  varchar
} from 'drizzle-orm/pg-core'

export const roles = pgEnum('roles', ['ADMIN', 'USER'])

export const users = pgTable(
    'users',
    {
        id: varchar('id')
            .primaryKey()
            .$defaultFn(() => createId()),
        email: text('email').unique().notNull(),
        password: text('password'),
        name: text('name').notNull(),
        avatar: text('avatar'),
        roles: roles('role')
            .array()
            .$defaultFn(() => ['USER'])
            .notNull(),
        provider: text('provider').notNull().default('local'),
        isVerified: boolean('is_verified').default(true), // default true for testing
    },
    (table) => ({
        emailIdx: uniqueIndex('email_idx').on(table.email),
    }),
)
