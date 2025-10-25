# FAQ: What does "Could not acquire lock(s)" mean?

"Could not acquire lock(s)" is a generic message indicating that a process tried to obtain exclusive access to a resource but failed within the configured timeout. Locks are used to prevent concurrent access that could cause corruption, race conditions, or inconsistent state.

Common places where this appears:
- Database-level locks
  - Relational DBs: row/table/index locks during transactions.
  - Distributed locks via a DB (e.g., MongoDB, PostgreSQL) using libraries like ShedLock or Spring Integration.
- Cache/Distributed systems
  - Redis (e.g., Redisson), ZooKeeper, or etcd-based locks for leader election or job scheduling.
- File system locks
  - A process tries to lock a file (for write/read) but another process holds it.
- Application schedulers/background jobs
  - Only one instance is allowed to run a scheduled job at a time; another instance can’t acquire the job lock.
- Build tools/SCM
  - Tools like Git, Maven, Gradle can leave lock files during operations; parallel runs may conflict.

Why it happens:
- Another process or thread currently holds the lock and hasn’t released it yet (still working or hung).
- The lock holder crashed, and a lock record/file wasn’t cleaned up (stale lock).
- The timeout for acquiring the lock is too short for current load/latency.
- Misconfiguration: multiple nodes compete for the same lock key unexpectedly.

How to troubleshoot:
1) Identify the locking mechanism in your context
   - Check logs around the error for the component/library (e.g., Redis/Redisson, ShedLock, Quartz, JDBC, file I/O).
   - Search your codebase for keywords: "lock", "ShedLock", "Redisson", "DistributedLock", "synchronized", "FileChannel#lock".

2) Verify whether a competing process holds the lock
   - For DB/Redis-backed locks, look for lock rows/keys/entries and see who owns them and their expiration.
   - For file locks, ensure no other process is using the same file.

3) Handle potential stale locks
   - Many systems provide TTL/expiration (e.g., lockAtMostFor in ShedLock, lease time in Redis). Set a reasonable maximum lock duration so a crashed holder doesn’t block forever.
   - If a lock entry is clearly stale and safe to clear, remove it manually following your ops procedures.

4) Tune timeouts and retries
   - Increase the wait time for acquiring locks when under normal high contention.
   - Add retry/backoff logic to reduce thundering herd effects.

5) Reduce contention
   - Use more granular lock keys.
   - Avoid long critical sections; move expensive work outside the locked segment.

6) Validate configuration in clustered deployments
   - Ensure each instance uses the correct instance ID and lock key patterns.
   - Confirm clock synchronization between nodes (important for time-based locks and TTLs).

Spring/Mongo context tips:
- If you use ShedLock with MongoDB or JDBC for scheduled jobs, set:
  - lockAtMostFor: prevents infinite locks when a node dies.
  - lockAtLeastFor: optional minimum holding time to avoid rapid re-entry.
  - Use consistent time sources and ensure indexes exist on the lock collection/table for performance.
- If using Redis for distributed locks (e.g., Redisson):
  - Use reasonable leaseTime and waitTime; handle InterruptedException and timeouts with retries.
- For file-based processing, prefer atomic renames or advisory locks and ensure proper close() in finally blocks.

When it’s safe to ignore:
- Transient contentions that resolve on retry and are expected in your workload. Still, monitor the frequency.

When to escalate:
- If locks persist far longer than expected, or the error blocks critical operations, investigate for deadlocks, long-running queries, crashed processes, or configuration drift.

If you encountered this message within this project:
- This repository currently doesn’t define a locking mechanism in code for business flows. The error likely originates from an external component (database/cache/scheduler) or an environment/tooling layer. Check service logs, database/Redis state, and any job schedulers in your deployment for lock ownership and timeouts.
