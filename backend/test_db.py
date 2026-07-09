import sqlite3

conn = sqlite3.connect("runbook.db")
cursor = conn.cursor()

cursor.execute("SELECT * FROM incidents")
rows = cursor.fetchall()

print(f"Total records: {len(rows)}")
print("-" * 80)

for row in rows:
    print(row)

conn.close()