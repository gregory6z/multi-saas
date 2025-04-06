import type { User } from "@/core/entities/User.js";
import type { HashProvider } from "@/providers/hash/hash-provider.js";
import type { UsersRepository } from "@/repositories/interfaces/users-repositories.interfaces.js";

interface CreateAccountRequest {
	name: string;
	email: string;
	password: string;
	tenantId: string;
	role?: "admin" | "manager" | "user";
}

interface CreateAccountResponse {
	user: User;
}

export class CreateAccountService {
	constructor(
		private usersRepository: UsersRepository,
		private hashProvider: HashProvider,
	) {}

	async execute({
		name,
		email,
		password,
		tenantId,
		role = "user",
	}: CreateAccountRequest): Promise<CreateAccountResponse> {
		const userWithSameEmail = await this.usersRepository.findByEmail(
			email,
			tenantId,
		);

		if (userWithSameEmail) {
			throw new Error("Email already in use.");
		}

		const passwordHash = await this.hashProvider.generateHash(password);

		const user = await this.usersRepository.create({
			name,
			email,
			passwordHash,
			tenantId,
			role,
		});

		return {
			user,
		};
	}
}
