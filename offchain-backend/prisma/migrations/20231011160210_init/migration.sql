-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('poll', 'announcement', 'content', 'invite');

-- CreateEnum
CREATE TYPE "MembershipRoles" AS ENUM ('member', 'founder', 'creator', 'specialist', 'invitee', 'invited_founder');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "chaos_user_id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vessel" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "chaose_channel_id" TEXT NOT NULL,
    "categories" TEXT[],
    "creator_id" TEXT NOT NULL,

    CONSTRAINT "Vessel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "chaos_participant_id" TEXT NOT NULL,
    "role" "MembershipRoles" NOT NULL DEFAULT 'invitee',
    "vessel_id" TEXT NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "PostType" NOT NULL DEFAULT 'content',
    "chaos_message_id" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invitation" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "due" TIMESTAMP(3) NOT NULL,
    "for" INTEGER NOT NULL,
    "against" INTEGER NOT NULL,
    "post_id" TEXT NOT NULL,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Content" (
    "id" TEXT NOT NULL,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "post_id" TEXT NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Poll" (
    "id" TEXT NOT NULL,
    "for" INTEGER NOT NULL DEFAULT 0,
    "against" INTEGER NOT NULL DEFAULT 0,
    "post_id" TEXT NOT NULL,

    CONSTRAINT "Poll_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "User"("address");

-- CreateIndex
CREATE UNIQUE INDEX "User_chaos_user_id_key" ON "User"("chaos_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Vessel_chaose_channel_id_key" ON "Vessel"("chaose_channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_chaos_participant_id_key" ON "Membership"("chaos_participant_id");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_post_id_key" ON "Invitation"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "Content_post_id_key" ON "Content"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "Poll_post_id_key" ON "Poll"("post_id");

-- AddForeignKey
ALTER TABLE "Vessel" ADD CONSTRAINT "Vessel_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "Vessel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poll" ADD CONSTRAINT "Poll_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
