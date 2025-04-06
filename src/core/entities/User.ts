export interface User {
	id: string;
	tenantId: string;
	name: string;
	email: string;
	passwordHash: string;
	role: "admin" | "manager" | "user";
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateUserData {
	name: string;
	email: string;
	passwordHash: string;
	tenantId: string;
	role: "admin" | "manager" | "user";
}

export interface UpdateUserData {
	name?: string;
	email?: string;
	passwordHash?: string;
	role?: "admin" | "manager" | "user";
}
