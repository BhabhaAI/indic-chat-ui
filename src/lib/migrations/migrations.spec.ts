import { afterEach, describe, expect, it } from "vitest";
import { migrations } from "./routines";
import { acquireLock, isDBLocked, refreshLock, releaseLock } from "./lock";
import { collections } from "$lib/server/database";

describe("migrations", () => {
	it("should not have duplicates guid", async () => {
		const guids = migrations.map((m) => m._id.toString());
		const uniqueGuids = [...new Set(guids)];
		expect(uniqueGuids.length).toBe(guids.length);
	});

	it("should acquire only one lock on DB", async () => {
		const results = await Promise.all(new Array(1000).fill(0).map(() => acquireLock()));
		const locks = results.filter((r) => r);

		const semaphores = await collections.semaphores.find({}).toArray();

		expect(locks.length).toBe(1);
		expect(semaphores).toBeDefined();
		expect(semaphores.length).toBe(1);
		expect(semaphores?.[0].key).toBe("migrations");
	});

	it("should read the lock correctly", async () => {
		expect(await acquireLock()).toBe(true);
		expect(await isDBLocked()).toBe(true);
		expect(await acquireLock()).toBe(false);
		await releaseLock();
		expect(await isDBLocked()).toBe(false);
	});

	it("should refresh the lock", async () => {
		await acquireLock();

		// get the updatedAt time

		const updatedAtInitially = (await collections.semaphores.findOne({}))?.updatedAt;

		await refreshLock();

		const updatedAtAfterRefresh = (await collections.semaphores.findOne({}))?.updatedAt;

		expect(updatedAtInitially).toBeDefined();
		expect(updatedAtAfterRefresh).toBeDefined();
		expect(updatedAtInitially).not.toBe(updatedAtAfterRefresh);
	});
});

afterEach(async () => {
	await collections.semaphores.deleteMany({});
	await collections.migrationResults.deleteMany({});
});
