export type IssuedCard = {
  cardId: string;
  last4: string;
  expiry: string;
  userId: string;
  name: string;
};

export async function issueCard(userId: string, name: string) {
  return {
    cardId: `card_${Math.random().toString(36).substring(2, 15)}`,
    userId,
    name,
    last4: "4242",
    expiry: "12/2028",
  };
}
