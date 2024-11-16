from loguru import logger
import sqlite3
from datetime import datetime, timedelta


class UsageTracker:
    def __init__(self, db_path='machines_usage.db'):
        """
        Initialize the UsageTracker with the given database path and
        set up the database if it doesn't exist.
        """
        self.db_path = db_path
        self.init_db()
        logger.info("UsageTracker initialized")

    def init_db(self):
        """
        Initialize the SQLite database. Creates the machine_usage table
        if it doesn't already exist.
        """
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS machine_usage (
                    machine_id INTEGER,
                    use_date DATE,
                    use_count INTEGER,
                    PRIMARY KEY (machine_id, use_date)
                )
            ''')
            conn.commit()
        logger.info("Database initialized")

    def record_usage(self, machine_id: int):
        """
        Record the usage of a machine for the current date. If a record for the
        machine and date already exists, increment the use_count; otherwise,
        insert a new record.
        """
        today = datetime.now().date()
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO machine_usage (machine_id, use_date, use_count)
                VALUES (?, ?, 1)
                ON CONFLICT(machine_id, use_date) 
                DO UPDATE SET use_count = use_count + 1
            ''', (machine_id, today))
            conn.commit()
        logger.info(f"Recorded usage for machine {machine_id}")

    def get_usage_last_7_days(self, machine_id: int) -> dict:
        """
        Retrieve the usage data for the last 7 days for a specific machine.
        If there is no data, return an empty dictionary.
        
        :param machine_id: The ID of the machine to get usage data for.
        :return: A dictionary with dates as keys and use counts as values.
        """
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=6)

        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT use_date, use_count
                FROM machine_usage
                WHERE machine_id = ? AND use_date BETWEEN ? AND ?
                ORDER BY use_date
            ''', (machine_id, start_date, end_date))
            results = cursor.fetchall()

        if not results:
            return {}

        # Create a dictionary with all 7 days initialized to 0
        usage_dict = {(start_date + timedelta(days=i)).isoformat(): 0 for i in range(7)}

        # Update the dictionary with actual data from the database
        for date, count in results:
            usage_dict[date] = count

        logger.info(f"Retrieved usage data for machine {machine_id}")
        return usage_dict


# Instantiate a global usage_tracker instance
usage_tracker = UsageTracker()
