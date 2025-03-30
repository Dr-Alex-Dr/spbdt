import { query } from "../../shared/db";

export const insertCard = async (userId: string, card: string) => {
  await query('INSERT INTO "Cards" (user_id, card_number) VALUES ($1, $2)', [
    userId,
    card,
  ]);
};

export const selectAllCards = async (userId: string) => {
  const result = await query(
    'SELECT card_number FROM "Cards" WHERE user_id = $1',
    [userId]
  );

  return result;
};

export const deleteCard = async (userId: string, card: string) => {
  await query('DELETE FROM "Cards" WHERE user_id = $1 AND card_number = $2', [
    userId,
    card,
  ]);
};
