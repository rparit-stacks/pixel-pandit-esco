import { prisma } from "./db";
import { SubscriptionStatus, MessageType } from "@prisma/client";

export const SUBSCRIPTION_PLANS = {
  BASIC: {
    id: "BASIC",
    name: "Basic",
    chatCredits: 5,
    features: [MessageType.TEXT],
  },
  PREMIUM: {
    id: "PREMIUM",
    name: "Premium",
    chatCredits: 20,
    features: [MessageType.TEXT, MessageType.MEDIA, MessageType.LOCATION],
  },
  ELITE: {
    id: "ELITE",
    name: "Elite",
    chatCredits: 50,
    features: [MessageType.TEXT, MessageType.MEDIA, MessageType.LOCATION, MessageType.VOICE],
  },
  UNLIMITED: {
    id: "UNLIMITED",
    name: "Unlimited",
    chatCredits: 9999, // Effectively unlimited
    isUnlimited: true,
    features: Object.values(MessageType),
  },
} as const;

/**
 * Checks if a user has an active subscription and available chat balance.
 * Returns the subscription object if valid, otherwise null.
 */
export async function getActiveSubscription(userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription) return null;

  // Check if status is ACTIVE and not expired
  const isActive = subscription.status === SubscriptionStatus.ACTIVE;
  const isNotExpired = subscription.expiresAt > new Date();

  if (!isActive || !isNotExpired) {
    // If expired, we might want to update the status in the background
    if (subscription.status === SubscriptionStatus.ACTIVE && !isNotExpired) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: SubscriptionStatus.EXPIRED },
      });
    }
    return null;
  }

  return subscription;
}

/**
 * Validates if a user can initiate a new chat request.
 * For Clients: Needs an active subscription with balance > 0 or unlimited.
 */
export async function canInitiateChat(userId: string): Promise<{
  allowed: boolean;
  reason?: string;
  subscription?: any;
}> {
  const subscription = await getActiveSubscription(userId);

  if (!subscription) {
    return { allowed: false, reason: "No active subscription found. Please upgrade your plan." };
  }

  if (!subscription.isUnlimited && subscription.chatBalance <= 0) {
    return { allowed: false, reason: "You have run out of chat credits. Please top up or upgrade." };
  }

  return { allowed: true, subscription };
}

/**
 * Validates if a user can send a specific type of message.
 */
export async function canSendMessageType(userId: string, type: MessageType): Promise<boolean> {
  const subscription = await getActiveSubscription(userId);
  if (!subscription) return false;

  const plan = SUBSCRIPTION_PLANS[subscription.planId as keyof typeof SUBSCRIPTION_PLANS];
  if (!plan) return type === MessageType.TEXT; // Default to text only if plan not found

  return (plan.features as readonly MessageType[]).includes(type);
}

/**
 * Deducts one chat credit from a user's balance.
 * Only if not unlimited.
 */
export async function deductChatCredit(userId: string) {
  const subscription = await getActiveSubscription(userId);

  if (!subscription || subscription.isUnlimited) return;

  if (subscription.chatBalance > 0) {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        chatBalance: {
          decrement: 1,
        },
      },
    });
  }
}
