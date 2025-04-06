import type { User } from "@/core/entities/User.js";
import type { UsersRepository } from "../interfaces/users-repositories.interfaces.js";
import { randomUUID } from "node:crypto";

export class InMemoryUsersRepository implements UsersRepository {
	public items: User[] = [];

	async findById(id: string): Promise<User | null> {
		const user = this.items.find((item) => item.id === id);

		if (!user) {
			return null;
		}

		return user;
	}

	async findByEmail(email: string, tenantId: string): Promise<User | null> {
		const user = this.items.find(
			(item) => item.email === email && item.tenantId === tenantId,
		);

		if (!user) {
			return null;
		}

		return user;
	}

	async create(
		data: Omit<User, "id" | "createdAt" | "updatedAt">,
	): Promise<User> {
		const user: User = {
			id: randomUUID(),
			...data,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		this.items.push(user);

		return user;
	}
}
