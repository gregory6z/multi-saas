import { test, describe, beforeEach } from "node:test";
import assert from "node:assert";

import { CreateAccountService } from "./create-account.js";
import { InMemoryHashProvider } from "@/providers/hash/implementations/in-memory-hash-provider.js";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repositories.js";

describe("CreateAccountService", () => {
	let usersRepository: InMemoryUsersRepository;
	let hashProvider: InMemoryHashProvider;
	let sut: CreateAccountService; // System Under Test

	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		hashProvider = new InMemoryHashProvider();
		sut = new CreateAccountService(usersRepository, hashProvider);
	});

	test("should be able to create a new user account", async () => {
		const { user } = await sut.execute({
			name: "John Doe",
			email: "john@example.com",
			password: "123456",
			tenantId: "tenant-1",
		});

		assert.strictEqual(user.name, "John Doe");
		assert.strictEqual(user.email, "john@example.com");
		assert.strictEqual(user.tenantId, "tenant-1");
		assert.strictEqual(user.role, "user");
		assert.strictEqual(user.passwordHash, "hashed:123456");
		assert.ok(usersRepository.items.length === 1);
	});

	test("should be able to create a user with a specific role", async () => {
		const { user } = await sut.execute({
			name: "Admin User",
			email: "admin@example.com",
			password: "123456",
			tenantId: "tenant-1",
			role: "admin",
		});

		assert.strictEqual(user.role, "admin");
	});

	test("should not be able to create a user with an email that is already in use in the same tenant", async () => {
		await sut.execute({
			name: "John Doe",
			email: "john@example.com",
			password: "123456",
			tenantId: "tenant-1",
		});

		await assert.rejects(
			async () => {
				await sut.execute({
					name: "Another John",
					email: "john@example.com",
					password: "123456",
					tenantId: "tenant-1",
				});
			},
			(err: Error) => {
				assert.strictEqual(err.message, "Email already in use.");
				return true;
			},
		);
	});

	test("should be able to create users with the same email in different tenants", async () => {
		await sut.execute({
			name: "John Doe",
			email: "john@example.com",
			password: "123456",
			tenantId: "tenant-1",
		});

		await sut.execute({
			name: "John Doe",
			email: "john@example.com",
			password: "123456",
			tenantId: "tenant-2",
		});

		assert.strictEqual(usersRepository.items.length, 2);
	});
});
