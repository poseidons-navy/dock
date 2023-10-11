import { z } from 'zod';

const PostType = z.enum(['poll', 'announcement', 'content', 'invite']);
const MembershipRoles = z.enum(['member', 'founder', 'creator', 'specialist', 'invitee', 'invited_founder']);

const User = z.object({
  id: z.string().optional(),
  address: z.string().min(1), // Assuming minimum length of 1 for user address
  chaos_user_id: z.string()
});

const Vessel = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  chaose_channel_id: z.string(),
  categories: z.array(z.string()),
  creator_id: z.string(),
});

const Membership = z.object({
  id: z.string().optional(),
  user_id: z.string(),
  chaos_participant_id: z.string(),
  role: MembershipRoles.default('invitee'),
  vessel_id: z.string()
});

const Invitation = z.object({
  id: z.string().optional(),
  address: z.string(),
  due: z.string(), // Assuming due date is a date
  for: z.number(),
  against: z.number(),
  post_id: z.string(),
});

const Content = z.object({
  id: z.string().optional(),
  upvotes: z.number().default(0),
  downvotes: z.number().default(0),
  post_id: z.string(),
});

const Poll = z.object({
  id: z.string().optional(),
  for: z.number().default(0),
  against: z.number().default(0),
  post_id: z.string(),
});

const Post = z.object({
  id: z.string().optional(),
  user_id: z.string(),
  type: PostType.default('content'),
  chaos_message_id: z.string()
});

export const schemas = {
  PostType,
  MembershipRoles,
  User,
  Vessel,
  Membership,
  Invitation,
  Content,
  Poll,
  Post,
};
