import { Request, Response } from "express";
import { findUser } from "../models/userModel/userModel";
import {
  deleteCard,
  insertCard,
  selectAllCards,
} from "../models/cardModel/cardModel";

export const addCards = async (req: Request, res: Response) => {
  try {
    const { username, cards } = req.body;

    if (!Array.isArray(cards)) {
      return res.status(400).json({ message: "Неверный формат данных карт" });
    }

    const user = await findUser(username);

    if (!user || !user.id) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    for (const card of cards) {
      await insertCard(user.id, card);
    }

    return res.status(201).json({ message: "Карты успешно добавлены" });
  } catch (error) {
    console.error("Ошибка при добавлении карт:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const getAllCards = async (req: Request, res: Response) => {
  try {
    const { username } = req.query as { username: string };

    const user = await findUser(username);

    if (!user || !user.id) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const cards = await selectAllCards(user.id);

    return res.status(200).json({ cards });
  } catch (error) {
    console.error("Ошибка при получении карт:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const deleteCards = async (req: Request, res: Response) => {
  try {
    const { username, cards } = req.body;

    const user = await findUser(username);

    if (!user || !user.id) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    for (const card of cards) {
      await deleteCard(user.id, card);
    }

    return res.status(200).json({ message: "Карта успешно удалена" });
  } catch (error) {
    console.error("Ошибка при удалении карты:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
};
